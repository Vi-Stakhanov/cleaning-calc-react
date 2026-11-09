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

  // Для автомойки: получаем цены пакетов из выбранного типа транспорта
  const getPackagePrice = (packageId) => {
    if (!isCarwash) return 0;
    const vehicle = client.vehicleTypes?.find((v) => v.id === state.vehicleType);
    return vehicle?.prices?.[packageId] ?? 0;
  };

  // Цена допуслуги: для химчистки зависит от типа транспорта
  const getExtraPrice = (extra) => extra.prices?.[state.vehicleType] ?? extra.price ?? 0;

  // Группировка допуслуг по категориям (кроме химчистки)
  const groupedExtras = (client.extras ?? [])
    .filter((ex) => ex.category !== 'Химчистка')
    .reduce((acc, ex) => {
      const cat = ex.category || 'Другое';
      (acc[cat] = acc[cat] || []).push(ex);
      return acc;
    }, {});

  // Химчистка — отдельная карточка
  const chemExtras = (client.extras ?? []).filter((ex) => ex.category === 'Химчистка');

  // Одна строка допуслуги
  const renderExtraRow = (extra) => {
    const qty = state.extras[extra.id] || 0;
    return (
      <div key={extra.id} className={`extra-item ${isCarwash ? 'extra-item-compact' : ''}`}>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={qty > 0}
            onChange={(e) => toggleExtra(extra.id, e.target.checked)}
            className="choice-input"
          />
          <span className="extra-text">
            <span className="extra-name">{extra.name}</span>
            <span className="extra-price">{getExtraPrice(extra)} {extra.unit || '₽'}</span>
          </span>
        </label>
        {qty > 0 && !isCarwash && (
          <QtyCounter
            value={qty}
            onChange={(v) => setExtraQty(extra.id, v)}
            min={1}
            max={99}
          />
        )}
      </div>
    );
  };

  return (
    <form className="calc-form" onSubmit={(e) => e.preventDefault()}>
      {location.pathname === '/offer' && (
        <div className="back-link">
          <button type="button" className="link-button" onClick={() => navigate('/')}>
            ← Вернуться к калькулятору
          </button>
        </div>
      )}

      {/* Для автомойки — сначала тип транспорта, для клининга — тип уборки */}
      {isCarwash ? (
        <div className={cardCls}>
          <div className={cardTitleCls}>Тип транспорта</div>
          <div className="radio-list-horizontal">
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
          <div className={cardTitleCls}>Тип уборки</div>
          <div className="radio-list">
            {client.tariffs.map((t) => (
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
                  <span className="tariff-price">{t.price} {t.unit}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Для автомойки — пакет услуг с ценами из vehicleType, для клининга — параметры помещения */}
      {isCarwash ? (
        <div className={cardCls}>
          <div className={cardTitleCls}>Пакет услуг</div>
          <div className="radio-list-horizontal">
            {client.packages.map((p) => (
              <label key={p.id} className="radio-label">
                <input
                  type="radio"
                  name="type"
                  value={p.id}
                  checked={state.type === p.id}
                  onChange={() => setField('type', p.id)}
                  className="choice-input"
                />
                <span className="tariff-text">
                  <span className="tariff-name">{p.name}</span>
                  <span className="tariff-price">{getPackagePrice(p.id)} ₽</span>
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

      {/* Доп. услуги */}
      {isCarwash ? (
        <>
          <div className={cardCls}>
            <div className={cardTitleCls}>Дополнительные опции</div>
            {Object.entries(groupedExtras).map(([category, items]) => (
              <div key={category} className="extra-category">
                <div className="extra-category-title">{category}</div>
                <div className="checkbox-list">
                  {items.map((ex) => renderExtraRow(ex))}
                </div>
              </div>
            ))}
          </div>

          {/* Химчистка — отдельная карточка */}
          {chemExtras.length > 0 && (
            <div className={cardCls}>
              <div className={cardTitleCls}>Химчистка</div>
              <div className="checkbox-list">
                {chemExtras.map((ex) => renderExtraRow(ex))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={cardCls}>
          <div className={cardTitleCls}>Допуслуги</div>
          <div className="checkbox-list">
            {(client.extras ?? []).map((extra) => renderExtraRow(extra))}
          </div>
        </div>
      )}
    </form>
  );
}