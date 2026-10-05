/**
 * src/App.jsx
 * Корневой компонент калькулятора: хранит состояние формы,
 * мгновенно пересчитывает цену (через calcPrice) и передаёт
 * результат в карточку цены.
 */
import { useMemo, useState } from 'react';
import CalcForm from './components/CalcForm.jsx';
import PriceCard from './components/PriceCard.jsx';
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
    <main className="app">
      <h1 className="app__title">Калькулятор стоимости уборки</h1>

      <div className="app__layout">
        {/* Левая колонка — форма параметров */}
        <CalcForm state={state} onChange={setState} />
        {/* Правая колонка — карточка результата */}
        <PriceCard result={result} />
      </div>
    </main>
  );
}
