/**
 * src/App.jsx
 * Корневой компонент калькулятора: хранит состояние формы,
 * мгновенно пересчитывает цену (через calcPrice) и передаёт
 * результат в карточку цены. Layout: Tailwind CSS.
 */
import { useMemo, useState } from 'react';
import CalcForm from './components/CalcForm.jsx';
import PriceCard from './components/PriceCard.jsx';
import LeadForm from './components/LeadForm.jsx';
import { calcPrice } from './calc.js';

// Начальное состояние формы: тип по умолчанию, пустые доп. услуги
const initialState = {
  type: 'regular', // ключ из TARIFFS
  area: 50,        // площадь, м²
  rooms: 2,        // комнаты (пока informational, на цену не влияет)
  bathrooms: 1,    // санузлы (со второго — платные)
  extras: {},      // { idДопУслуги: количество }
};

export default function App() {
  const [state, setState] = useState(initialState);

  // Расчёт выполняется при каждом рендере, то есть мгновенно
  // после любого изменения ввода; useMemo избегает лишних пересчётов.
  const result = useMemo(
    () =>
      calcPrice({
        type: state.type,
        area: Number(state.area),
        bathrooms: Number(state.bathrooms),
        extras: state.extras,
      }),
    [state],
  );

  return (
    <main className="max-w-[1100px] mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Калькулятор стоимости уборки
      </h1>
      <p className="text-gray-500 mb-8">Рассчитайте цену за 30 секунд</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Левая колонка — форма параметров */}
        <CalcForm state={state} onChange={setState} />

        {/* Правая колонка — sticky: карточка результата + форма заявки */}
        <div className="lg:sticky lg:top-8 space-y-6">
          <PriceCard result={result} />
          {/* Заявка получает актуальные параметры и результат расчёта */}
          <LeadForm state={state} result={result} />
        </div>
      </div>
    </main>
  );
}
