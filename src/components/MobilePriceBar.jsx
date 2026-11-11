import { useEffect, useRef, useState } from 'react';
import { formatRub } from '../calc.js';

export default function MobilePriceBar({ total }) {
  const [hidden, setHidden] = useState(false);
  const priceBlockRef = useRef(null);

  useEffect(() => {
    // Находим блок с ценой один раз при монтировании
    priceBlockRef.current = document.querySelector('.price-block');
    
    const checkVisibility = () => {
      if (!priceBlockRef.current) return;
      
      const rect = priceBlockRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      // Если верхняя граница блока цены находится НИЖЕ низа экрана — ещё не дошли
      // Показываем плашку
      if (rect.top > windowHeight) {
        setHidden(false);
      } else {
        // Дошли до блока цены или прошли его — скрываем плашку
        setHidden(true);
      }
    };

    // Проверяем сразу при загрузке
    checkVisibility();
    
    // Слушаем скролл страницы
    window.addEventListener('scroll', checkVisibility, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className="mobile-price-bar">
      <span className="mobile-price-label">Стоимость</span>
      <span className="mobile-price-value">{formatRub(total)}</span>
    </div>
  );
}