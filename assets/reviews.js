(() => {
  const api = window.REVIEWS_API || (['127.0.0.1','localhost'].includes(location.hostname)
    ? '' : 'https://care-at-your-pace-reviews.ivangnevashev777.chatgpt.site');
  const list = document.querySelector('[data-reviews-list]');
  const state = document.querySelector('[data-reviews-state]');
  const format = new Intl.DateTimeFormat('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'});
  async function load() {
    if (!list) return;
    try {
      const response = await fetch(api + '/api/reviews', {signal: AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!Array.isArray(data.reviews)) throw new Error();
      list.replaceChildren();
      const limit = Number(list.dataset.limit) || data.reviews.length;
      for (const review of data.reviews.slice(0, limit)) {
        const card = document.createElement('figure'); card.className = 'review-card';
        const quote = document.createElement('blockquote'); quote.textContent = review.text;
        const caption = document.createElement('figcaption'); caption.textContent = review.name;
        const date = document.createElement('time'); date.dateTime = review.created_at;
        date.textContent = format.format(new Date(review.created_at));
        caption.append(date); card.append(quote, caption); list.append(card);
      }
      state.hidden = data.reviews.length > 0;
      state.textContent = 'Опубликованных отзывов пока нет. Вы можете поделиться своим опытом.';
    } catch {
      state.hidden = false;
      state.textContent = 'Не удалось загрузить отзывы. Попробуйте обновить страницу чуть позже.';
    }
  }
  load();
  const form = document.querySelector('#review-form');
  if (!form) return;
  const status = document.querySelector('#review-status');
  let requestId = crypto.randomUUID();
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const fields = new FormData(form);
    const text = String(fields.get('text')).trim();
    if (text.length < 20) { status.textContent = 'Напишите, пожалуйста, не менее 20 символов.'; return; }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; status.textContent = 'Отправляем отзыв…';
    try {
      const response = await fetch(api + '/api/reviews', {
        method: 'POST', headers: {'Content-Type': 'application/json'}, signal: AbortSignal.timeout(15000),
        body: JSON.stringify({name: String(fields.get('name')).trim(), text, consent: fields.get('consent') === 'on', website: fields.get('website'), request_id: requestId})
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Не удалось отправить отзыв. Попробуйте позже.');
      form.reset(); requestId = crypto.randomUUID();
      status.textContent = 'Спасибо! Отзыв отправлен на проверку. Он появится на сайте после одобрения.';
    } catch (error) {
      status.textContent = error instanceof TypeError || error.name === 'TimeoutError'
        ? 'Нет ответа от сервера. Текст сохранён в форме — попробуйте отправить ещё раз.'
        : error.message;
    } finally { button.disabled = false; }
  });
})();
