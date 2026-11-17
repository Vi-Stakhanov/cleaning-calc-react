import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';

const BRAND_CONTACTS = {
  phone: '+7 (952) 807-02-06',
  telegram: '@vitalya_stakhanov',
  max: '+7 (952) 807-02-06',
};

const telegramHref = `https://t.me/${BRAND_CONTACTS.telegram.replace('@', '')}`;
const maxHref = `https://max.ru/${BRAND_CONTACTS.max.replace(/\D/g, '')}`;
const phoneHref = `tel:${BRAND_CONTACTS.phone.replace(/[^\d+]/g, '')}`;

export default function MainPage() {
  useEffect(() => {
    document.title = 'Costyflow — онлайн-калькуляторы стоимости услуг для бизнеса';
  }, []);

  return (
    <div className="main-page theme-main">

      {/* ===== HERO ===== */}
      <section className="main-hero">
        <div className="main-container main-hero-inner">
          <div className="main-hero-text">
            <div className="main-brand">
              <span className="main-logo">C</span>
              <span className="main-brand-name">Costyflow</span>
              <span className="main-badge">Готовое решение · запуск 1–3 дня</span>
            </div>
            <h1 className="main-title">Клиент сам считает цену — вы получаете готовую заявку</h1>
            <p className="main-lead">
              Калькулятор для автомоек и клининговых компаний. Подключается под ваш прайс,
              присылает заявки с составом услуг и суммой в Telegram и на почту.
              20&nbsp;000&nbsp;₽ разово, 3&nbsp;000&nbsp;₽/мес поддержка.
            </p>
            <div className="main-hero-actions">
              <Link to="/carwash" className="main-btn main-btn--red">Демо для автомойки</Link>
              <Link to="/cleaning" className="main-btn main-btn--blue">Демо для клининга</Link>
            </div>
            <p className="main-hero-links">
              Условия:{' '}
              <Link to="/carwash/offer">для автомойки</Link>
              {' · '}
              <Link to="/cleaning/offer">для клининга</Link>
            </p>
          </div>

          <div className="main-hero-visual">
            <div className="main-mock">
              <div className="main-mock-head">Калькулятор · МойкаПро</div>
              <div className="main-mock-row">
                <span>Комплекс · Внедорожник</span>
                <span className="main-mock-price">1 200 ₽</span>
              </div>
              <div className="main-mock-row">
                <span>+ Антидождь</span>
                <span className="main-mock-price">1 000 ₽</span>
              </div>
              <div className="main-mock-row">
                <span>+ Химчистка сидений ×2</span>
                <span className="main-mock-price">3 400 ₽</span>
              </div>
              <div className="main-mock-total">5 600 ₽</div>
              <div className="main-mock-btn">Отправить заявку</div>
            </div>
            <div className="main-mock-mini">
              <div className="main-mock-mini-check">✓ Заявка отправлена</div>
              <div className="main-mock-mini-text">
                МойкаПро · +7 (913) 123-45-67 · Telegram, удобно сейчас
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== БЛОК БОЛИ ===== */}
      <section className="main-section main-section--alt">
        <div className="main-container">
          <h2 className="main-h2">Почему вы теряете клиентов, которые уже вас нашли</h2>
          <p className="main-sub">Они пришли в вашу карточку в 2ГИС или на Картах. Дальше — так:</p>
          <div className="main-pain-grid">
            <div className="main-pain main-pain--blue">
              <p className="main-pain-line">&mdash; Сколько стоит генеральная на двушку?</p>
              <p className="main-pain-line">&mdash; Ну, примерно девять тысяч…</p>
              <p className="main-pain-line">&mdash; Я подумаю.</p>
              <p className="main-pain-conclusion">
                Клиент «думает» два дня и заказывает у тех, кто назвал цену сразу и точно.
              </p>
            </div>
            <div className="main-pain main-pain--red">
              <p className="main-pain-line">&mdash; Комплекс на внедорожник сколько?</p>
              <p className="main-pain-line">&mdash; 1 200. &mdash; А с химчисткой?</p>
              <p className="main-pain-line">&mdash; Ну… около шести, наверное.</p>
              <p className="main-pain-conclusion">
                Разные суммы по телефону — клиент не понимает, за что платит, и уезжает.
              </p>
            </div>
          </div>
          <p className="main-pain-outro">
            Калькулятор показывает точную цену из вашего прайса за 30 секунд.
            Одинаково для всех, без админа.
          </p>
        </div>
      </section>

      {/* ===== БЛОК ЗАЯВОК ===== */}
      <section className="main-section">
        <div className="main-container">
          <h2 className="main-h2">Заявка, которую вы получаете</h2>
          <p className="main-sub">Не «перезвоните мне», а готовый состав заказа.</p>
          <div className="main-leads-grid">
            <div className="main-lead-card">
              <div className="main-lead-head">🧾 Заявка · КлинингПро</div>
              <div className="main-lead-row"><span>Тип:</span> Генеральная</div>
              <div className="main-lead-row"><span>Площадь:</span> 53 м² · 2 комнаты · 1 санузел</div>
              <div className="main-lead-row"><span>Допуслуги:</span> мытьё окон (3), химчистка дивана</div>
              <div className="main-lead-total">Итого: 14 710 ₽</div>
              <div className="main-lead-contact">Связь: Telegram, 14:00–18:00 · +7 (913) 123-45-67, Алексей</div>
            </div>
            <div className="main-lead-card">
              <div className="main-lead-head">🧾 Заявка · МойкаПро</div>
              <div className="main-lead-row"><span>Транспорт:</span> Внедорожник</div>
              <div className="main-lead-row"><span>Пакет:</span> Комплекс</div>
              <div className="main-lead-row"><span>Допуслуги:</span> антидождь, химчистка сидений (2)</div>
              <div className="main-lead-total">Итого: 5 600 ₽</div>
              <div className="main-lead-contact">Связь: позвонить сейчас · +7 (913) 123-45-67, Дмитрий</div>
            </div>
          </div>
          <p className="main-pain-outro">
            Вы перезваниваете с готовым ответом: что считали, сколько, когда удобно.
          </p>
        </div>
      </section>

      {/* ===== БЛОК НИШ ===== */}
      <section className="main-section main-section--alt">
        <div className="main-container">
          <h2 className="main-h2">Два готовых решения</h2>
          <p className="main-sub">В демо — реальные цены. Ваши настроим под ваш прайс-лист.</p>
          <div className="main-niches">
            <div className="main-niche main-niche--red">
              <div className="main-niche-title">🚗 Автомойка и химчистка</div>
              <ul className="main-niche-prices">
                <li>Пакеты: ополаскивание 350 ₽ · кузов+коврики 500 ₽ · комплекс 900 ₽ (седан)</li>
                <li>8 типов транспорта — до фуры 2 900 ₽ и спецтехники 3 150 ₽</li>
                <li>Химчистка и защита отдельным блоком: антидождь 1 000 ₽, потолок 3 500 ₽</li>
              </ul>
              <div className="main-niche-actions">
                <Link to="/carwash" className="main-btn main-btn--solid">Демо</Link>
                <Link to="/carwash/offer" className="main-btn main-btn--ghost">Условия и стоимость</Link>
              </div>
            </div>
            <div className="main-niche main-niche--blue">
              <div className="main-niche-title">🧹 Клининг</div>
              <ul className="main-niche-prices">
                <li>Тарифы: поддерживающая 90 ₽/м² · офис 120 · генеральная 170 · после ремонта 250</li>
                <li>Расчёт по площади, комнатам и санузлам</li>
                <li>9 допуслуг: окна 400 ₽/окно, диван 2 000 ₽, духовка 600 ₽</li>
              </ul>
              <div className="main-niche-actions">
                <Link to="/cleaning" className="main-btn main-btn--solid">Демо</Link>
                <Link to="/cleaning/offer" className="main-btn main-btn--ghost">Условия и стоимость</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== БЛОК КАНАЛОВ ===== */}
      <section className="main-section">
        <div className="main-container">
          <h2 className="main-h2">Где клиент встречает калькулятор</h2>
          <div className="main-places">
            <div className="main-place">
              <div className="main-place-title">📍 2ГИС, Яндекс.Карты</div>
              <div className="main-place-text">ссылка в карточке: цена видна до звонка</div>
            </div>
            <div className="main-place">
              <div className="main-place-title">📱 VK, Telegram, MAX</div>
              <div className="main-place-text">в шапке профиля вместо «скиньте прайс»</div>
            </div>
            <div className="main-place">
              <div className="main-place-title">🌐 Ваш сайт</div>
              <div className="main-place-text">плавающая кнопка: 3 строки кода, 10 минут</div>
            </div>
            <div className="main-place">
              <div className="main-place-title">🧾 QR-код</div>
              <div className="main-place-text">визитка, акт работ, зона ожидания</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== БЛОК СТОИМОСТИ ===== */}
      <section className="main-section main-section--alt">
        <div className="main-container">
          <h2 className="main-h2">Стоимость</h2>
          <div className="main-pricing">
            <div className="main-price-col">
              <div className="main-price-value">20 000 ₽</div>
              <div className="main-price-label">настройка и запуск, единоразово</div>
              <div className="main-price-value">3 000 ₽/мес</div>
              <div className="main-price-label">поддержка: хостинг, домен, обновление цен, правки</div>
            </div>
            <div className="main-price-col">
              <div className="main-included-title">Что входит:</div>
              <ul className="main-included">
                <li>Оформление: логотип, название, контакты, соцсети</li>
                <li>Ваш прайс-лист и формулы расчёта</li>
                <li>Адрес yourcompany.costyflow.ru с SSL</li>
                <li>Заявки в Telegram и на почту</li>
                <li>Виджет-кнопка на сайт и QR-код</li>
              </ul>
            </div>
            <div className="main-price-foot">
              <p className="main-price-note">Программист не нужен: техническую часть берём на себя.</p>
              <p className="main-price-roi">Окупается с 3–4 заявок в месяц.</p>
              <a href="#contact" className="main-btn main-btn--solid main-price-cta">Обсудить запуск</a>
            </div>
          </div>
          <p className="main-launch-steps">
            1. Присылаете прайс и название → 2. За 1–3 дня показываем готовый калькулятор →
            3. Размещаете ссылку и принимаете заявки
          </p>
        </div>
      </section>

      {/* ===== КОНТАКТЫ ===== */}
      <section className="main-section" id="contact">
        <div className="main-container">
          <div className="main-contact">
            <h2 className="main-contact-title">Напишите нам — подготовим расчёт под ваш прайс</h2>
            <p className="main-contact-sub">Отвечаем в течение дня.</p>
            <div className="main-contact-links">
              <a className="main-contact-link" href={telegramHref}>
                Telegram · {BRAND_CONTACTS.telegram}
              </a>
              <a className="main-contact-link" href={maxHref}>
                MAX · {BRAND_CONTACTS.max}
              </a>
              <a className="main-contact-link" href={phoneHref}>
                Позвонить · {BRAND_CONTACTS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ФУТЕР ===== */}
      <footer className="main-footer">
        <div className="main-container main-footer-inner">
          <span>© 2026 Costyflow</span>
          <Link to="/privacy" className="main-footer-link">Политика конфиденциальности</Link>
        </div>
      </footer>

    </div>
  );
}
