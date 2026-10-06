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
    <>
      {/* Хэдер — брендинг */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Логотип или название компании клиента */}
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">К</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">КлинингПро</h1>
              <p className="text-xs text-gray-500">Профессиональная уборка</p>
            </div>
          </div>
          <a href="tel:+79528888222" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            +7 (952) 888-82-22
          </a>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Калькулятор стоимости уборки
        </h2>
        <p className="text-gray-500 mb-8">Рассчитайте цену за 30 секунд</p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Левая колонка — форма параметров */}
          <CalcForm state={state} onChange={setState} />

          {/* Правая колонка — sticky: карточка результата + форма заявки */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <PriceCard result={result} />
            {/* Заявка получает актуальные параметры и результат расчёта */}
            <LeadForm state={state} result={result} />
          </div>
        </div>
      </main>

      {/* Футер — брендинг calc-lead */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-[1100px] mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Иконки соцсетей */}
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </a>
          </div>
          <div className="text-sm text-gray-500">
            Сделано в <span className="font-semibold text-blue-600">calc-lead</span>
          </div>
        </div>
      </footer>
    </>
  );
}
