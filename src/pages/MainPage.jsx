import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

const BRAND_CONTACTS = {
  phone: '+7 (952) 807-02-06',
  telegram: '@vitalya_stakhanov',
  max: '+7 (952) 807-02-06',
};

const telegramUrl = `https://t.me/${BRAND_CONTACTS.telegram.replace('@', '')}`;
const maxUrl = `https://max.ru/${BRAND_CONTACTS.max.replace(/\D/g, '')}`;
const phoneUrl = `tel:${BRAND_CONTACTS.phone.replace(/[^\d+]/g, '')}`;

export default function MainPage() {
  useEffect(() => {
    document.title = 'Costyflow — онлайн-калькуляторы стоимости услуг для бизнеса';
  }, []);

  return (
    <div className="main-page theme-main">
      {/* Hero */}
      <section className="main-hero">
        <div className="main-container">
          <div className="main-brand">
            <span className="main-logo">C</span>
            <span className="main-brand-name">Costyflow</span>
            <span className="main-badge">Запуск за 1–3 дня</span>
          </div>

          <h1 className="main-title">
            Онлайн-калькулятор стоимости услуг<br />для сервисного бизнеса
          </h1>

          <p className="main-lead">
            Costyflow — веб-приложение для автомоек и клининговых компаний. Клиент сам считает
            цену за 30 секунд, вы получаете готовую заявку с составом услуг, суммой и удобным
            способом связи.
          </p>

          <div className="main-hero-actions">
            <Link to="/carwash/offer" className="main-btn main-btn--red">Для автомоек</Link>
            <Link to="/cleaning/offer" className="main-btn main-btn--blue">Для клининга</Link>
          </div>

          <p className="main-hero-note">
            Без установки и регистрации · Работает с телефона и компьютера
          </p>
        </div>
      </section>

      {/* Направления */}
      <section className="main-section">
        <div className="main-container">
          <h2 className="main-h2">Выберите ваше направление</h2>
          <p className="main-sub">
            Каждое решение настроено под специфику бизнеса: свои типы услуг, параметры расчёта
            и структура заявки.
          </p>

          <div className="main-niches">
            <div className="main-niche main-niche--red">
              <div className="main-niche-icon" aria-hidden="true">🚗</div>
              <h3 className="main-niche-title">Для автомоек</h3>
              <p className="main-niche-text">
                Клиент выбирает тип транспорта — от седана до фуры, пакет мойки, защиту кузова
                и химчистку. Сразу видит точную сумму под свой автомобиль.
              </p>
              <ul className="main-niche-points">
                <li>Пакеты и допуслуги по категориям</li>
                <li>Химчистка с ценами под каждый тип авто</li>
                <li>Заявка на запись с составом работ</li>
              </ul>
              <div className="main-niche-actions">
                <Link to="/carwash" className="main-btn main-btn--solid">Посмотреть демо</Link>
                <Link to="/carwash/offer" className="main-btn main-btn--ghost">Условия и стоимость</Link>
              </div>
            </div>

            <div className="main-niche main-niche--blue">
              <div className="main-niche-icon" aria-hidden="true">🧹</div>
              <h3 className="main-niche-title">Для клининговых компаний</h3>
              <p className="main-niche-text">
                Клиент указывает площадь, тип уборки, комнаты и санузлы, добавляет мытьё окон
                и химчистку мебели. Получает честный расчёт без звонка менеджеру.
              </p>
              <ul className="main-niche-points">
                <li>Расчёт по площади и типу уборки</li>
                <li>Допуслуги всегда перед глазами</li>
                <li>Заявка с параметрами помещения</li>
              </ul>
              <div className="main-niche-actions">
                <Link to="/cleaning" className="main-btn main-btn--solid">Посмотреть демо</Link>
                <Link to="/cleaning/offer" className="main-btn main-btn--ghost">Условия и стоимость</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="main-section main-section--alt">
        <div className="main-container">
          <h2 className="main-h2">Как это работает</h2>
          <div className="main-steps">
            <div className="main-step">
              <div className="main-step-n">01</div>
              <h3 className="main-step-title">Клиент переходит по ссылке</h3>
              <p className="main-step-text">
                Из карточки в 2ГИС или Яндекс.Картах, из шапки соцсетей, по QR-коду или через
                кнопку-виджет на вашем сайте. Приложение открывается в браузере без установки.
              </p>
            </div>
            <div className="main-step">
              <div className="main-step-n">02</div>
              <h3 className="main-step-title">Сам считает стоимость</h3>
              <p className="main-step-text">
                Выбирает услуги и параметры под свою задачу и за 30 секунд видит итоговый чек.
                Не нужно звонить, писать в личку и ждать расчёта.
              </p>
            </div>
            <div className="main-step">
              <div className="main-step-n">03</div>
              <h3 className="main-step-title">Вы получаете готовую заявку</h3>
              <p className="main-step-text">
                В заявке имя, телефон, полный состав услуг, сумма, удобный способ связи и время
                для ответа. Менеджер сразу говорит по делу.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Где размещается */}
      <section className="main-section">
        <div className="main-container">
          <h2 className="main-h2">Где размещается приложение</h2>
          <p className="main-sub">
            Одна ссылка работает во всех каналах, где вас уже находят клиенты.
          </p>
          <div className="main-places">
            <div className="main-place">
              <span className="main-place-icon" aria-hidden="true">📍</span>
              <strong className="main-place-title">2ГИС</strong>
              <span className="main-place-text">Прямая ссылка в карточке компании</span>
            </div>
            <div className="main-place">
              <span className="main-place-icon" aria-hidden="true">🗺️</span>
              <strong className="main-place-title">Яндекс.Карты</strong>
              <span className="main-place-text">Перехват горячего трафика «рядом»</span>
            </div>
            <div className="main-place">
              <span className="main-place-icon" aria-hidden="true">📱</span>
              <strong className="main-place-title">VK, Telegram, MAX</strong>
              <span className="main-place-text">Ссылка в шапке профиля и постах</span>
            </div>
            <div className="main-place">
              <span className="main-place-icon" aria-hidden="true">🌐</span>
              <strong className="main-place-title">Виджет на сайте</strong>
              <span className="main-place-text">Плавающая кнопка, код из 3 строк</span>
            </div>
            <div className="main-place">
              <span className="main-place-icon" aria-hidden="true">🧾</span>
              <strong className="main-place-title">QR-код</strong>
              <span className="main-place-text">Визитка, акт работ, зона ожидания</span>
            </div>
          </div>
        </div>
      </section>

      {/* Стоимость */}
      <section className="main-section main-section--alt">
        <div className="main-container">
          <h2 className="main-h2">Стоимость</h2>
          <div className="main-pricing">
            <div className="main-price-head">
              <div className="main-price-row">
                <div className="main-price-value">20 000 ₽</div>
                <div className="main-price-label">настройка и запуск, единоразово</div>
              </div>
              <div className="main-price-row">
                <div className="main-price-value">3 000 ₽</div>
                <div className="main-price-label">в месяц — обслуживание и поддержка</div>
              </div>
            </div>

            <h3 className="main-included-title">Что входит:</h3>
            <ul className="main-included">
              <li>Оформление под вашу компанию: логотип, название, контакты, ссылки</li>
              <li>Настройка вашего прайс-листа и формул расчёта</li>
              <li>Домен, SSL-сертификат и ваш адрес вида yourcompany.costyflow.ru</li>
              <li>Мгновенная отправка заявок в Telegram и на почту</li>
              <li>Обновление цен и услуг по вашему запросу</li>
              <li>Плавающий виджет-кнопка для установки на ваш сайт</li>
              <li>Быстрое SPA-приложение: открывается даже при слабом мобильном интернете</li>
            </ul>

            <p className="main-price-note">
              Вам не нужен программист и не нужно ничего администрировать — всю техническую
              часть берём на себя. Запуск за 1–3 рабочих дня после получения прайса и данных
              компании.
            </p>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section className="main-section">
        <div className="main-container">
          <div className="main-contact">
            <h2 className="main-contact-title">Хотите такой калькулятор под ваш бизнес?</h2>
            <p className="main-contact-sub">
              Напишите — ответим на вопросы и подготовим расчёт под ваш прайс.
            </p>
            <div className="main-contact-links">
              <a className="main-contact-link" href={telegramUrl}>
                Telegram · {BRAND_CONTACTS.telegram}
              </a>
              <a className="main-contact-link" href={maxUrl}>
                MAX · {BRAND_CONTACTS.max}
              </a>
              <a className="main-contact-link" href={phoneUrl}>
                Телефон · {BRAND_CONTACTS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="main-footer">
        <div className="main-container main-footer-inner">
          <span className="main-footer-copy">© 2026 Costyflow</span>
          <Link to="/privacy" className="main-footer-link">Политика конфиденциальности</Link>
        </div>
      </footer>
    </div>
  );
}
