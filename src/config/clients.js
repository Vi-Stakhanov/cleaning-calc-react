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
      { id: 'office', name: 'Офис', price: 120, unit: '₽/м²' }
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
      { id: 'ironing', name: 'Глажка', price: 500, unit: '₽/час' }
    ],
    offer: {
      title: 'Калькулятор стоимости уборки для вашей компании',
      lead: 'Клиент считает цену сам за 30 секунд. Вы получаете готовую заявку с суммой.',
      pain: 'Клиент не хочет звонить и ждать расчёта. Он хочет узнать цену сразу. Вы не хотите ловить каждого клиента на звонке. Вы хотите готовые заявки.'
    }
  },
  carwash: {
    id: 'carwash',
    name: 'МойкаПро',
    subtitle: 'Профессиональная автомойка',
    phone: '+7 (999) 888-82-22',
    telegram: '@vitalya_stakhanov',
    packages: [
      { id: 'body', name: 'Кузов', price: 500 },
      { id: 'complex', name: 'Комплекс', price: 900 }
    ],
    vehicleTypes: [
      { id: 'sedan', name: 'Седан', coefficient: 1.0 },
      { id: 'crossover', name: 'Кроссовер', coefficient: 1.2 },
      { id: 'suv', name: 'Внедорожник', coefficient: 1.4 },
      { id: 'minibus', name: 'Микроавтобус', coefficient: 1.6 },
      { id: 'bus', name: 'Автобус', coefficient: 2.5 },
      { id: 'truck10', name: 'Грузовой 10т', coefficient: 3.0 },
      { id: 'truck', name: 'Фура', coefficient: 3.2 },
      { id: 'special', name: 'Спецтехника', coefficient: 3.5 }
    ],
    extras: [
      { id: 'rubber', name: 'Чернение резины', price: 400 },
      { id: 'bitumen', name: 'Удаление битумных пятен', price: 1500 },
      { id: 'wax', name: 'Воск кузова', price: 600 },
      { id: 'cleaning', name: 'Удаление и чистка (налет/реагенты)', price: 2000 },
      { id: 'sanitary', name: 'Санитарная обработка кузова/салона', price: 1200 },
      { id: 'bio', name: 'Сложные био-загрязнения (органика/волосы)', price: 5000 }
    ],
    offer: {
      title: 'Калькулятор стоимости мойки для вашей компании',
      lead: 'Клиент считает цену сам за 30 секунд. Вы получаете готовую заявку с суммой.',
      pain: 'Клиент не хочет звонить и ждать расчёта. Он хочет узнать цену сразу. Вы не хотите ловить каждого клиента на звонке. Вы хотите готовые заявки.'
    }
  }
};

export function getClient(clientId) {
  return clients[clientId] || clients.cleaning;
}