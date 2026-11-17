"""Relay review notifications from the Yandex Cloud reviews API to Telegram.

POST {API}/api/outbox returns claimed messages (claim lasts 5 minutes); each is sent with
sendMessage and confirmed via /api/outbox/ack. Unconfirmed messages are retried on the next run.
"""
import json, os, sys, urllib.request

API = os.environ["REVIEWS_API"].rstrip("/")
SECRET = os.environ.get("REVIEWS_OUTBOX_SECRET", "")
TOKEN = os.environ.get("TG_BOT_TOKEN", "")
if not SECRET or not TOKEN:
    print("Нет секретов REVIEWS_OUTBOX_SECRET / TG_BOT_TOKEN — пропуск")
    sys.exit(0)

def post(url, data=None, auth=True):
    headers = {"Content-Type": "application/json"}
    if auth:
        headers["Authorization"] = "Bearer " + SECRET
    req = urllib.request.Request(url, data=json.dumps(data or {}).encode(), headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

failed = 0
for _ in range(5):  # up to 20 messages per run
    box = post(API + "/api/outbox")
    if not box.get("messages"):
        break
    for m in box["messages"]:
        try:
            res = post(f"https://api.telegram.org/bot{TOKEN}/sendMessage", m["message"], auth=False)
            if not res.get("ok"):
                raise RuntimeError(res.get("description", "Telegram error"))
            post(API + "/api/outbox/ack", {"review_id": m["review_id"], "chat_id": m["chat_id"], "message_id": res["result"]["message_id"]})
            print("Отправлено в чат", m["chat_id"])
        except Exception as e:  # message text is not logged on purpose
            failed += 1
            print("Не отправлено в чат", m["chat_id"], type(e).__name__, str(e)[:200].replace(TOKEN, "***"))
sys.exit(1 if failed else 0)
