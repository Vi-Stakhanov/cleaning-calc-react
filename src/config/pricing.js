/**
 * src/config/pricing.js
 * Единый источник данных о ценах для калькулятора уборки.
 * Все тарифы и стоимости допущений услуг хранятся здесь,
 * чтобы UI и логика расчёта не содержали «магических чисел».
 */

// Типы уборки: стоимость за 1 м² (₽/м²)
export const TARIFFS = {
  regular: { id: 'regular', label: 'Поддерживающая', pricePerM2: 90 },
  general: { id: 'general', label: 'Генеральная', pricePerM2: 170 },
  postRenovation: { id: 'postRenovation', label: 'После ремонта', pricePerM2: 250 },
  office: { id: 'office', label: 'Офис', pricePerM2: 120 },
};

// Допуслуги: фиксированная цена за единицу (окно, диван, час глажки и т.д.)
// Для ковра цена указана за 1 м² — площадь ковра задаётся отдельно (см. calcPrice).
export const EXTRAS = [
  { id: 'windows', label: 'Мытьё окон', unit: 'окно', price: 400 },
  { id: 'sofaDryClean', label: 'Химчистка дивана', unit: 'диван', price: 2000 },
  { id: 'chairDryClean', label: 'Химчистка кресла', unit: 'кресло', price: 800 },
  { id: 'carpetDryClean', label: 'Химчистка ковра', unit: 'м²', price: 300 },
  { id: 'fridge', label: 'Чистка холодильника', unit: 'шт', price: 500 },
  { id: 'oven', label: 'Чистка духовки', unit: 'шт', price: 600 },
  { id: 'microwave', label: 'Чистка микроволновки', unit: 'шт', price: 300 },
  { id: 'balcony', label: 'Уборка балкона', unit: 'шт', price: 900 },
  { id: 'ironing', label: 'Глажка', unit: 'час', price: 500 },
];

// Санузлы: +300 ₽ за каждый начиная со второго (первый входит в базу)
export const EXTRA_BATHROOM_PRICE = 300;
export const FREE_BATHROOMS = 1;

// Ширина диапазона итоговой цены: ±10%
export const PRICE_RANGE = 0.1;
