/**
 * api/lead.js
 * Серверная функция Vercel: приём заявки с калькулятора и отправка
 * письма владельцу бизнеса через Yandex SMTP (nodemailer).
 *
 * Переменные окружения (задаются в настройках проекта Vercel):
 *   SMTP_USER  — логин ящика на Яндексе (отправитель)
 *   SMTP_PASS  — пароль приложения для SMTP
 *   LEAD_EMAIL — адрес получателя заявок
 */
import nodemailer from 'nodemailer';

// Справочник подписей доп. услуг (зеркало src/config/pricing.js).
// Держим названия на сервере, чтобы не доверять произвольному тексту
// из запроса клиента.
const EXTRA_LABELS = {
  windows: 'Мытьё окон',
  sofaDryClean: 'Химчистка дивана',
  chairDryClean: 'Химчистка кресла',
  carpetDryClean: 'Химчистка ковра',
  fridge: 'Чистка холодильника',
  oven: 'Чистка духовки',
  microwave: 'Чистка микроволновки',
  balcony: 'Уборка балкона',
  ironing: 'Глажка',
};

/**
 * Приводит объект доп. услуг { id: количество } к человекочитаемому
 * списку: «Мытьё окон — 3; Чистка духовки — 1».
 */
function formatExtras(extras) {
  const parts = Object.entries(extras || {})
    .filter(([, qty]) => Number(qty) > 0)
    .map(([id, qty]) => `${EXTRA_LABELS[id] ?? id} — ${qty}`);
  return parts.length ? parts.join('; ') : 'нет';
}

/**
 * Обработчик Vercel Serverless Function (Node.js runtime).
 * Формат req/res — стандартный для Node-функций Vercel: тело запроса
 * уже распарсено (req.body), ответы отдаём через res.status().json().
 * @param {import('http').IncomingMessage} req  — POST-запрос с JSON-телом заявки
 * @param {import('http').ServerResponse}  res  — объект ответа
 */
export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Метод не поддерживается' });
  }

  // Читаем тело запроса; Vercel парсит JSON сам, но на случай пустого
  // или битого тела (req.body === undefined) отвечаем 400
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Некорректный JSON' });
  }
  const lead = body;

  // Валидация обязательных полей: имя и телефон
  const name = String(lead?.name ?? '').trim();
  const phone = String(lead?.phone ?? '').trim();
  if (!name || !phone) {
    return res.status(400).json({ ok: false, error: 'Имя и телефон обязательны' });
  }

  // Проверка наличия секретов в окружении
  const { SMTP_USER, SMTP_PASS, LEAD_EMAIL } = process.env;
  if (!SMTP_USER || !SMTP_PASS || !LEAD_EMAIL) {
    return res.status(500).json({ ok: false, error: 'Сервер не настроен (нет SMTP_* / LEAD_EMAIL)' });
  }

  // Тема письма: «Новая заявка: <тип уборки>, <площадь> м²»
  const cleaningType = String(lead.cleaningType ?? '—');
  const area = lead.area ?? '?';
  const subject = `Новая заявка: ${cleaningType}, ${area} м²`;

  // Текстовое тело письма — все данные заявки построчно
  const range = Array.isArray(lead.priceRange) ? lead.priceRange.join(' – ') : '—';
  const text = [
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Способ связи: ${lead.channel ?? '—'}`,
    `Удобное время: ${lead.time ?? '—'}`,
    '',
    `Тип уборки: ${cleaningType}`,
    `Площадь: ${area} м²`,
    `Комнаты: ${lead.rooms ?? '—'}`,
    `Санузлы: ${lead.bathrooms ?? '—'}`,
    `Допуслуги: ${formatExtras(lead.extras)}`,
    '',
    `Итоговая цена: ${lead.totalPrice ?? '—'} ₽`,
    `Диапазон цены: ${range} ₽`,
  ].join('\n');

  try {
    // Транспорт создаём на каждый вызов — env может меняться между
    // «холодными стартами» функции
    const transporter = nodemailer.createTransport({
      host: 'smtp.yandex.ru',
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"Калькулятор уборки" <${SMTP_USER}>`,
      to: LEAD_EMAIL,
      subject,
      text,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    // Детали SMTP-ошибки клиенту не отдаём, логируем на стороне функции
    console.error('Ошибка отправки письма:', err?.message);
    return res.status(500).json({ ok: false, error: 'Не удалось отправить письмо' });
  }
}
