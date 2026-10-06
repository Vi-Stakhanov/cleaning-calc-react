/**
 * src/components/PriceCard.jsx
 * Карточка результата: итоговая цена, диапазон ±10% и разбивка по статьям.
 * Компонент презентационный — только рисует данные, посчитанные в App.jsx.
 * UI: обычный CSS (src/App.css).
 */
import { formatRub } from '../calc.js';

export default function PriceCard({ result }) {
  const { base, bathroomsCost, extrasCost, total, min, max } = result;

  return (
    <aside className="price-block" aria-live="polite">
      <h2 className="label-uppercase">СТОИМОСТЬ</h2>

      {/* Итоговая цена */}
      <p className="price-value">{formatRub(total)}</p>

      {/* Ориентировочный диапазон: итог ±10% */}
      <p className="price-range">
        ≈ {formatRub(min)} – {formatRub(max)}
      </p>

      {/* Детализация: из чего сложилась цена */}
      <ul className="price-details">
        <li className="price-row">
          <span>База (площадь × тариф)</span>
          <span>{formatRub(base)}</span>
        </li>
        <li className="price-row">
          <span>Доплата за санузлы</span>
          <span>{formatRub(bathroomsCost)}</span>
        </li>
        <li className="price-row">
          <span>Допуслуги</span>
          <span>{formatRub(extrasCost)}</span>
        </li>
      </ul>
    </aside>
  );
}
