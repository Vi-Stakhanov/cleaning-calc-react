/**
api/lead.js
Серверная функция Vercel (Node.js runtime): приём заявки с калькулятора
и отправка письма владельцу бизнеса через Yandex SMTP (nodemailer).
Мульти-клиентность: cleaning и carwash.
Переменные окружения (задаются в настройках проекта Vercel):
SMTP_USER  — логин ящика на Яндексе (отправитель)
SMTP_PASS  — пароль приложения для SMTP
LEAD_EMAIL — адрес получателя заявок
*/
import nodemailer from 'nodemailer';
export default async function handler(req, res) {
// Принимаем только POST
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}
// Тело запроса (Vercel парсит JSON автоматически)
const {
name,
phone,
channel,
time,
totalPrice,
serviceType,
vehicleType,
packagePrice,
cleaningType,
area,
rooms,
bathrooms,
extras,
chem, // <-- ДОБАВЛЕНО ПОЛЕ CHEM
} = req.body;
// Валидация обязательных полей
if (!name || !phone) {
return res.status(400).json({ error: 'Имя и телефон обязательны' });
}
// Настройки SMTP берутся из переменных окружения
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const leadEmail = process.env.LEAD_EMAIL;
if (!smtpUser || !smtpPass || !leadEmail) {
return res.status(500).json({ error: 'Сервер не настроен' });
}
// Транспортер Yandex SMTP
const transporter = nodemailer.createTransport({
host: 'smtp.yandex.ru',
port: 465,
secure: true,
auth: {
user: smtpUser,
pass: smtpPass,
},
});
// Допуслуги: список «название — цена», если qty > 1 — добавляем × N
const extrasText =
Array.isArray(extras) && extras.length > 0
? extras
.map((e) => {
const qty = e.qty || 1;
const qtyText = qty > 1 ? `× ${qty}` : '';
return `${e.label} — ${e.price} ₽${qtyText}`;
})
.join('\n')
: 'нет';
// Химчистка: отдельный список (если есть)
const chemText =
Array.isArray(chem) && chem.length > 0
? chem
.map((e) => {
const qty = e.qty || 1;
const qtyText = qty > 1 ? `× ${qty}` : '';
return `${e.label} — ${e.price} ₽${qtyText}`;
})
.join('\n')
: '';
// Определяем тип заявки: автомойка или клининг
const isCarwash = !!vehicleType;
// Subject письма
const subject = isCarwash
? `Новая заявка (мойка): ${vehicleType || 'не указан'}, ${serviceType || 'не указан'}`
: `Новая заявка: ${cleaningType || serviceType || 'не указан'}, ${area || 0} м²`;
// Тело письма
const text = isCarwash
? `Имя: ${name}
Телефон: ${phone}
Способ связи: ${channel || 'не указан'}
Удобное время: ${time || 'не указано'}
Тип транспорта: ${vehicleType || 'не указан'}
Пакет услуг: ${serviceType || 'не указан'}
Цена пакета: ${packagePrice || 0} ₽
Допуслуги:
${extrasText}
${chemText ? 'Химчистка:\n' + chemText : ''}
Итого: ${totalPrice || 0} ₽`:`Имя: ${name}
Телефон: ${phone}
Способ связи: ${channel || 'не указан'}
Удобное время: ${time || 'не указано'}
Тип уборки: ${cleaningType || serviceType || 'не указан'}
Площадь: ${area || 0} м²
Комнаты: ${rooms || 0}
Санузлы: ${bathrooms || 0}
Допуслуги:
${extrasText}
${chemText ? 'Химчистка:\n' + chemText : ''}
Итого: ${totalPrice || 0} ₽`;
// Письмо владельцу
const mailOptions = {
from: smtpUser,
to: leadEmail,
subject,
text,
};
try {
// Отправка письма владельцу через Yandex SMTP
await transporter.sendMail(mailOptions);
// Уведомление в Telegram (опционально)
 const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
 const telegramChatId = process.env.TELEGRAM_CHAT_ID;
 if (telegramToken && telegramChatId) {
   try {
     const telegramMessage = isCarwash
       ? `🔔 Новая заявка (мойка)\n\nИмя: ${name}\nТелефон: ${phone}\nСвязь: ${channel || 'не указан'}\nВремя: ${time || 'не указано'}\n\nТип транспорта: ${vehicleType || 'не указан'}\nПакет: ${serviceType || 'не указан'}\nЦена пакета: ${packagePrice || 0} ₽\n\nДопуслуги:\n${extrasText}${chemText ? '\n\nХимчистка:\n' + chemText : ''}\n\nИтого: ${totalPrice || 0} ₽`
       : `🔔 Новая заявка\n\nИмя: ${name}\nТелефон: ${phone}\nСвязь: ${channel || 'не указан'}\nВремя: ${time || 'не указано'}\n\nТип: ${cleaningType || serviceType || 'не указан'}\nПлощадь: ${area || 0} м²\nКомнаты: ${rooms || 0}\nСанузлы: ${bathrooms || 0}\n\nДопуслуги:\n${extrasText}${chemText ? '\n\nХимчистка:\n' + chemText : ''}\n\nИтого: ${totalPrice || 0} ₽`;
     await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         chat_id: telegramChatId,
         text: telegramMessage,
       }),
     });
   } catch (tgError) {
     console.error('Telegram error:', tgError);
   }
 }
 return res.status(200).json({ ok: true });
} catch (error) {
console.error('SMTP error:', error);
return res.status(500).json({ error: 'Ошибка отправки письма' });
}
}