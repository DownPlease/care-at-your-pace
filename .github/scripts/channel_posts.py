"""Блок «Из Telegram-канала» на главной care-at-your-pace.com — из публичной ленты канала.

Читает https://t.me/s/psyalina, берёт 6 последних постов с текстом и записывает карточки
между <!--channel-posts:start--> и <!--channel-posts:end--> в index.html.
Формат карточек тот же, что у channel/tools/site_posts.py в папке проекта.
Запускается из GitHub Actions (.github/workflows/channel-posts.yml).
"""
import datetime, html, re, sys, urllib.request

CHANNEL = "psyalina"
CHANNEL_URL = f"https://t.me/{CHANNEL}"
INDEX = "index.html"
START, END = "<!--channel-posts:start-->", "<!--channel-posts:end-->"
LIMIT = 6
EXCERPT = 300
MSK = datetime.timezone(datetime.timedelta(hours=3))


def fetch():
    req = urllib.request.Request(f"https://t.me/s/{CHANNEL}", headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def to_text(fragment):
    # эмодзи Telegram: <i class="emoji" ...><b>🙈</b></i> -> 🙈 (иначе <b> примется за заголовок)
    fragment = re.sub(r'<i class="emoji"[^>]*><b>(.*?)</b></i>', r"\1", fragment, flags=re.S)
    fragment = re.sub(r'<tg-emoji[^>]*>(.*?)</tg-emoji>', r"\1", fragment, flags=re.S)
    fragment = re.sub(r"<br\s*/?>", "\n", fragment)
    fragment = re.sub(r"</?b>", "**", fragment)
    fragment = re.sub(r"<[^>]+>", "", fragment)
    return html.unescape(fragment)


def parse(page):
    posts = []
    for block in re.split(r'(?=<div class="tgme_widget_message_wrap)', page)[1:]:
        pid = re.search(rf'data-post="{CHANNEL}/(\d+)"', block)
        body = re.search(r'<div class="tgme_widget_message_text js-message_text"[^>]*>(.*?)</div>', block, re.S)
        when = re.search(r'<time datetime="([^"]+)"', block)
        if not (pid and body and when):
            continue  # служебные сообщения, медиа без текста
        text = to_text(body.group(1)).strip()
        paras = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
        if not paras:
            continue
        title = None
        if re.fullmatch(r"\*\*(.+?)\*\*", paras[0]):
            title = paras.pop(0)[2:-2].strip()
        out = ""
        for p in paras:
            p = re.sub(r"\s*\n\s*", " ", p.replace("**", ""))
            out = (out + " " + p).strip()
            if len(out) >= EXCERPT * 0.6:
                break
        if not title:
            first = re.split(r"(?<=[.!?…])\s", out, maxsplit=1)[0]
            title = "О канале «Поныть по делу»" if pid.group(1) == "4" else first[:90]
        if len(out) > EXCERPT:
            out = out[:EXCERPT].rsplit(" ", 1)[0].rstrip(",.:;—") + "…"
        date = datetime.datetime.fromisoformat(when.group(1)).astimezone(MSK).date().isoformat()
        posts.append({"id": int(pid.group(1)), "title": title, "text": out, "date": date})
    return posts


def build(posts):
    posts = sorted(posts, key=lambda p: (p["date"], p["id"]), reverse=True)[:LIMIT]
    cards = []
    for p in posts:
        y, mo, d = p["date"].split("-")
        cards.append(
            f'<article class="post-card"><time datetime="{p["date"]}">{d}.{mo}.{y}</time>'
            f'<h3>{html.escape(p["title"])}</h3><p>{html.escape(p["text"])}</p>'
            f'<a href="{CHANNEL_URL}/{p["id"]}" data-channel target="_blank" rel="noopener noreferrer">Читать в канале ↗</a></article>')
    return (
        '<section class="section channel-posts" id="channel" aria-labelledby="channel-title">'
        '<div class="split-head"><div><p class="eyebrow">Из Telegram-канала</p>'
        '<h2 id="channel-title">Поныть<br><em>по делу.</em></h2></div>'
        '<p>Короткие разборы о тревоге, самокритике и усталости, мини-практики и ответы на вопросы. '
        f'<a href="{CHANNEL_URL}" data-channel target="_blank" rel="noopener noreferrer">Подписаться на канал ↗</a></p></div>'
        f'<div class="posts-grid">{"".join(cards)}</div></section>'), len(cards)


def main():
    page = fetch() if len(sys.argv) < 2 else open(sys.argv[1], encoding="utf-8").read()
    block, n = build(parse(page))
    if n < 3:
        sys.exit(f"Найдено постов: {n} — похоже, лента не разобралась; index.html не меняю")
    src = open(INDEX, encoding="utf-8", newline="").read()
    i, j = src.find(START), src.find(END)
    if i < 0 or j < i:
        sys.exit("Нет маркеров блока в index.html")
    new = src[:i + len(START)] + block + src[j:]
    print(f"Постов в блоке: {n}. {'Есть изменения' if new != src else 'Изменений нет'}.")
    if new != src:
        open(INDEX, "w", encoding="utf-8", newline="").write(new)


if __name__ == "__main__":
    main()
