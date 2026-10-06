/**
 * src/components/PriceCard.jsx
 * Карточка результата: итоговая цена, диапазон ±10% и разбивка по статьям.
 * Компонент презентационный — только рисует данные, посчитанные в App.jsx.
 * UI: Tailwind CSS.
 */
import { formatRub } from '../calc.js';

export default function PriceCard({ result }) {
  const { base, bathroomsCost, extrasCost, total, min, max } = result;

  return (
    <aside
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      aria-live="polite"
    >
      <h2 className="text-sm text-gray-500 uppercase tracking-wide">Стоимость</h2>

      {/* Итоговая цена */}
      <p className="text-4xl font-bold text-gray-900 mt-2">{formatRub(total)}</p>

      {/* Ориентировочный диапазон: итог ±10% */}
      <p className="text-sm text-gray-400 mt-1">
        ≈ {formatRub(min)} – {formatRub(max)}
      </p>

      <div className="border-t border-gray-100 my-4" />

      {/* Детализация: из чего сложилась цена */}
      <ul className="text-sm text-gray-600 space-y-2">
        <li className="flex justify-between">
          <span>База (площадь × тариф)</span>
          <span>{formatRub(base)}</span>
        </li>
        <li className="flex justify-between">
          <span>Доплата за санузлы</span>
          <span>{formatRub(bathroomsCost)}</span>
        </li>
        <li className="flex justify-between">
          <span>Допуслуги</span>
          <span>{formatRub(extrasCost)}</span>
        </li>
      </ul>
    </aside>
  );
}
