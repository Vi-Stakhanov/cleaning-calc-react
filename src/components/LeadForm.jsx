/**
 * src/components/LeadForm.jsx
 * Форма заявки на уборку. Собирает контакты клиента и актуальные данные
 * расчёта (передаются через props из App.jsx) и отправляет их на сервер
 * (api/lead.js → письмо владельцу). В режиме разработки сеть не трогаем:
 * имитируем успех с выводом объекта заявки в консоль.
 */
import { useState } from 'react';
import InputMask from 'react-input-mask'; // маска ввода телефона

// Способы связи с клиентом (по умолчанию — MAX)
const CHANNELS = ['MAX', 'Telegram', 'Позвонить'];

// Удобное время для звонка (select)
const CALL_TIMES = [
  'Как можно скорее',
  'До 12:00',
  '12:00–18:00',
  '18:00–21:00',
  'Любое',
];

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

  // Валидация: без имени и телефона кнопка неактивна
  const isValid = name.trim().length > 0 && phone.trim().length > 0;

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
      phone: phone.trim(),
      channel,                                   // MAX / Telegram / Позвонить
      time,                                      // удобное время для звонка
      totalPrice: result.total,                  // итоговая цена, ₽
      priceRange: [result.min, result.max],      // диапазон цены ±10%
      cleaningType: cleaningTypeLabel,           // тип уборки
      area: Number(state.area),                  // площадь, м²
      rooms: Number(state.rooms),                // комнаты
      bathrooms: Number(state.bathrooms),        // санузлы
      extras: state.extras,                      // { id доп. услуги: количество }
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
      <section className="lead-form">
        <p className="lead-form__success" role="status">
          Спасибо! Заявка принята, мы свяжемся с вами в выбранное время.
        </p>
      </section>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <h2 className="lead-form__title">Оставить заявку</h2>

      {/* Имя — обязательное поле */}
      <label className="lead-form__field">
        Имя
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          required
        />
      </label>

      {/* Телефон — обязательный, с маской +7 (999) 999-99-99 */}
      <label className="lead-form__field">
        Телефон
        <InputMask
          mask="+7 (999) 999-99-99"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 (___) ___-__-__"
          required
        />
      </label>

      {/* Способ связи — radio, по умолчанию MAX */}
      <fieldset className="lead-form__group">
        <legend>Способ связи</legend>
        {CHANNELS.map((ch) => (
          <label key={ch} className="lead-form__radio">
            <input
              type="radio"
              name="channel"
              value={ch}
              checked={channel === ch}
              onChange={() => setChannel(ch)}
            />
            {ch}
          </label>
        ))}
      </fieldset>

      {/* Удобное время для звонка — select */}
      <label className="lead-form__field">
        Удобное время для звонка
        <select value={time} onChange={(e) => setTime(e.target.value)}>
          {CALL_TIMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      {/* Кнопка неактивна без имени/телефона и на время отправки */}
      <button
        className="lead-form__submit"
        type="submit"
        disabled={!isValid || sending}
      >
        {sending ? 'Отправляем...' : 'Оставить заявку'}
      </button>

      {/* Сообщение об ошибке отправки (в проде) */}
      {error && (
        <p className="lead-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
