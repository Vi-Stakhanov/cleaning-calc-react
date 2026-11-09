const TO_EMAIL = 'cleaning@calclead.ru';
const TG_TOKEN = '8579684452:AAHdSdS7yOvZlM7SF5uXHHGmwIhK3fZ4bcs';
const TG_CHAT_ID = '7153157021';

// « × 2» только если количество больше 1
const fmtQty = (q) => (Number(q) > 1 ? ` × ${q}` : '');

function rowsHtml(list) {
  return list
    .map(
      (e) =>
        `<tr><td style="padding:4px 0;color:#333;">${e.label}</td><td style="padding:4px 0 4px 16px;color:#333;white-space:nowrap;">${e.price} ₽${fmtQty(e.qty)}</td></tr>`
    )
    .join('');
}

function buildEmailHtml(lead) {
  const extras = Array.isArray(lead.extras) ? lead.extras : [];
  const chem = Array.isArray(lead.chem) ? lead.chem : [];

  const paramsRows =
    lead.vehicleType !== undefined
      ? `
      <tr><td style="padding:4px 0;color:#666;">Тип транспорта:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.vehicleType}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Пакет услуг:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.serviceType}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Цена пакета:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.packagePrice} ₽</td></tr>`
      : `
      <tr><td style="padding:4px 0;color:#666;">Площадь:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.area} м²</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Комнат:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.rooms}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Санузлов:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.bathrooms}</td></tr>`;

  const extrasBlock = extras.length
    ? `<p style="margin:0 0 6px;font-weight:600;color:#333;">Допуслуги:</p>
       <table style="border-collapse:collapse;margin:0 0 16px;font-size:14px;">${rowsHtml(extras)}</table>`
    : '';

  const chemBlock = chem.length
    ? `<p style="margin:0 0 6px;font-weight:600;color:#333;">Химчистка:</p>
       <table style="border-collapse:collapse;margin:0 0 16px;font-size:14px;">${rowsHtml(chem)}</table>`
    : '';

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;">
    <h2 style="margin:0 0 16px;color:#0039d1;">Новая заявка с калькулятора</h2>
    <table style="border-collapse:collapse;margin:0 0 16px;font-size:14px;">
      <tr><td style="padding:4px 0;color:#666;">Имя:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.name}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Телефон:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.phone}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Способ связи:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.channel}</td></tr>
      <tr><td style="padding:4px 0;color:#666;">Удобное время:</td><td style="padding:4px 0 4px 8px;color:#333;font-weight:600;">${lead.time}</td></tr>
    </table>
    <table style="border-collapse:collapse;margin:0 0 16px;font-size:14px;">
      ${paramsRows}
    </table>
    ${extrasBlock}
    ${chemBlock}
    <p style="margin:0;font-size:16px;font-weight:700;color:#0039d1;">Итого: ${lead.totalPrice} ₽</p>
  </div>`;
}

function buildTelegramText(lead) {
  const extras = Array.isArray(lead.extras) ? lead.extras : [];
  const chem = Array.isArray(lead.chem) ? lead.chem : [];

  const paramsText =
    lead.vehicleType !== undefined
      ? `\nТип транспорта: ${lead.vehicleType}\nПакет услуг: ${lead.serviceType}\nЦена пакета: ${lead.packagePrice} ₽\n`
      : `\nПлощадь: ${lead.area} м²\nКомнат: ${lead.rooms}\nСанузлов: ${lead.bathrooms}\n`;

  const extrasText = extras.length
    ? `\nДопуслуги:\n${extras.map((e) => `${e.label} — ${e.price} ₽${fmtQty(e.qty)}`).join('\n')}\n`
    : '';

  const chemText = chem.length
    ? `\nХимчистка:\n${chem.map((e) => `${e.label} — ${e.price} ₽${fmtQty(e.qty)}`).join('\n')}\n`
    : '';

  return [
    '🚗 Новая заявка с калькулятора!',
    '',
    `👤 Имя: ${lead.name}`,
    `📞 Телефон: ${lead.phone}`,
    `📡 Способ связи: ${lead.channel}`,
    `🕐 Удобное время: ${lead.time}`,
    paramsText,
    extrasText,
    chemText,
    `💰 Итого: ${lead.totalPrice} ₽`,
  ].join('\n');
}

// Отправка одного канала с возвратом статуса и текста ответа
async function sendChannel(promise) {
  try {
    const r = await promise;
    const body = (await r.text().catch(() => '')).slice(0, 300);
    return { status: r.status, body };
  } catch (err) {
    return { status: 'network_error', body: String(err) };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const lead = req.body || {};

  if (!lead.phone || !lead.name) {
    return res.status(400).json({ ok: false, error: 'Имя и телефон обязательны' });
  }

  const emailHtml = buildEmailHtml(lead);
  const tgText = buildTelegramText(lead);

  const [emailInfo, tgInfo] = await Promise.all([
    sendChannel(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Калькулятор заявок <leads@calclead.ru>',
          to: TO_EMAIL,
          subject: `Заявка: ${lead.serviceType} — ${lead.totalPrice} ₽`,
          html: emailHtml,
        }),
      })
    ),
    sendChannel(
      fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text: tgText,
          parse_mode: 'HTML',
        }),
      })
    ),
  ]);

  const emailOk = emailInfo.status === 200 || emailInfo.status === 201;
  const tgOk = tgInfo.status === 200;

  return res.status(200).json({
    ok: true,
    emailOk,
    tgOk,
    debug: { email: emailInfo, telegram: tgInfo },
  });
}