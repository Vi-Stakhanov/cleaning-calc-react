import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

const BRAND_CONTACTS = {
  phone: '+7 (952) 807-02-06',
  telegram: '@vitalya_stakhanov',
  max: '+7 (952) 807-02-06',
};

const telegramHref = `https://t.me{BRAND_CONTACTS.telegram.replace('@', '')}`;
const maxHref = `https://max.ru{BRAND_CONTACTS.max.replace(/\D/g, '')}`;
const phoneHref = `tel:${BRAND_CONTACTS.phone.replace(/[^\d+]/g, '')}`;

const PLACES = [
  { icon: '📍', title: '2ГИС и Яндекс.Карты', text: 'Прямая ссылка в карточке компании — клиент узнаёт цену до звонка.' },
  { icon: '📱', title: 'VK, Telegram и MAX', text: 'В шапке профиля вместо однотипных вопросов в личку «сколько стоит?».' },
  { icon: '🌐', title: 'Виджет на ваш сайт', text: 'Плавающая кнопка в углу экрана: 3 строки кода, установка за 10 минут.' },
  { icon: '🧾', title: 'QR-код на точке', text: 'На визитке, акте работ или в зоне ожидания для повторных заказов.' },
];

const STEPS = [
  { num: '1', title: 'Присылаете данные', desc: 'Прайс-лист, логотип, название и контакты' },
  { num: '2', title: 'Настраиваем за 1–3 дня', desc: 'Переносим тарифы, формулы и тестируем' },
  { num: '3', title: 'Принимаете заказы', desc: 'Размещаете ссылку и получаете заявки' },
];

export default function MainPage() {
  useEffect(() => {
    document.title = 'Costyflow — готовое приложение для расчёта стоимости услуг';
  }, []);

  return (
    <div className="main-page theme-main">
      <header className="main-header">
        <div className="main-container main-header-inner">
          <a href="#" className="main-brand">
            <span className="main-brand-name">Costyflow</span>
          </a>

          <div className="main-header-contacts">
            <a href={phoneHref} className="main-header-phone">{BRAND_CONTACTS.phone}</a>
            <div className="main-header-socials">
              <a href={telegramHref} target="_blank" rel="noopener noreferrer" className="main-social-icon" aria-label="Telegram">
                <svg xmlns="http://w3.org" width="26" height="26" viewBox="0 0 48 48">
                  <path fill="currentColor" d="M41.42 7.309s3.885-1.515 3.56 2.164c-.107 1.515-1.078 6.818-1.834 12.553l-2.59 16.99s-.216 2.489-2.159 2.922c-1.942.432-4.856-1.515-5.396-1.948c-.432-.325-8.094-5.195-10.792-7.575c-.756-.65-1.62-1.948.108-3.463L33.649 18.13c1.295-1.3 2.59-4.33-2.806-.65l-15.11 10.28s-1.727 1.083-4.964.109l-7.016-2.165s-2.59-1.623 1.835-3.246c10.793-5.086 24.068-10.28 35.831-15.15"/>
                </svg>
              </a>
              <a href={maxHref} target="_blank" rel="noopener noreferrer" className="main-social-icon main-social-icon--max" aria-label="MAX">
                <svg xmlns="http://w3.org" width="26" height="26" viewBox="0 0 720 720">
                  <path fill="currentColor" d="M350.4,9.6C141.8,20.5,4.1,184.1,12.8,390.4c3.8,90.3,40.1,168,48.7,253.7,2.2,22.2-4.2,49.6,21.4,59.3,31.5,11.9,79.8-8.1,106.2-26.4,9-6.1,17.6-13.2,24.2-22,27.3,18.1,53.2,35.6,85.7,43.4,143.1,34.3,299.9-44.2,369.6-170.3C799.6,291.2,622.5-4.6,350.4,9.6h0ZM269.4,504c-11.3,8.8-22.2,20.8-34.7,27.7-18.1,9.7-23.7-.4-30.5-16.4-21.4-50.9-24-137.6-11.5-190.9,16.8-72.5,72.9-136.3,150-143.1,78-6.9,150.4,32.7,183.1,104.2,72.4,159.1-112.9,316.2-256.4,218.6h0Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="main-hero">
        <div className="main-container main-hero-inner">
          <div className="main-hero-text">
            <h1 className="main-title">Клиент сам считает цену — вы получаете готовую заявку</h1>
            <p className="main-lead">
              Веб-приложение для автомоек и клининговых компаний. Настраивается под ваш прайс,
              мгновенно открывается в браузере и присылает заявки с составом услуг в Telegram и на почту.
              20&nbsp;000&nbsp;₽ разово, 3&nbsp;000&nbsp;₽/мес поддержка.
            </p>
            <div className="main-hero-actions">
              <Link to="/carwash" className="main-btn main-btn--primary">Демо для автомойки</Link>
              <Link to="/cleaning" className="main-btn main-btn--dark">Демо для клининга</Link>
            </div>
            <p className="main-hero-links">
              Условия и состав: <Link to="/carwash/offer">для автомойки</Link> · <Link to="/cleaning/offer">для клининга</Link>
            </p>
          </div>

          <div className="main-hero-visual">
            <div className="main-browser">
              <div className="main-browser-bar">
                <span className="main-browser-dot"></span>
                <span className="main-browser-dot"></span>
                <span className="main-browser-dot"></span>
                <span className="main-browser-url">yourcompany.costyflow.ru</span>
              </div>
              <div className="main-browser-body">
                <img src="/images/hero-app.png" alt="Интерфейс приложения Costyflow" className="main-browser-img" />
              </div>
            </div>
            <div className="main-lead-toast">
              <div className="main-lead-toast-head">✓ Новая заявка в Telegram</div>
              <div className="main-lead-toast-text">
                Комплекс + антидождь + химчистка · <strong>9 800 ₽</strong> · +7 (913) 123-45-67
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="main-section main-section--alt" id="niches">
        <div className="main-container">
          <h2 className="main-h2">Два готовых решения</h2>
          <p className="main-sub">
            Демо — это лишь пример. Настроим любые категории, пакеты и формулы расчёта строго под ваш прайс-лист.
          </p>
          <div className="main-grid-2">
            <div className="main-card main-niche-card">
              <div className="main-niche-preview">
                <img src="/images/demo-carwash.png" alt="Приложение для автомойки" />
              </div>
              <div className="main-niche-body">
                <span className="main-tag">Автомойка и детейлинг</span>
                <h3 className="main-h3">Расчёт мойки, химчистки и защиты кузова</h3>
                <ul className="main-list">
                  <li>8 типов транспорта — от седана до фуры и спецтехники</li>
                  <li>Пакеты мойки: ополаскивание, кузов + коврики, комплекс</li>
                  <li>Химчистка и защита отдельным блоком для роста среднего чека</li>
                </ul>
                <div className="main-card-actions">
                  <Link to="/carwash" className="main-btn main-btn--primary">Открыть демо</Link>
                  <Link to="/carwash/offer" className="main-btn main-btn--ghost">Условия и КП</Link>
                </div>
              </div>
            </div>

            <div className="main-card main-niche-card">
              <div className="main-niche-preview">
                <img src="/images/demo-cleaning.png" alt="Приложение для клининга" />
              </div>
              <div className="main-niche-body">
                <span className="main-tag">Клининговые компании</span>
                <h3 className="main-h3">Расчёт уборки квартир, домов и офисов</h3>
                <ul className="main-list">
                  <li>Тарифы по видам уборки: поддерживающая, генеральная, после ремонта, офис</li>
                  <li>Гибкий расчёт по площади, количеству комнат и санузлов</li>
                  <li>9 допуслуг на виду: мытьё окон, химчистка мебели, техника</li>
                </ul>
                <div className="main-card-actions">
                  <Link to="/cleaning" className="main-btn main-btn--primary">Открыть демо</Link>
                  <Link to="/cleaning/offer" className="main-btn main-btn--ghost">Условия и КП</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="main-section" id="channels">
        <div className="main-container">
          <h2 className="main-h2">Где размещается приложение</h2>
          <p className="main-sub">Свой сайт не обязателен — приложение мгновенно открывается по прямой ссылке.</p>
          <div className="main-grid-4">
            {PLACES.map((item) => (
              <div className="main-card main-place-card" key={item.title}>
                <div className="main-place-icon">{item.icon}</div>
                <h3 className="main-h3">{item.title}</h3>
                <p className="main-text">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="main-card main-steps-card">
            {STEPS.map((step) => (
              <div className="main-step" key={step.num}>
                <span className="main-step-num">{step.num}</span>
                <div>
                  <div className="main-step-title">{step.title}</div>
                  <div className="main-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="main-section main-section--alt" id="pricing">
        <div className="main-container">
          <h2 className="main-h2">Стоимость запуска</h2>
          <p className="main-sub">Прозрачная цена без скрытых доплат — программист не нужен.</p>
          <div className="main-card main-pricing">
            <div className="main-price-col">
              <div className="main-price-block">
                <div className="main-price-value">20 000 ₽</div>
                <div className="main-price-label">настройка и запуск приложения, единоразово</div>
              </div>
              <div className="main-price-block">
                <div className="main-price-value">3 000 ₽/мес</div>
                <div className="main-price-label">обслуживание, хостинг, домен и обновление цен</div>
              </div>
            </div>
            <div className="main-price-col">
              <h3 className="main-h3">Что входит в запуск:</h3>
              <ul className="main-list">
                <li>Оформление: логотип, название, контакты, соцсети</li>
                <li>Настройка вашего прайс-листа и формул расчёта</li>
                <li>Свой адрес вида yourcompany.costyflow.ru с SSL</li>
                <li>Мгновенные заявки в Telegram и на почту</li>
                <li>Виджет-кнопка на сайт и QR-код</li>
              </ul>
            </div>
            <div className="main-price-foot">
              <p className="main-price-roi">
                Окупается за счёт новых обращений от клиентов, которым неудобно звонить и выяснять цену вручную.
              </p>
              <a href="#contact" className="main-btn main-btn--primary">Обсудить запуск</a>
            </div>
          </div>
        </div>
      </section>

      <section className="main-section" id="contact">
        <div className="main-container">
          <div className="main-contact">
            <h2 className="main-contact-title">Напишите нам — подготовим расчёт под ваш прайс</h2>
            <p className="main-contact-sub">Отвечаем в течение дня в удобном для вас мессенджере или по телефону.</p>
            <div className="main-contact-links">
              <a className="main-btn main-btn--white" href={telegramHref} target="_blank" rel="noopener noreferrer">
                Telegram · {BRAND_CONTACTS.telegram}
              </a>
              <a className="main-btn main-btn--white" href={maxHref} target="_blank" rel="noopener noreferrer">
                MAX · {BRAND_CONTACTS.max}
              </a>
              <a className="main-btn main-btn--outline-light" href={phoneHref}>
                Позвонить · {BRAND_CONTACTS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="main-footer">
        <div className="main-container main-footer-inner">
          <span>© 2026 Costyflow</span>
          <Link to="/privacy" className="main-footer-link">Политика конфиденциальности</Link>
        </div>
      </footer>
    </div>
  );
}
