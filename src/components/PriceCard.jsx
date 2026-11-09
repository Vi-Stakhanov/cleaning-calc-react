/**
src/components/PriceCard.jsx
Карточка результата. Мульти-клиентность: cleaning и carwash.
Для автомойки: тип транспорта, пакет с ценой, доп. опции, химчистка.
Для клининга: база, санузлы, допуслуги.
*/
import { formatRub } from '../calc.js';

export default function PriceCard({ result, client, state }) {
  const isCarwash = client?.id === 'carwash';
  const { base, bathroomsCost, extrasCost, chemCost = 0, total } = result;

  const selectedVehicle = isCarwash
    ? client?.vehicleTypes?.find((v) => v.id === state?.vehicleType)
    : null;

  const selectedPackage = isCarwash
    ? client?.packages?.find((p) => p.id === state?.type)
    : null;

  // Цена пакета с учётом типа транспорта
  const packagePrice = selectedPackage && selectedVehicle
    ? (selectedVehicle.prices?.[selectedPackage.id] ?? 0)
    : 0;

  return (
    <aside className="price-block" aria-live="polite">
      <h2 className="card-title">Стоимость</h2>
      <p className="price-value">{formatRub(total)}</p>
      <ul className="price-details">
        {isCarwash ? (
          <>
            {/* Тип транспорта — название справа */}
            {selectedVehicle && (
              <li className="price-row">
                <span>Тип транспорта</span>
                <span>{selectedVehicle.name}</span>
              </li>
            )}
            {/* Пакет услуг — название + цена */}
            {selectedPackage && (
              <li className="price-row">
                <span>{selectedPackage.name}</span>
                <span>{formatRub(packagePrice)}</span>
              </li>
            )}
            {/* Доп. опции — без химчистки */}
            <li className="price-row">
              <span>Доп. опции</span>
              <span>{formatRub(extrasCost)}</span>
            </li>
            {/* Химчистка — всегда видна */}
            <li className="price-row">
              <span>Химчистка</span>
              <span>{formatRub(chemCost)}</span>
            </li>
          </>
        ) : (
          <>
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
          </>
        )}
      </ul>
    </aside>
  );
}