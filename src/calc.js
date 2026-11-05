/**
src/calc.js
Чистая (без React) логика расчёта стоимости.
Поддерживает мульти-клиентность:
- cleaning: площадь × тариф + санузлы + допы
- carwash: пакет × коэффициент типа транспорта + допы
*/
import {
  TARIFFS,
  EXTRAS,
  EXTRA_BATHROOM_PRICE,
  FREE_BATHROOMS,
  PRICE_RANGE,
} from './config/pricing.js';

/**
Рассчитывает стоимость по параметрам формы.
@param {Object} params
@param {string} params.type          — ключ тарифа или пакета
@param {string} [params.vehicleType] — ключ типа транспорта (carwash)
@param {number} params.area          — площадь, м² (cleaning)
@param {number} params.bathrooms     — количество санузлов (cleaning)
@param {Object<string, number>} params.extras — выбранные доп. услуги
@param {Object} [params.client]      — конфиг клиента
@returns {{ base:number, bathroomsCost:number, extrasCost:number, total:number, min:number, max:number }}
*/
export function calcPrice({ type, vehicleType, area, bathrooms, extras, client }) {
  const isCarwash = client?.id === 'carwash';

  // 1. База
  let base = 0;
  if (isCarwash) {
    // Автомойка: пакет × коэффициент типа транспорта
    const pkg = client.packages?.find((p) => p.id === type);
    const vehicle = client.vehicleTypes?.find((v) => v.id === vehicleType);
    const price = pkg?.price ?? 0;
    const coeff = vehicle?.coefficient ?? 1;
    base = Math.round(price * coeff);
  } else {
    // Клининг: площадь × тариф
    const tariffs = client
      ? Object.fromEntries(client.tariffs.map((t) => [t.id, { pricePerM2: t.price }]))
      : TARIFFS;
    const tariff = tariffs[type]?.pricePerM2 ?? 0;
    const safeArea = Math.max(0, Number(area) || 0);
    base = safeArea * tariff;
  }

  // 2. Санузлы (только клининг)
  const safeBathrooms = Math.max(0, Math.floor(Number(bathrooms) || 0));
  const paidBathrooms = Math.max(0, safeBathrooms - FREE_BATHROOMS);
  const bathroomsCost = isCarwash ? 0 : paidBathrooms * EXTRA_BATHROOM_PRICE;

  // 3. Допуслуги
  const extrasList = client?.extras ?? EXTRAS;
  let extrasCost = 0;
  for (const extra of extrasList) {
    const qty = Math.max(0, Number(extras?.[extra.id]) || 0);
    extrasCost += qty * extra.price;
  }

  // 4. Итог
  const total = base + bathroomsCost + extrasCost;
  return {
    base,
    bathroomsCost,
    extrasCost,
    total,
    min: total * (1 - PRICE_RANGE),
    max: total * (1 + PRICE_RANGE),
  };
}

/** Форматирует число как цену в рублях без копеек: 12 345 ₽ */
export function formatRub(value) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}