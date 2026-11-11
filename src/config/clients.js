export const clients = {
  cleaning: {
    id: 'cleaning',
    name: 'КлинингПро',
    subtitle: 'Профессиональная уборка',
    phone: '+7 (999) 888-82-22',
    telegram: '@vitalya_stakhanov',
    tariffs: [
      { id: 'regular', name: 'Поддерживающая', price: 90, unit: '₽/м²' },
      { id: 'general', name: 'Генеральная', price: 170, unit: '₽/м²' },
      { id: 'renovation', name: 'После ремонта', price: 250, unit: '₽/м²' },
      { id: 'office', name: 'Офис', price: 120, unit: '₽/м²' },
    ],
    extras: [
      { id: 'windows', name: 'Мытьё окон', price: 400, unit: '₽/окно' },
      { id: 'sofa', name: 'Химчистка дивана', price: 2000, unit: '₽/диван' },
      { id: 'chair', name: 'Химчистка кресла', price: 800, unit: '₽/кресло' },
      { id: 'carpet', name: 'Химчистка ковра', price: 300, unit: '₽/м²' },
      { id: 'fridge', name: 'Чистка холодильника', price: 500, unit: '₽/шт' },
      { id: 'oven', name: 'Чистка духовки', price: 600, unit: '₽/шт' },
      { id: 'microwave', name: 'Чистка микроволновки', price: 300, unit: '₽/шт' },
      { id: 'balcony', name: 'Уборка балкона', price: 900, unit: '₽/шт' },
      { id: 'ironing', name: 'Глажка', price: 500, unit: '₽/час' },
    ],
    offer: {
      title: 'Калькулятор стоимости уборки для вашей компании',
      lead: 'Клиент считает цену сам за 30 секунд. Вы получаете готовую заявку с суммой.',
      pain: 'Клиент не хочет звонить и ждать расчёта. Он хочет узнать цену сразу. Вы не хотите ловить каждого клиента на звонке. Вы хотите готовые заявки.',
    },
  },
  carwash: {
    id: 'carwash',
    name: 'МойкаПро',
    subtitle: 'Профессиональная автомойка',
    phone: '+7 (999) 888-82-22',
    telegram: '@vitalya_stakhanov',
    packages: [
      { id: 'rinse_chem', name: 'Опаласкивание с химией' },
      { id: 'body', name: 'Кузов + коврики' },
      { id: 'complex', name: 'Комплекс' },
    ],
    vehicleTypes: [
      { id: 'sedan', name: 'Седан', prices: { rinse_chem: 350, body: 500, complex: 900 } },
      { id: 'crossover', name: 'Кроссовер', prices: { rinse_chem: 420, body: 600, complex: 1100 } },
      { id: 'suv', name: 'Внедорожник', prices: { rinse_chem: 490, body: 700, complex: 1200 } },
      { id: 'minibus', name: 'Микроавтобус', prices: { rinse_chem: 560, body: 800, complex: 1400 } },
      { id: 'bus', name: 'Автобус', prices: { rinse_chem: 880, body: 1250, complex: 2250 } },
      { id: 'truck10', name: 'Грузовой 10т', prices: { rinse_chem: 1050, body: 1500, complex: 2700 } },
      { id: 'truck', name: 'Фура', prices: { rinse_chem: 1150, body: 1600, complex: 2900 } },
      { id: 'special', name: 'Спецтехника', prices: { rinse_chem: 1250, body: 1750, complex: 3150 } },
    ],
    extras: [
      // Кузов и защита
      { id: 'wax', name: 'Воск кузова (горячий воск)', price: 600, category: 'Кузов и защита' },
      { id: 'anti_rain', name: 'Антидождь (стёкла)', price: 1000, category: 'Кузов и защита' },
      { id: 'insects', name: 'Удаление насекомых', price: 450, category: 'Кузов и защита' },
      { id: 'bitumen', name: 'Удаление битума', price: 500, category: 'Кузов и защита' },
      { id: 'tire_black', name: 'Чернение шин', price: 500, category: 'Кузов и защита' },
      // Салон
      { id: 'plastic', name: 'Подровка салона (передняя панель)', price: 600, category: 'Салон' },
      { id: 'salon_wet', name: 'Влажная уборка салона', price: 550, category: 'Салон' },
      { id: 'dry_fog', name: 'Сухой туман (санитарная обработка)', price: 1200, category: 'Салон' },
      { id: 'aroma', name: 'Очистка арома', price: 200, category: 'Салон' },
      // Стёкла и оптика
      { id: 'windows', name: 'Мойка стекол', price: 500, category: 'Стёкла и оптика' },
      { id: 'headlights', name: 'Полировка фар', price: 800, category: 'Стёкла и оптика' },
      // Химчистка — цена зависит от типа транспорта
      { id: 'hc_seats', name: 'Химчистка сидения (1 шт.)', price: 1400, category: 'Химчистка', prices: { sedan: 1400, crossover: 1550, suv: 1700, minibus: 1850, bus: 2100, truck10: 2100, truck: 2100, special: 2100 } },
      { id: 'hc_roof', name: 'Химчистка потолка', price: 3500, category: 'Химчистка', prices: { sedan: 3500, crossover: 3850, suv: 4200, minibus: 4550, bus: 5250, truck10: 5250, truck: 5250, special: 5250 } },
      { id: 'hc_floor', name: 'Химчистка пола', price: 3500, category: 'Химчистка', prices: { sedan: 3500, crossover: 3850, suv: 4200, minibus: 4550, bus: 5250, truck10: 5250, truck: 5250, special: 5250 } },
      { id: 'hc_doors', name: 'Химчистка дверей (1 шт.)', price: 1100, category: 'Химчистка', prices: { sedan: 1100, crossover: 1200, suv: 1350, minibus: 1450, bus: 1650, truck10: 1650, truck: 1650, special: 1650 } },
      { id: 'hc_trunk', name: 'Химчистка багажника', price: 1800, category: 'Химчистка', prices: { sedan: 1800, crossover: 2000, suv: 2200, minibus: 2400, bus: 2700, truck10: 2700, truck: 2700, special: 2700 } },
      { id: 'hc_panel', name: 'Химчистка приборной панели', price: 1300, category: 'Химчистка', prices: { sedan: 1300, crossover: 1450, suv: 1600, minibus: 1750, bus: 2000, truck10: 2000, truck: 2000, special: 2000 } },
    ],
    offer: {
      title: 'Калькулятор стоимости мойки для вашей компании',
      lead: 'Клиент считает цену сам за 30 секунд. Вы получаете готовую заявку с суммой.',
      pain: 'Клиент не хочет звонить и ждать расчёта. Он хочет узнать цену сразу. Вы не хотите ловить каждого клиента на звонке. Вы хотите готовые заявки.',
    },
  },
};

export function getClient(clientId) {
  return clients[clientId] || clients.cleaning;
}