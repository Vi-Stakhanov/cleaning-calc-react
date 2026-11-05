import QtyCounter from './QtyCounter.jsx';
import { useNavigate, useLocation } from 'react-router-dom';

const cardCls = 'card';
const cardTitleCls = 'card-title';

export default function CalcForm({ state, onChange, client }) {
  const navigate = useNavigate();
  const location = useLocation();

  const setField = (field, value) => onChange({ ...state, [field]: value });

  const toggleExtra = (id, checked) =>
    setField('extras', {
      ...state.extras,
      [id]: checked ? Math.max(1, state.extras[id] || 1) : 0,
    });

  const setExtraQty = (id, qty) =>
    setField('extras', { ...state.extras, [id]: Math.max(0, Number(qty) || 0) });

  const isCarwash = client.id === 'carwash';

  return (
    <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
      {location.pathname === '/offer' && (
        <div className="back-link">
          <button type="button" className="link-button" onClick={() => navigate('/')}>
            ← Вернуться к калькулятору
          </button>
        </div>
      )}

      <div className={cardCls}>
        <div className={cardTitleCls}>{isCarwash ? 'Пакет услуг' : 'Тип уборки'}</div>
        <div className="radio-list">
          {(isCarwash ? client.packages : client.tariffs).map((t) => (
            <label key={t.id} className="radio-label">
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
                <span className="tariff-price">{t.price} {t.unit || '₽'}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {isCarwash ? (
        <div className={cardCls}>
          <div className={cardTitleCls}>Тип транспорта</div>
          <div className="radio-list">
            {client.vehicleTypes.map((v) => (
              <label key={v.id} className="radio-label">
                <input
                  type="radio"
                  name="vehicleType"
                  value={v.id}
                  checked={state.vehicleType === v.id}
                  onChange={() => setField('vehicleType', v.id)}
                  className="choice-input"
                />
                <span className="tariff-text">
                  <span className="tariff-name">{v.name}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      ) : (
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
      )}

      <div className={cardCls}>
        <div className={cardTitleCls}>{isCarwash ? 'Дополнительные опции' : 'Допуслуги'}</div>
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
                    <span className="extra-price">{extra.price} {extra.unit || '₽'}</span>
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