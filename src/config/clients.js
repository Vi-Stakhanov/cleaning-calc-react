/**
 * src/config/clients.js
 * Конфиг-система мульти-клиентности: в одном приложении несколько
 * бизнесов (клининг, автомойка). Клиент выбирается по сегменту URL:
 *   /            → cleaning (по умолчанию)
 *   /carwash     → carwash
 *   /carwash/offer → презентация для автомойки
 */

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
    tariffs: [
      { id: 'exterior', name: 'Кузов', price: 500, unit: '₽' },
      { id: 'complex', name: 'Комплекс', price: 900, unit: '₽' },
      { id: 'detailing', name: 'Детейлинг', price: 3000, unit: '₽' },
      { id: 'truck', name: 'Внедорожник', price: 1200, unit: '₽' }
    ],
    extras: [
      { id: 'wheels', name: 'Диски', price: 200, unit: '₽' },
      { id: 'engine', name: 'Мойка двигателя', price: 1500, unit: '₽' },
      { id: 'interior', name: 'Химчистка салона', price: 2500, unit: '₽' },
      { id: 'polish', name: 'Полировка', price: 4000, unit: '₽' },
      { id: 'ceramic', name: 'Керамика', price: 8000, unit: '₽' },
      { id: 'glass', name: 'Покрытие стёкол', price: 600, unit: '₽' }
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
