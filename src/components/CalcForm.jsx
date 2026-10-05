/**
 * src/components/CalcForm.jsx
 * Форма параметров уборки: тип (radio), площадь/комнаты/санузлы (number),
 * доп. услуги (checkbox + количество). Никакого расчёта здесь нет —
 * компонент только собирает значения и отдаёт их наверх через onChange.
 */
import { TARIFFS, EXTRAS } from '../config/pricing.js';

export default function CalcForm({ state, onChange }) {
  // Универсальный обработчик: меняет одно поле состояния и зовёт onChange
  const setField = (field, value) => onChange({ ...state, [field]: value });

  // Переключение checkbox доп. услуги: 0 — выключена, 1 — включена
  const toggleExtra = (id, checked) =>
    setField('extras', {
      ...state.extras,
      [id]: checked ? Math.max(1, state.extras[id] || 1) : 0,
    });

  // Изменение количества выбранной доп. услуги
  const setExtraQty = (id, qty) =>
    setField('extras', { ...state.extras, [id]: Math.max(0, Number(qty) || 0) });

  return (
    <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
      {/* Тип уборки — radio-группа */}
      <fieldset className="calc-form__group">
        <legend>Тип уборки</legend>
        {Object.values(TARIFFS).map((t) => (
          <label key={t.id} className="calc-form__radio">
            <input
              type="radio"
              name="type"
              value={t.id}
              checked={state.type === t.id}
              onChange={() => setField('type', t.id)}
            />
            {t.label} ({t.pricePerM2} ₽/м²)
          </label>
        ))}
      </fieldset>

      {/* Числовые параметры: площадь, комнаты, санузлы */}
      <fieldset className="calc-form__group">
        <legend>Параметры помещения</legend>

        <label className="calc-form__field">
          Площадь, м²
          <input
            type="number"
            min="1"
            value={state.area}
            onChange={(e) => setField('area', e.target.value)}
          />
        </label>

        <label className="calc-form__field">
          Комнаты
          <input
            type="number"
            min="0"
            value={state.rooms}
            onChange={(e) => setField('rooms', e.target.value)}
          />
        </label>

        <label className="calc-form__field">
          Санузлы
          <input
            type="number"
            min="0"
            value={state.bathrooms}
            onChange={(e) => setField('bathrooms', e.target.value)}
          />
        </label>
      </fieldset>

      {/* Доп. услуги — checkbox + количество (участвует в расчёте) */}
      <fieldset className="calc-form__group">
        <legend>Допуслуги</legend>
        {EXTRAS.map((extra) => {
          const qty = state.extras[extra.id] || 0;
          return (
            <div key={extra.id} className="calc-form__extra">
              <label className="calc-form__checkbox">
                <input
                  type="checkbox"
                  checked={qty > 0}
                  onChange={(e) => toggleExtra(extra.id, e.target.checked)}
                />
                {extra.label} — {extra.price} ₽/{extra.unit}
              </label>
              {qty > 0 && (
                <input
                  className="calc-form__qty"
                  type="number"
                  min="1"
                  value={qty}
                  onChange={(e) => setExtraQty(extra.id, e.target.value)}
                  aria-label={`Количество: ${extra.label}`}
                />
              )}
            </div>
          );
        })}
      </fieldset>
    </form>
  );
}
