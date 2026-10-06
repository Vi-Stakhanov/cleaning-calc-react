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
            {/* Иконки соцсетей: Telegram и MAX (VK) — одинаковые круглые бейджи */}
            <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all" aria-label="Telegram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all" aria-label="MAX">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.587-1.496c.598-.189 1.366 1.26 2.18 1.818.616.422 1.084.33 1.084.33l2.177-.03s1.14-.071.599-.97c-.044-.073-.314-.661-1.617-1.869-1.364-1.263-1.182-1.059.462-3.246.999-1.332 1.398-2.146 1.273-2.494-.12-.332-.856-.244-.856-.244l-2.45.015s-.182-.025-.317.056c-.131.079-.216.263-.216.263s-.387 1.03-.903 1.904c-1.088 1.848-1.524 1.946-1.702 1.832-.413-.266-.31-1.07-.31-1.64 0-1.783.27-2.52-.527-2.71-.265-.063-.46-.105-1.138-.112-.87-.009-1.607.003-2.023.207-.277.136-.49.439-.36.457.16.021.522.098.714.361.248.34.239 1.104.239 1.104s.143 2.097-.333 2.356c-.327.178-.775-.185-1.74-1.853-.493-.853-.865-1.797-.865-1.797s-.072-.176-.2-.272c-.155-.115-.372-.151-.372-.151l-2.327.015s-.35.01-.478.162c-.114.135-.009.413-.009.413s1.817 4.244 3.874 6.383c1.887 1.963 4.028 1.834 4.028 1.834h.97z"/>
              </svg>
            </a>
          </div>
          <div className="text-sm text-gray-500 mr-3">
            Сделано в <span className="font-semibold text-blue-600">calc-lead</span>
          </div>
        </div>
      </footer>
    </>
  );
}
