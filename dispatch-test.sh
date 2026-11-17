#!/usr/bin/env bash
# Checks that GH_DISPATCH_TOKEN is set and that a repeated (idempotent) submission of an existing review
# triggers the relay workflow. No new review is created and nothing new is sent to Telegram.
set -euo pipefail
yc serverless function version get-by-tag --function-name reviews-api --tag '$latest' --format json | jq -r '"token set: " + (.environment | has("GH_DISPATCH_TOKEN") | tostring) + ", version " + .id + ", created " + .created_at'
C=$(yc ydb database get reviews --format json | jq -r .endpoint); yc iam create-token > /tmp/.t
~/ydb/bin/ydb -e "${C%%/?database=*}" -d "${C##*database=}" --iam-token-file /tmp/.t yql --format json-unicode \
  -s "SELECT request_id,name,text FROM reviews WHERE status='approved'u AND name='Надежда'u LIMIT 1;" > /tmp/r.json
python3 - <<'PY'
import json,urllib.request
d=open('/tmp/r.json').read().strip()
try:
    r=json.loads(d)
except ValueError:
    r=json.loads(d.splitlines()[0])
if isinstance(r,list): r=r[0]
body=json.dumps({"name":r["name"],"text":r["text"],"consent":True,"request_id":r["request_id"]}).encode()
req=urllib.request.Request("https://d5ddnu89r04bngjmeai1.emzafcgx.apigw.yandexcloud.net/api/reviews",data=body,method="POST",
  headers={"Origin":"https://care-at-your-pace.com","Content-Type":"text/plain;charset=UTF-8"})
with urllib.request.urlopen(req,timeout=30) as resp: print("replay:",resp.status,resp.read().decode())
PY
