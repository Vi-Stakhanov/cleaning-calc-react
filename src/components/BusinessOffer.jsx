import { useParams } from 'react-router-dom';
import { getClient } from '../config/clients.js';

export default function BusinessOffer() {
  const { clientId } = useParams();
  const client = getClient(clientId || 'cleaning');
  const offer = client.offer;

  // Очищаем номер для ссылки tel:
  const cleanPhone = client.phone.replace(/[^\d+]/g, '');

  return (
    <div className="offer-page">
      {/* Первый экран (Hero) */}
      <div className="hero-block">
        <span className="badge">Готовый сервис для вашего бизнеса — Запуск за 1–3 дня</span>
        <h1>{offer.title}</h1>
        <p className="lead">{offer.lead}</p>
        <div className="hero-actions">
          <a href={`/${client.id}`} target="_blank" rel="noopener noreferrer" className="button primary large">
            Попробовать демо-калькулятор →
          </a>
        </div>
      </div>

      {/* Боль */}
      <h2>Одна из важных причин, почему просмотры не превращаются в заказы</h2>
      <p className="lead">{offer.pain}</p>

      {/* Решение */}
      <h2>Как приложение упрощает расчёт и выбор услуг для клиентов и выделяет вас среди конкурентов</h2>
      <div className="benefits">
        {(offer.benefits ?? []).map((b, i) => (
          <div className="benefit" key={i}>
            <h3>{b.icon} {b.title}</h3>
            <p>{b.text}</p>
          </div>
        ))}
      </div>

      {/* Как проходит запуск */}
      <h2>Как проходит запуск: 3 простых шага</h2>
      <div className="steps">
        <div className="step">
          <h3>1. Присылаете данные и прайс</h3>
          <p>Отправляете список услуг с ценами, логотип, название компании и контакты для приёма заявок.</p>
        </div>
        <div className="step">
          <h3>2. Настраиваем приложение под вас</h3>
          <p>Переносим ваши тарифы, формулы расчёта и логотип на платформу Costyflow за 1–3 рабочих дня. Проверяем работу и передаём готовую ссылку.</p>
        </div>
        <div className="step">
          <h3>3. Размещаете ссылку и принимаете заказы</h3>
          <p>Добавляете приложение в 2ГИС, Яндекс.Карты, соцсети или на свой сайт — клиенты сами считают стоимость и обращаются к вам.</p>
        </div>
      </div>

      {/* Где подключается */}
      <h2>Где размещается калькулятор</h2>
      <div className="touchpoints">
        {(offer.touchpoints ?? []).map((t, i) => (
          <div className="touchpoint" key={i}>
            <h3>{t.icon} {t.title}</h3>
            <p>{t.text}</p>
          </div>
        ))}
      </div>

      {/* Стоимость */}
      <h2>Стоимость внедрения</h2>
      <div className="pricing">
        <p className="price-main">от 20 000 ₽ — настройка и запуск сервиса (единоразово)</p>
        <p className="price-sub">3 000 ₽/мес — обслуживание и техническая поддержка</p>
        
        <p className="price-includes">Что входит в стоимость:</p>
        <ul className="price-list">
          <li>✓ Брендирование под вашу компанию (название, цвета, контакты, соцсети)</li>
          <li>✓ Настройка вашего прайс-листа и формул расчёта</li>
          <li>✓ Хостинг, SSL-сертификат и ваш адрес (например, yourcompany.costyflow.ru)</li>
          <li>✓ Мгновенная отправка заявок в Telegram и на почту</li>
          <li>✓ Оперативное обновление цен и услуг по вашему запросу</li>
          <li>✓ Плавающий виджет-кнопка для установки на ваш сайт</li>
          <li>✓ Современный стек (React + облачный хостинг Vercel) — быстрое SPA-приложение, которое мгновенно открывается без перезагрузок даже при слабом мобильном интернете</li>
        </ul>

        <p className="price-note">
          Вам не нужен программист. Вам не нужно ничего администрировать — мы берём всю техническую часть на себя.
        </p>
        <p className="price-roi"><strong>Окупается за счёт новых заявок, которые раньше уходили без расчёта, и роста среднего чека.</strong></p>
      </div>

      {/* Повторный призыв к демо */}
      <div className="demo-cta">
        <a href={`/${client.id}`} target="_blank" rel="noopener noreferrer" className="button primary large">
          Протестировать живое демо →
        </a>
      </div>

      {/* Контакты */}
      <div className="contact-block">
        <h2>Хотите запустить такой же калькулятор?</h2>
        <p>Напишите нам — ответим на вопросы и подготовим расчёт под ваш прайс.</p>
        <p>
          <strong>Telegram:</strong>{' '}
          <a href={`https://t.me{client.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
            {client.telegram}
          </a>
        </p>
        <p>
          <strong>MAX:</strong> {client.max || client.phone}
        </p>
        <p>
          <strong>Телефон:</strong>{' '}
          <a href={`tel:${cleanPhone}`}>{client.phone}</a>
        </p>
        <p className="contact-note">Готовое решение на базе платформы Costyflow. Запуск за 1–3 дня.</p>
      </div>
    </div>
  );
}
