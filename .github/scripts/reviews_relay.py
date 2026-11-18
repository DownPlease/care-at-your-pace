"""Relay review notifications to Telegram via Yandex Object Storage.

18.11.2026: API Gateway of Yandex Cloud is unreachable from GitHub runners (and from Russia),
so the reviews function publishes unsent messages to the bucket under a name derived from
REVIEWS_OUTBOX_SECRET. This script sends them with sendMessage and confirms by uploading
{"outbox_ack": [...], "secret": ...} to inbox/ with the public upload policy; the function
marks them sent and rewrites the outbox.
"""
import hashlib, json, os, sys, urllib.error, urllib.request, uuid

STORE = "https://storage.yandexcloud.net/care-at-your-pace-reviews/public/"
SECRET = os.environ.get("REVIEWS_OUTBOX_SECRET", "")
TOKEN = os.environ.get("TG_BOT_TOKEN", "")
if not SECRET or not TOKEN:
    print("Нет секретов REVIEWS_OUTBOX_SECRET / TG_BOT_TOKEN — пропуск")
    sys.exit(0)

def get(url):
    req = urllib.request.Request(url, headers={"Cache-Control": "no-cache"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def post_json(url, data):
    req = urllib.request.Request(url, data=json.dumps(data).encode(), headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def upload(payload):
    policy = get(STORE + "upload.json")
    fields = {"key": "inbox/ack-" + str(uuid.uuid4()) + ".json", "Content-Type": "application/json", **policy["fields"]}
    boundary = "----relay" + uuid.uuid4().hex
    body = b""
    for k, v in fields.items():
        body += f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
    body += f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="ack.json"\r\nContent-Type: application/json\r\n\r\n'.encode()
    body += json.dumps(payload).encode() + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(policy["url"], data=body, headers={"Content-Type": "multipart/form-data; boundary=" + boundary}, method="POST")
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status

name = "outbox-" + hashlib.sha256(("outbox:" + SECRET).encode()).hexdigest()[:40] + ".json"
try:
    box = get(STORE + name)
except urllib.error.HTTPError as e:
    if e.code in (403, 404):
        print("Очередь ещё не создана — пропуск")
        sys.exit(0)
    raise
acks, failed = [], 0
for m in box.get("messages", []):
    try:
        res = post_json(f"https://api.telegram.org/bot{TOKEN}/sendMessage", m["message"])
        if not res.get("ok"):
            raise RuntimeError(res.get("description", "Telegram error"))
        acks.append({"review_id": m["review_id"], "chat_id": m["chat_id"], "message_id": res["result"]["message_id"]})
        print("Отправлено в чат", m["chat_id"])
    except Exception as e:  # message text is not logged on purpose
        failed += 1
        print("Не отправлено в чат", m["chat_id"], type(e).__name__, str(e)[:200].replace(TOKEN, "***"))
if acks:
    print("Подтверждение:", upload({"outbox_ack": acks, "secret": SECRET}))
if not box.get("messages"):
    print("Новых уведомлений нет")
sys.exit(1 if failed else 0)
