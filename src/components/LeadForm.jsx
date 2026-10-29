/**
 * src/components/LeadForm.jsx
 * Форма заявки на уборку (CTA-блок). Собирает контакты клиента и актуальные
 * данные расчёта (через props из App.jsx) и отправляет их на сервер
 * (api/lead.js → письмо владельцу). В режиме разработки сеть не трогаем:
 * имитируем успех с выводом объекта заявки в консоль.
 * UI: обычный CSS (src/App.css), акцентная карточка с синей обводкой.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EXTRAS } from '../config/pricing.js';

// Способы связи с клиентом (по умолчанию — MAX)
const CHANNELS = ['MAX', 'Telegram', 'Позвонить'];

// Форматирование телефона в маску +7 (___) ___-__-__ без сторонних библиотек
function formatPhone(value) {
  // Убираем всё кроме цифр
  let digits = value.replace(/\D/g, '');

  // Если начинается с 8, меняем на 7
  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  }

  // Если не начинается с 7, добавляем 7
  if (digits.length > 0 && !digits.startsWith('7')) {
    digits = '7' + digits;
  }

  // Ограничиваем 11 цифрами
  digits = digits.slice(0, 11);

  // Форматируем
  if (digits.length === 0) return '';
  if (digits.length === 1) return '+7';
  if (digits.length <= 4) return '+7 (' + digits.slice(1);
  if (digits.length <= 7) return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4);
  if (digits.length <= 9) return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7);
  return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9) + '-' + digits.slice(9, 11);
}

// Удобное время для звонка (select)
const CALL_TIMES = [
  'Как можно скорее',
  'До 12:00',
  '12:00–18:00',
  '18:00–21:00',
  'Любое',
];

const inputCls = 'input';

// Select: pl-4 — нормальный отступ слева, pr-10 — место для стрелки справа
const selectCls = 'select';

// Минималистичные SVG-иконки для полей формы (stroke, 20px, серые)
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"/></svg>
);
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64c0 247.4 200.6 448 448 448c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368c-70.4-33.3-127.4-90.3-160.7-160.7l49.3-40.3c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
);

/**
 * @param {Object} props
 * @param {Object} props.state  — текущие параметры формы калькулятора
 *        (type, area, rooms, bathrooms, extras)
 * @param {Object} props.result — актуальный результат calcPrice()
 *        (total, min, max и т.д.)
 */
export default function LeadForm({ state, result }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState('MAX'); // способ связи по умолчанию
  const [time, setTime] = useState(CALL_TIMES[0]); // время звонка по умолчанию
  const [submitted, setSubmitted] = useState(false); // флаг успешной отправки
  const [sending, setSending] = useState(false);     // идёт ли отправка сейчас
  const [error, setError] = useState('');            // текст ошибки отправки
  const [privacyAgreed, setPrivacyAgreed] = useState(false); // согласие на обработку ПД (152-ФЗ)

  // Валидация: без имени и полного телефона (11 цифр) кнопка неактивна
  const isValid = name.trim().length > 0 && phone.replace(/\D/g, '').length >= 11;

  // Отправка формы: собираем объект заявки и отправляем на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || sending) return;

    // Проверка согласия на обработку персональных данных
    if (!privacyAgreed) {
      alert('Необходимо дать согласие на обработку персональных данных');
      return;
    }

    // Человекочитаемое название выбранного типа уборки
    const cleaningTypeLabel =
      { regular: 'Поддерживающая', general: 'Генеральная',
        postRenovation: 'После ремонта', office: 'Офис' }[state.type] ?? state.type;

    const lead = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ''), // на сервер — чистые цифры: 79161234567
      channel,                                   // MAX / Telegram / Позвонить
      time,                                      // удобное время для звонка
      totalPrice: result.total,                  // итоговая цена, ₽
      priceRange: [result.min, result.max],      // диапазон цены ±10%
      cleaningType: cleaningTypeLabel,           // тип уборки
      area: Number(state.area),                  // площадь, м²
      rooms: Number(state.rooms),                // комнаты
      bathrooms: Number(state.bathrooms),        // санузлы
      // Массив выбранных доп. услуг в читаемом виде для бэкенда (Telegram/почта):
      // [{ id, label, qty, price }] — раньше передавался объект { id: qty },
      // из-за чего в заявке всегда было «Допуслуги: нет».
      extras: EXTRAS
        .filter((ex) => Math.max(0, Number(state.extras?.[ex.id]) || 0) > 0)
        .map((ex) => ({
          id: ex.id,
          label: ex.label,
          qty: Math.max(0, Number(state.extras[ex.id]) || 0),
          price: ex.price,
        })),
    };

    // Режим разработки: сеть не дёргаем — имитируем успешную отправку
    if (import.meta.env.DEV) {
      console.log('Заявка (dev-заглушка):', lead);
      setSubmitted(true);
      return;
    }

    // Продакшен: POST на серверную функцию Vercel
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setSubmitted(true); // ok → показываем «Спасибо»
      } else {
        setError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
      }
    } catch {
      // Сеть недоступен / сервер упал — то же сообщение
      setError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
    } finally {
      setSending(false);
    }
  };

  // После успешной отправки показываем подтверждение вместо формы
  if (submitted) {
    return (
      <section className="cta-block">
        <p className="thanks-text" role="status">
          Спасибо! Заявка принята, мы свяжемся с вами в выбранное время.
        </p>
      </section>
    );
  }

  return (
    <form className="cta-block" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">Оставить заявку</h2>
      <p className="subtitle cta-subtitle-margin">Свяжемся в выбранное время</p>

      {/* Имя — обязательное поле, с иконкой человека */}
      <label className="form-group">
        <span className="label">Имя</span>
        <span className="input-wrapper">
          <span className="input-icon">
            <IconUser />
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            required
            className={inputCls}
          />
        </span>
      </label>

      {/* Телефон — обязательный, маска через formatPhone (без сторонних библиотек), с иконкой телефона */}
      <label className="form-group">
        <span className="label">Телефон</span>
        <span className="input-wrapper">
          <span className="input-icon">
            <IconPhone />
          </span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="+7 (___) ___-__-__"
            required
            className={inputCls}
          />
        </span>
      </label>

      {/* Способ связи — radio, по умолчанию MAX */}
      <div className="form-group">
        <div className="label">Способ связи</div>
        <div className="radio-group">
          {CHANNELS.map((ch) => (
            <label key={ch} className="radio-label">
              <input
                type="radio"
                name="channel"
                value={ch}
                checked={channel === ch}
                onChange={() => setChannel(ch)}
                className="choice-input"
              />
              {ch}
            </label>
          ))}
        </div>
      </div>

      {/* Удобное время для звонка — select */}
      <label className="form-group form-group-last">
        <span className="label">Удобное время для звонка</span>
        <select
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className={selectCls}
        >
          {CALL_TIMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      {/* Согласие на обработку персональных данных (152-ФЗ) */}
      <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <input
          type="checkbox"
          id="privacy"
          checked={privacyAgreed}
          onChange={(e) => setPrivacyAgreed(e.target.checked)}
          style={{ marginTop: '3px', accentColor: 'var(--color-primary)', width: '18px', height: '18px' }}
          required
        />
        <label htmlFor="privacy" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
          Я даю согласие на обработку персональных данных в соответствии с{' '}
          <Link to="/privacy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Политикой конфиденциальности</Link>
        </label>
      </div>

      {/* Кнопка неактивна без имени/телефона, без согласия и на время отправки */}
      <button
        type="submit"
        disabled={!isValid || sending || !privacyAgreed}
        className="button"
      >
        {sending ? 'Отправляем...' : 'Оставить заявку'}
      </button>

      {/* Сообщение об ошибке отправки (в проде) */}
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
