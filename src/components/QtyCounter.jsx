/**
 * src/components/QtyCounter.jsx
 * Переиспользуемый кастомный счётчик «− / значение / +» вместо
 * браузерных стрелок у <input type="number">.
 */
export default function QtyCounter({ value, onChange, min = 1, max = 999, fullWidth = false }) {
  return (
    <div className={`qty-counter ${fullWidth ? 'full-width' : ''}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Уменьшить"
      >
        −
      </button>
      <input
        type="number"
        className="qty-value"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value) || min;
          onChange(Math.max(min, Math.min(max, v)));
        }}
        min={min}
        max={max}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Увеличить"
      >
        +
      </button>
    </div>
  );
}
