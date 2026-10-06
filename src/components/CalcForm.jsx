/**
 * src/components/CalcForm.jsx
 * Форма параметров уборки: тип (radio), площадь/комнаты/санузлы (number),
 * доп. услуги (checkbox + количество). Никакого расчёта здесь нет —
 * компонент только собирает значения и отдаёт их наверх через onChange.
 * UI: обычный CSS (src/App.css), три карточки.
 */
import { TARIFFS, EXTRAS } from '../config/pricing.js';
import QtyCounter from './QtyCounter.jsx';

const cardCls = 'card';
const cardTitleCls = 'card-title';

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
        <div className={cardTitleCls}>Тип уборки</div>
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
        <div className={cardTitleCls}>Параметры помещения</div>
        <div>
          <label className="param-field">
            <span className="label">Площадь, м²</span>
            <QtyCounter
              value={Number(state.area) || 1}
              onChange={(v) => setField('area', String(v))}
              min={1}
              max={1000}
              fullWidth
            />
          </label>

          <label className="param-field">
            <span className="label">Комнаты</span>
            <QtyCounter
              value={Number(state.rooms) || 1}
              onChange={(v) => setField('rooms', String(v))}
              min={1}
              max={20}
              fullWidth
            />
          </label>

          <label className="param-field">
            <span className="label">Санузлы</span>
            <QtyCounter
              value={Number(state.bathrooms) || 1}
              onChange={(v) => setField('bathrooms', String(v))}
              min={1}
              max={10}
              fullWidth
            />
          </label>
        </div>
      </fieldset>

      {/* Доп. услуги — checkbox + количество (участвует в расчёте) */}
      <fieldset className={cardCls}>
        <div className={cardTitleCls}>Допуслуги</div>
        <div className="checkbox-list">
          {EXTRAS.map((extra) => {
            const qty = state.extras[extra.id] || 0;
            return (
              <div key={extra.id} className="extra-item">
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
                  <QtyCounter
                    value={qty}
                    onChange={(v) => setExtraQty(extra.id, v)}
                    min={1}
                    max={99}
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
