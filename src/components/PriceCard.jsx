/**
 * src/components/PriceCard.jsx
 * Карточка результата: итоговая цена, диапазон ±10% и разбивка по статьям.
 * Компонент презентационный — только рисует данные, посчитанные в App.jsx.
 */
import { formatRub } from '../calc.js';

export default function PriceCard({ result }) {
  const { base, bathroomsCost, extrasCost, total, min, max } = result;

  return (
    <aside className="price-card" aria-live="polite">
      <h2 className="price-card__title">Стоимость</h2>

      {/* Итоговая цена */}
      <p className="price-card__total">{formatRub(total)}</p>

      {/* Ориентировочный диапазон: итог ±10% */}
      <p className="price-card__range">
        Примерно {formatRub(min)} – {formatRub(max)}
      </p>

      {/* Детализация: из чего сложилась цена */}
      <ul className="price-card__breakdown">
        <li>
          База (площадь × тариф): <span>{formatRub(base)}</span>
        </li>
        <li>
          Доплата за санузлы: <span>{formatRub(bathroomsCost)}</span>
        </li>
        <li>
          Допуслуги: <span>{formatRub(extrasCost)}</span>
        </li>
      </ul>
    </aside>
  );
}
