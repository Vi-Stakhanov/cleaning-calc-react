import {
  TARIFFS,
  EXTRAS,
  EXTRA_BATHROOM_PRICE,
  FREE_BATHROOMS,
  PRICE_RANGE,
} from './config/pricing.js';

export function calcPrice({ type, vehicleType, area, bathrooms, extras, client }) {
  const isCarwash = client?.id === 'carwash';

  let base = 0;
  let bathroomsCost = 0;

  if (isCarwash) {
    // Автомойка: берём цену пакета из выбранного типа транспорта
    const vehicle = client?.vehicleTypes?.find((v) => v.id === vehicleType);
    base = vehicle?.prices?.[type] ?? 0;
  } else {
    // Клининг: площадь × тариф
    const tariffs = client
      ? Object.fromEntries(client.tariffs.map((t) => [t.id, { pricePerM2: t.price }]))
      : TARIFFS;
    const tariff = tariffs[type]?.pricePerM2 ?? 0;
    const safeArea = Math.max(0, Number(area) || 0);
    base = safeArea * tariff;

    // Санузлы (только клининг)
    const safeBathrooms = Math.max(0, Math.floor(Number(bathrooms) || 0));
    const paidBathrooms = Math.max(0, safeBathrooms - FREE_BATHROOMS);
    bathroomsCost = paidBathrooms * EXTRA_BATHROOM_PRICE;
  }

  // Допуслуги (общие для обоих)
  const extrasList = client?.extras ?? EXTRAS;
  let extrasCost = 0;
  for (const extra of extrasList) {
    const qty = Math.max(0, Number(extras?.[extra.id]) || 0);
    extrasCost += qty * extra.price;
  }

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

export function formatRub(value) {
  return `${Math.round(value).toLocaleString('ru-RU')} ₽`;
}