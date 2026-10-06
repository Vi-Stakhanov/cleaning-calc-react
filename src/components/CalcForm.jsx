/**
 * src/components/CalcForm.jsx
 * Форма параметров уборки: тип (radio), площадь/комнаты/санузлы (number),
 * доп. услуги (checkbox + количество). Никакого расчёта здесь нет —
 * компонент только собирает значения и отдаёт их наверх через onChange.
 * UI: Tailwind CSS, три карточки.
 */
import { TARIFFS, EXTRAS } from '../config/pricing.js';

const cardCls = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100';
const cardTitleCls = 'text-lg font-semibold text-gray-900 mb-4';
const inputCls =
  'w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none';

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
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {/* Тип уборки — radio-группа */}
      <fieldset className={cardCls}>
        <legend className={cardTitleCls}>Тип уборки</legend>
        <div className="space-y-2">
          {Object.values(TARIFFS).map((t) => (
            <label
              key={t.id}
              className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
            >
              <input
                type="radio"
                name="type"
                value={t.id}
                checked={state.type === t.id}
                onChange={() => setField('type', t.id)}
                className="w-5 h-5 accent-blue-600"
              />
              {t.label} ({t.pricePerM2} ₽/м²)
            </label>
          ))}
        </div>
      </fieldset>

      {/* Числовые параметры: площадь, комнаты, санузлы */}
      <fieldset className={cardCls}>
        <legend className={cardTitleCls}>Параметры помещения</legend>
        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm text-gray-500 mb-1">Площадь, м²</span>
            <input
              type="number"
              min="1"
              value={state.area}
              onChange={(e) => setField('area', e.target.value)}
              className={inputCls}
            />
          </label>

          <label className="block">
            <span className="block text-sm text-gray-500 mb-1">Комнаты</span>
            <input
              type="number"
              min="0"
              value={state.rooms}
              onChange={(e) => setField('rooms', e.target.value)}
              className={inputCls}
            />
          </label>

          <label className="block">
            <span className="block text-sm text-gray-500 mb-1">Санузлы</span>
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
        <div className="space-y-3">
          {EXTRAS.map((extra) => {
            const qty = state.extras[extra.id] || 0;
            return (
              <div key={extra.id} className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-3 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
                  <input
                    type="checkbox"
                    checked={qty > 0}
                    onChange={(e) => toggleExtra(extra.id, e.target.checked)}
                    className="w-5 h-5 accent-blue-600"
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
                    className="w-20 h-10 px-3 rounded-xl border border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
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
