/**
 * src/calc.js
 * Чистая (без React) логика расчёта стоимости уборки.
 * Вынесена отдельно, чтобы её можно было тестировать независимо от UI.
 */
import {
  TARIFFS,
  EXTRAS,
  EXTRA_BATHROOM_PRICE,
  FREE_BATHROOMS,
  PRICE_RANGE,
} from './config/pricing.js';

/**
 * Рассчитывает стоимость уборки по параметрам формы.
 *
 * @param {Object} params
 * @param {string} params.type          — ключ типа уборки из TARIFFS
 * @param {number} params.area          — площадь, м²
 * @param {number} params.bathrooms     — количество санузлов
 * @param {Object<string, number>} params.extras — выбранные доп. услуги:
 *        { id_доп_услуги: количество } (например { windows: 3, ironing: 2 })
 * @returns {{ base:number, bathroomsCost:number, extrasCost:number,
 *             total:number, min:number, max:number }}
 */
export function calcPrice({ type, area, bathrooms, extras }) {
  // 1. База = площадь × тариф выбранного типа (если тип неизвестен — 0)
  const tariff = TARIFFS[type]?.pricePerM2 ?? 0;
  const safeArea = Math.max(0, Number(area) || 0);
  const base = safeArea * tariff;

  // 2. Санузлы: первый бесплатный, за каждый со второго +300 ₽
  const safeBathrooms = Math.max(0, Math.floor(Number(bathrooms) || 0));
  const paidBathrooms = Math.max(0, safeBathrooms - FREE_BATHROOMS);
  const bathroomsCost = paidBathrooms * EXTRA_BATHROOM_PRICE;

  // 3. Допуслуги: цена за единицу × количество
  let extrasCost = 0;
  for (const extra of EXTRAS) {
    const qty = Math.max(0, Number(extras?.[extra.id]) || 0);
    extrasCost += qty * extra.price;
  }

  // 4. Итог = база + санузлы + допы; диапазон = итог ±10%
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
