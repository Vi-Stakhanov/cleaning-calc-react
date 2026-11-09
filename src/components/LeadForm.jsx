import { useState } from 'react';
import { Link } from 'react-router-dom';

const CHANNELS = ['MAX', 'Telegram', 'Позвонить'];

function formatPhone(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (digits.length > 0 && !digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length === 1) return '+7';
  if (digits.length <= 4) return '+7 (' + digits.slice(1);
  if (digits.length <= 7) return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4);
  if (digits.length <= 9) return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7);
  return '+7 (' + digits.slice(1, 4) + ') ' + digits.slice(4, 7) + '-' + digits.slice(7, 9) + '-' + digits.slice(9, 11);
}

const CALL_TIMES = ['Как можно скорее', 'До 12:00', '12:00–18:00', '18:00–21:00', 'Любое'];

const inputCls = 'input';
const selectCls = 'select';

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-98.5-79.8-178.3-178.3-178.3z"/></svg>
);
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64c0 247.4 200.6 448 448 448c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368c-70.4-33.3-127.4-90.3-160.7-160.7l49.3-40.3c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
);

export default function LeadForm({ state, result, client }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState('MAX');
  const [time, setTime] = useState(CALL_TIMES[0]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const isValid = name.trim().length > 0 && phone.replace(/\D/g, '').length >= 11;
  const isCarwash = client?.id === 'carwash';

  const serviceLabel = isCarwash
    ? (client?.packages?.find((p) => p.id === state.type)?.name ?? state.type)
    : (client?.tariffs?.find((t) => t.id === state.type)?.name ?? state.type);

  const vehicleLabel = isCarwash
    ? (client?.vehicleTypes?.find((v) => v.id === state.vehicleType)?.name ?? state.vehicleType)
    : null;

  const packagePrice = isCarwash
    ? (client?.vehicleTypes?.find((v) => v.id === state.vehicleType)?.prices?.[state.type] ?? 0)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || sending) return;
    if (!privacyAgreed) {
      alert('Необходимо дать согласие на обработку персональных данных');
      return;
    }

    const extrasList = client?.extras ?? [];
    const selected = extrasList.filter(
      (ex) => Math.max(0, Number(state.extras?.[ex.id]) || 0) > 0
    );
    const mapExtra = (ex) => ({
      id: ex.id,
      label: ex.name ?? ex.label,
      qty: Math.max(0, Number(state.extras?.[ex.id]) || 0),
      price: ex.prices?.[state.vehicleType] ?? ex.price ?? 0,
    });

    const lead = {
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      channel,
      time,
      totalPrice: result.total,
      serviceType: serviceLabel,
      ...(isCarwash
        ? { vehicleType: vehicleLabel, packagePrice }
        : {
            area: Number(state.area),
            rooms: Number(state.rooms),
            bathrooms: Number(state.bathrooms),
          }),
      extras: selected.filter((ex) => ex.category !== 'Химчистка').map(mapExtra),
      chem: selected.filter((ex) => ex.category === 'Химчистка').map(mapExtra),
    };

    if (import.meta.env.DEV) {
      console.log('Заявка (dev-заглушка):', lead);
      setSubmitted(true);
      return;
    }

    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        if (data.emailOk || data.tgOk) {
          setSubmitted(true);
        } else {
          // ДИАГНОСТИКА: причина будет видна прямо на экране
          setError('Доставка не удалась. Диагностика: ' + JSON.stringify(data.debug));
        }
      } else {
        setError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
      }
    } catch {
      setError('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <section className="cta-block">
        <p className="thanks-text" role="status">
          Спасибо! Заявка принята, мы свяжемся с вами в выбранное время.
        </p>
      </section>
    );
  }

  return (
    <form className="cta-block" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">Оставить заявку</h2>
      <p className="subtitle cta-subtitle-margin">Свяжемся в выбранное время</p>

      <label className="form-group">
        <span className="label">Имя</span>
        <span className="input-wrapper">
          <span className="input-icon"><IconUser /></span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" required className={inputCls} />
        </span>
      </label>

      <label className="form-group">
        <span className="label">Телефон</span>
        <span className="input-wrapper">
          <span className="input-icon"><IconPhone /></span>
          <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="+7 (___) ___-__-__" required className={inputCls} />
        </span>
      </label>

      <div className="form-group">
        <div className="label">Способ связи</div>
        <div className="radio-group">
          {CHANNELS.map((ch) => (
            <label key={ch} className="radio-label">
              <input type="radio" name="channel" value={ch} checked={channel === ch} onChange={() => setChannel(ch)} className="choice-input" />
              {ch}
            </label>
          ))}
        </div>
      </div>

      <label className="form-group form-group-last">
        <span className="label">Удобное время для звонка</span>
        <select value={time} onChange={(e) => setTime(e.target.value)} className={selectCls}>
          {CALL_TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>

      <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <input type="checkbox" id="privacy" checked={privacyAgreed} onChange={(e) => setPrivacyAgreed(e.target.checked)} style={{ marginTop: '1px', accentColor: 'var(--color-primary)', width: '17px', height: '17px' }} required />
        <label htmlFor="privacy" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
          Я даю согласие на обработку персональных данных в соответствии с{' '}
          <Link to="/privacy" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Политикой конфиденциальности</Link>
        </label>
      </div>

      <button type="submit" disabled={!isValid || sending || !privacyAgreed} className="button">
        {sending ? 'Отправляем...' : 'Оставить заявку'}
      </button>

      {error && <p className="error-text" role="alert" style={{ wordBreak: 'break-word' }}>{error}</p>}
    </form>
  );
}