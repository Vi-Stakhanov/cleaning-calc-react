/**
 * api/lead.js
 * Серверная функция Vercel (Node.js runtime): приём заявки с калькулятора
 * и отправка письма владельцу бизнеса через Yandex SMTP (nodemailer).
 *
 * Переменные окружения (задаются в настройках проекта Vercel):
 *   SMTP_USER  — логин ящика на Яндексе (отправитель)
 *   SMTP_PASS  — пароль приложения для SMTP
 *   LEAD_EMAIL — адрес получателя заявок
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
    priceRange,
    cleaningType,
    area,
    rooms,
    bathrooms,
    extras,
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

  // Допуслуги: список «название: цена», либо «нет»
  const extrasText =
    extras && extras.length > 0
      ? extras.map((e) => `${e.label}: ${e.price} ₽`).join('\n')
      : 'нет';

  // Письмо владельцу
  const mailOptions = {
    from: smtpUser,
    to: leadEmail,
    subject: `Новая заявка: ${cleaningType || 'не указан'}, ${area || 0} м²`,
    text: `
Имя: ${name}
Телефон: ${phone}
Способ связи: ${channel || 'не указан'}
Удобное время: ${time || 'не указано'}

Тип уборки: ${cleaningType || 'не указан'}
Площадь: ${area || 0} м²
Комнаты: ${rooms || 0}
Санузлы: ${bathrooms || 0}

Допуслуги:
${extrasText}

Итого: ${totalPrice || 0} ₽
Диапазон: ${priceRange || 'не указан'}
    `,
  };

  try {
    // Отправка письма владельцу через Yandex SMTP
    await transporter.sendMail(mailOptions);

    // Уведомление в Telegram (опционально): если переменных нет — пропускаем
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
      try {
        const telegramMessage = `🔔 Новая заявка\n\nИмя: ${name}\nТелефон: ${phone}\nСвязь: ${channel || 'не указан'}\nВремя: ${time || 'не указано'}\n\nТип: ${cleaningType || 'не указан'}\nПлощадь: ${area || 0} м²\nКомнаты: ${rooms || 0}\nСанузлы: ${bathrooms || 0}\n\nДопуслуги:\n${extrasText}\n\nИтого: ${totalPrice || 0} ₽\nДиапазон: ${priceRange || 'не указан'}`;

        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramMessage,
          }),
        });
      } catch (tgError) {
        // Ошибка Telegram не должна ломать основной ответ клиенту
        console.error('Telegram error:', tgError);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('SMTP error:', error);
    return res.status(500).json({ error: 'Ошибка отправки письма' });
  }
}
