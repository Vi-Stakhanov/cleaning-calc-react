/**
 * api/lead.js
 * Серверная функция Vercel (Node.js runtime): приём заявки с калькулятора
 * и отправка письма владельцу бизнеса через Yandex SMTP (nodemailer).
 * Мульти-клиентность: cleaning и carwash.
 * + Защита от спама/инъекций: guard-фильтр, валидация типов, rate-limit по IP.
 */
import nodemailer from 'nodemailer';

// --- Защита: маркеры атак ---
const BAD_MARKERS = [
  /waitfor/i, /delay\s*'/i, /select\s/i, /union\s/i, /--/, /;/, /\/\*/,
  /xp_/i, /\bexec\b/i, /\[object object\]/i, /sqli/i, /<script/i,
  /drop\s+table/i, /insert\s+into/i, /or\s+1=1/i,
];
const ALLOWED_ORIGINS = [
  /^https:\/\/([a-z0-9-]+\.)*costyflow\.ru$/i,
  /^http:\/\/localhost(:\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
  /^https:\/\/[a-z0-9-]+\.vercel\.app$/i,
];
const isStr = (v, max = 200) => typeof v === 'string' && v.length <= max;
const num = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

// --- Rate-limit по IP (не больше 5 заявок/мин) ---
const hits = (globalThis.__leadHits ||= new Map());
function rateLimited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60000);
  if (arr.length >= 5) { hits.set(ip, arr); return true; }
  arr.push(now); hits.set(ip, arr); return false;
}

// --- Очистка списков допуслуг/химчистки ---
function cleanList(list) {
  if (list == null) return [];
  if (!Array.isArray(list) || list.length > 50) return null;
  const out = [];
  for (const e of list) {
    if (!e || typeof e !== 'object') return null;
    const label = typeof e.label === 'string' ? e.label.slice(0, 120) : null;
    const price = num(e.price, 0, 10000000);
    const qty = num(e.qty == null ? 1 : e.qty, 1, 100);
    if (label === null || price === null || qty === null) return null;
    if (BAD_MARKERS.some((r) => r.test(label))) return null;
    out.push({ label, price, qty });
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate-limit
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    || req.socket?.remoteAddress || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  // Origin (если передан — только наши домены)
  const origin = req.headers.origin || '';
  if (origin && !ALLOWED_ORIGINS.some((r) => r.test(origin))) {
    return res.status(403).json({ error: 'Forbidden origin' });
  }

  const body = req.body || {};
  // Honeypot (скрытые поля, которые заполняют только боты)
  if (body.website || body.company_url) return res.status(400).json({ error: 'bad request' });

  const {
    name, phone, channel, time, totalPrice, serviceType, vehicleType,
    packagePrice, cleaningType, area, rooms, bathrooms, extras, chem,
  } = body;

  // Типы: строковые поля не должны быть объектами/числами
  for (const v of [name, phone, channel, time, serviceType, vehicleType, cleaningType]) {
    if (v !== undefined && v !== null && !isStr(v)) {
      return res.status(400).json({ error: 'bad field type' });
    }
  }
  if (!isStr(name, 60) || !name.trim()) {
    return res.status(400).json({ error: 'Имя обязательно' });
  }
  if (!isStr(phone, 25) || !/^\+?[\d\s\-()]{7,20}$/.test(phone.trim())) {
    return res.status(400).json({ error: 'Некорректный телефон' });
  }

  // Маркеры атак по всем строкам
  const combined = [name, phone, channel, time, serviceType, vehicleType, cleaningType]
    .filter((v) => typeof v === 'string').join(' | ');
  if (BAD_MARKERS.some((r) => r.test(combined))) {
    return res.status(400).json({ error: 'bad request' });
  }

  // Числа: сумма обязательна и > 0 (отсекает нулевой спам)
  const total = num(totalPrice, 1, 10000000);
  if (total === null) return res.status(400).json({ error: 'Некорректная сумма' });
  const pkg = packagePrice == null ? 0 : num(packagePrice, 0, 10000000);
  const areaN = area == null ? 0 : num(area, 0, 100000);
  const roomsN = rooms == null ? 0 : num(rooms, 0, 100);
  const bathsN = bathrooms == null ? 0 : num(bathrooms, 0, 100);
  if (pkg === null || areaN === null || roomsN === null || bathsN === null) {
    return res.status(400).json({ error: 'Некорректные числа' });
  }

  const extrasClean = cleanList(extras);
  const chemClean = cleanList(chem);
  if (extrasClean === null || chemClean === null) {
    return res.status(400).json({ error: 'bad services' });
  }

  // SMTP
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const leadEmail = process.env.LEAD_EMAIL;
  if (!smtpUser || !smtpPass || !leadEmail) {
    return res.status(500).json({ error: 'Сервер не настроен' });
  }
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru', port: 465, secure: true,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const fmt = (e) => `${e.label} — ${e.price} ₽${e.qty > 1 ? `× ${e.qty}` : ''}`;
  const extrasText = extrasClean.length ? extrasClean.map(fmt).join('\n') : 'нет';
  const chemText = chemClean.length ? chemClean.map(fmt).join('\n') : '';

  const isCarwash = !!vehicleType;
  const subject = isCarwash
    ? `Новая заявка (мойка): ${vehicleType || 'не указан'}, ${serviceType || 'не указан'}`
    : `Новая заявка: ${cleaningType || serviceType || 'не указан'}, ${areaN} м²`;

  const text = isCarwash
    ? `Имя: ${name}\nТелефон: ${phone}\nСпособ связи: ${channel || 'не указан'}\nУдобное время: ${time || 'не указано'}\n\nТип транспорта: ${vehicleType || 'не указан'}\nПакет услуг: ${serviceType || 'не указан'}\nЦена пакета: ${pkg} ₽\n\nДопуслуги:\n${extrasText}${chemText ? '\n\nХимчистка:\n' + chemText : ''}\n\nИтого: ${total} ₽`
    : `Имя: ${name}\nТелефон: ${phone}\nСпособ связи: ${channel || 'не указан'}\nУдобное время: ${time || 'не указано'}\n\nТип уборки: ${cleaningType || serviceType || 'не указан'}\nПлощадь: ${areaN} м²\nКомнаты: ${roomsN}\nСанузлы: ${bathsN}\n\nДопуслуги:\n${extrasText}${chemText ? '\n\nХимчистка:\n' + chemText : ''}\n\nИтого: ${total} ₽`;

  try {
    await transporter.sendMail({ from: smtpUser, to: leadEmail, subject, text });

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    if (telegramToken && telegramChatId) {
      try {
        const telegramMessage = `🔔 ${subject}\n\n${text}`;
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: telegramChatId, text: telegramMessage }),
        });
      } catch (tgError) { console.error('Telegram error:', tgError); }
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('SMTP error:', error);
    return res.status(500).json({ error: 'Ошибка отправки письма' });
  }
}
