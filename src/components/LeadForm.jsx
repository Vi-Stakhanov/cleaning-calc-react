/**
 * src/components/LeadForm.jsx
 * Форма заявки на уборку (CTA-блок). Собирает контакты клиента и актуальные
 * данные расчёта (через props из App.jsx) и отправляет их на сервер
 * (api/lead.js → письмо владельцу). В режиме разработки сеть не трогаем:
 * имитируем успех с выводом объекта заявки в консоль.
 * UI: обычный CSS (src/App.css), акцентная карточка с синей обводкой.
 */
import { useState } from 'react';
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
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.784-7.499-2.132Z" />
  </svg>
);
const IconPhone = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.058-1.172.44l-.913 1.217c-.287.382-.796.523-1.234.338a12.035 12.035 0 0 1-7.143-7.143c-.185-.438-.044-.947.338-1.234l1.217-.913c.382-.27.55-.732.44-1.172L8.954 3.6c-.125-.5-.575-.852-1.091-.852H6.5a2.25 2.25 0 0 0-2.25 2.25V6.75Z" />
  </svg>
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

  // Валидация: без имени и полного телефона (11 цифр) кнопка неактивна
  const isValid = name.trim().length > 0 && phone.replace(/\D/g, '').length >= 11;

  // Отправка формы: собираем объект заявки и отправляем на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || sending) return;

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
      <p className="subtitle cta-subtitle-margin">Перезвоним за 5 минут</p>

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
      <fieldset className="form-group">
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
      </fieldset>

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

      {/* Кнопка неактивна без имени/телефона и на время отправки */}
      <button
        type="submit"
        disabled={!isValid || sending}
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
