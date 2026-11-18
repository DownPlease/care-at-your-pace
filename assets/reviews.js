(() => {
  const local = ['127.0.0.1','localhost'].includes(location.hostname);
  // 18.11.2026: адреса API Gateway / Cloud Functions из России режутся, storage.yandexcloud.net открывается.
  // Поэтому список отзывов читается из бакета, новый отзыв загружается в бакет, API Gateway — запасной путь.
  const STORE = 'https://storage.yandexcloud.net/care-at-your-pace-reviews/public/';
  const API = window.REVIEWS_API !== undefined ? window.REVIEWS_API : local ? '' : 'https://d5ddnu89r04bngjmeai1.emzafcgx.apigw.yandexcloud.net';
  const list = document.querySelector('[data-reviews-list]');
  const state = document.querySelector('[data-reviews-state]');
  const format = new Intl.DateTimeFormat('ru-RU', {day: 'numeric', month: 'long', year: 'numeric'});
  const network = error => error instanceof TypeError || error.name === 'TimeoutError' || error.name === 'AbortError';
  async function getJSON(url, ms) {
    const response = await fetch(url, {signal: AbortSignal.timeout(ms), cache: 'no-cache'});
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return response.json();
  }
  async function reviews() {
    const sources = local ? [() => getJSON(API + '/api/reviews', 10000)]
      : [() => getJSON(STORE + 'reviews.json', 8000), () => getJSON(API + '/api/reviews', 8000)];
    let last;
    for (const source of sources) {
      try { const data = await source(); if (Array.isArray(data.reviews)) return data.reviews; } catch (error) { last = error; }
    }
    throw last || new Error();
  }
  async function load() {
    if (!list) return;
    try {
      const items = await reviews();
      list.replaceChildren();
      const limit = Number(list.dataset.limit) || items.length;
      for (const review of items.slice(0, limit)) {
        const card = document.createElement('figure'); card.className = 'review-card';
        const quote = document.createElement('blockquote'); quote.textContent = review.text;
        const caption = document.createElement('figcaption'); caption.textContent = review.name;
        const date = document.createElement('time'); date.dateTime = review.created_at;
        date.textContent = format.format(new Date(review.created_at));
        caption.append(date); card.append(quote, caption); list.append(card);
      }
      state.hidden = items.length > 0;
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
  async function viaStorage(payload) {
    const upload = await getJSON(STORE + 'upload.json', 8000);
    const data = new FormData();
    data.append('key', 'inbox/' + payload.request_id + '.json');
    data.append('Content-Type', 'application/json');
    for (const [name, value] of Object.entries(upload.fields)) data.append(name, value);
    data.append('file', new Blob([JSON.stringify(payload)], {type: 'application/json'}), 'review.json');
    const response = await fetch(upload.url, {method: 'POST', body: data, signal: AbortSignal.timeout(20000)});
    if (!response.ok) throw new TypeError('upload ' + response.status);
  }
  async function viaApi(payload) {
    const response = await fetch(API + '/api/reviews', {method: 'POST', headers: {'Content-Type': 'text/plain;charset=UTF-8'},
      signal: AbortSignal.timeout(20000), body: JSON.stringify(payload)});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Не удалось отправить отзыв. Попробуйте позже.');
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const fields = new FormData(form);
    const name = String(fields.get('name') || '').trim(), text = String(fields.get('text') || '').trim();
    if (text.length < 20) { status.textContent = 'Напишите, пожалуйста, не менее 20 символов.'; return; }
    if (text.length > 5000 || name.length > 60) { status.textContent = 'Отзыв — до 5 000 символов, имя — до 60.'; return; }
    if (fields.get('consent') !== 'on') { status.textContent = 'Отметьте согласие на публикацию.'; return; }
    const payload = {name, text, consent: true, website: fields.get('website') || '', request_id: requestId};
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true; status.textContent = 'Отправляем отзыв…';
    try {
      if (local) await viaApi(payload);
      else { try { await viaStorage(payload); } catch (error) { if (!network(error)) throw error; await viaApi(payload); } }
      form.reset(); requestId = crypto.randomUUID();
      status.textContent = 'Спасибо! Отзыв отправлен на проверку. Он появится на сайте после одобрения.';
    } catch (error) {
      status.textContent = network(error)
        ? 'Нет ответа от сервера. Текст сохранён в форме — попробуйте отправить ещё раз.'
        : error.message;
    } finally { button.disabled = false; }
  });
})();
