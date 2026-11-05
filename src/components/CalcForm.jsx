/**
 * src/components/CalcForm.jsx
 * Форма параметров: тип (radio), площадь/комнаты/санузлы (number),
 * доп. услуги (checkbox + количество). Тарифы и доп. услуги берутся из
 * конфига клиента (проп client) — мульти-клиентность (клининг, автомойка).
 * Никакого расчёта здесь нет — компонент только собирает значения и отдаёт
 * их наверх через onChange. UI: обычный CSS (src/App.css), три карточки.
 */
import QtyCounter from './QtyCounter.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const cardCls = 'card';
const cardTitleCls = 'card-title';

export default function CalcForm({ state, onChange, client }) {
  const navigate = useNavigate();
  const location = useLocation();
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
      {/* Кнопка возврата к калькулятору — только на странице презентации
          (/offer); на главной (/) она не показывается */}
      {location.pathname === '/offer' && (
        <div className="back-link">
          <button type="button" className="link-button" onClick={() => navigate('/')}>
            ← Вернуться к калькулятору
          </button>
        </div>
      )}
      {/* Тип услуги — radio-группа (тарифы из конфига клиента) */}
      <div className={cardCls}>
        <div className={cardTitleCls}>Тип уборки</div>
        <div className="radio-list">
          {client.tariffs.map((t) => (
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
              <span className="tariff-text">
                <span className="tariff-name">{t.name}</span>
                <span className="tariff-price">{t.price} {t.unit}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Числовые параметры: площадь, комнаты, санузлы */}
      <div className={cardCls}>
        <div className={cardTitleCls}>Параметры помещения</div>
        <div className="params-grid">
          <div className="param-field">
            <label className="label" htmlFor="param-area">Площадь, м²</label>
            <QtyCounter
              id="param-area"
              value={Number(state.area) || 1}
              onChange={(v) => setField('area', String(v))}
              min={1}
              max={1000}
              fullWidth
            />
          </div>

          <div className="param-field">
            <label className="label" htmlFor="param-rooms">Комнаты</label>
            <QtyCounter
              id="param-rooms"
              value={Number(state.rooms) || 1}
              onChange={(v) => setField('rooms', String(v))}
              min={1}
              max={20}
              fullWidth
            />
          </div>

          <div className="param-field">
            <label className="label" htmlFor="param-bathrooms">Санузлы</label>
            <QtyCounter
              id="param-bathrooms"
              value={Number(state.bathrooms) || 1}
              onChange={(v) => setField('bathrooms', String(v))}
              min={1}
              max={10}
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Доп. услуги — checkbox + количество (из конфига клиента) */}
      <div className={cardCls}>
        <div className={cardTitleCls}>Допуслуги</div>
        <div className="checkbox-list">
          {client.extras.map((extra) => {
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
                  <span className="extra-text">
                    <span className="extra-name">{extra.name}</span>
                    <span className="extra-price">{extra.price} {extra.unit}</span>
                  </span>
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
      </div>
    </form>
  );
}
