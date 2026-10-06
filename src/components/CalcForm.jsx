/**
 * src/components/CalcForm.jsx
 * Форма параметров уборки: тип (radio), площадь/комнаты/санузлы (number),
 * доп. услуги (checkbox + количество). Никакого расчёта здесь нет —
 * компонент только собирает значения и отдаёт их наверх через onChange.
 * UI: обычный CSS (src/App.css), три карточки.
 */
import { TARIFFS, EXTRAS } from '../config/pricing.js';

const cardCls = 'card';
const cardTitleCls = 'card-title';
const inputCls = 'input input-plain';

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
      <fieldset className={cardCls}>
        <legend className={cardTitleCls}>Тип уборки</legend>
        <div className="radio-list">
          {Object.values(TARIFFS).map((t) => (
            <label
              key={t.id}
              className="radio-label"
            >
              <input
                type="radio"
                name="type"
                value={t.id}
                checked={state.type === t.id}
                onChange={() => setField('type', t.id)}
                className="choice-input"
              />
              {t.label} ({t.pricePerM2} ₽/м²)
            </label>
          ))}
        </div>
      </fieldset>

      {/* Числовые параметры: площадь, комнаты, санузлы */}
      <fieldset className={cardCls}>
        <legend className={cardTitleCls}>Параметры помещения</legend>
        <div>
          <label className="param-field">
            <span className="param-label">Площадь, м²</span>
            <input
              type="number"
              min="1"
              value={state.area}
              onChange={(e) => setField('area', e.target.value)}
              className={inputCls}
            />
          </label>

          <label className="param-field">
            <span className="param-label">Комнаты</span>
            <input
              type="number"
              min="0"
              value={state.rooms}
              onChange={(e) => setField('rooms', e.target.value)}
              className={inputCls}
            />
          </label>

          <label className="param-field">
            <span className="param-label">Санузлы</span>
            <input
              type="number"
              min="0"
              value={state.bathrooms}
              onChange={(e) => setField('bathrooms', e.target.value)}
              className={inputCls}
            />
          </label>
        </div>
      </fieldset>

      {/* Доп. услуги — checkbox + количество (участвует в расчёте) */}
      <fieldset className={cardCls}>
        <legend className={cardTitleCls}>Допуслуги</legend>
        <div className="checkbox-list">
          {EXTRAS.map((extra) => {
            const qty = state.extras[extra.id] || 0;
            return (
              <div key={extra.id} className="extra-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={qty > 0}
                    onChange={(e) => toggleExtra(extra.id, e.target.checked)}
                    className="choice-input"
                  />
                  {extra.label} — {extra.price} ₽/{extra.unit}
                </label>
                {qty > 0 && (
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setExtraQty(extra.id, e.target.value)}
                    aria-label={`Количество: ${extra.label}`}
                    className="qty-input"
                  />
                )}
              </div>
            );
          })}
        </div>
      </fieldset>
    </form>
  );
}
