#!/usr/bin/env bash
# Copies approved reviews from the old chatgpt.site service into YDB (idempotent via fixed request_id per created_at).
set -euo pipefail
curl -sS -m 30 https://care-at-your-pace-reviews.ivangnevashev777.chatgpt.site/api/reviews > /tmp/old.json
python3 - > /tmp/migrate.yql <<'PY'
import json,uuid
d=json.load(open('/tmp/old.json'))['reviews']
def s(x): return "'"+x.replace('\\','\\\\').replace("'","\\'")+"'u"
rows=[f"({s(str(uuid.uuid5(uuid.NAMESPACE_URL,'old:'+r['created_at'])))},{s('migrated-'+r['created_at'])},{s(r['name'])},{s(r['text'])},{s(r['created_at'])},'approved'u,{s(r['created_at'])},{s(r['created_at'])},1l)" for r in d]
print("UPSERT INTO reviews(id,request_id,name,text,created_at,status,consent_at,moderated_at,version) VALUES\n"+",\n".join(rows)+";")
PY
CONN=$(yc ydb database get reviews --format json | jq -r .endpoint); EP=${CONN%%/?database=*}; DBP=${CONN##*database=}
yc iam create-token > /tmp/.ydbtoken
~/ydb/bin/ydb -e "$EP" -d "$DBP" --iam-token-file /tmp/.ydbtoken yql -f /tmp/migrate.yql
~/ydb/bin/ydb -e "$EP" -d "$DBP" --iam-token-file /tmp/.ydbtoken yql -s "SELECT name,status,created_at,LEN(text) AS len FROM reviews;"
