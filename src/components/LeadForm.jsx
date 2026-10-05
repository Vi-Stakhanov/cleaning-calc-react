/**
 * src/components/LeadForm.jsx
 * Форма заявки на уборку. Собирает контакты клиента и актуальные данные
 * расчёта (передаются через props из App.jsx), при отправке выводит объект
 * заявки в консоль и показывает сообщение о принятии.
 * Бэкенд отправки (почта/messenger) — следующая задача (ТЗ №3).
 */
import { useState } from 'react';

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

  // Валидация: без имени и телефона кнопка неактивна
  const isValid = name.trim().length > 0 && phone.trim().length > 0;

  // Отправка формы: собираем объект заявки, логируем и показываем «Спасибо»
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    // Наименование выбранного типа уборки для читаемого лога
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

    console.log('Заявка:', lead);
    setSubmitted(true);
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

      {/* Телефон — обязательный, placeholder с кодом +7 */}
      <label className="lead-form__field">
        Телефон
        <input
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

      {/* Кнопка неактивна, пока имя и телефон не заполнены */}
      <button className="lead-form__submit" type="submit" disabled={!isValid}>
        Оставить заявку
      </button>
    </form>
  );
}
