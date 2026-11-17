#!/usr/bin/env bash
# Run in Yandex Cloud Shell. Creates SA, YDB serverless DB + tables, function, API Gateway.
set -euo pipefail
F=$(yc config get folder-id 2>/dev/null || true); F=${F:-b1g4rj04meutic27jaog}
RAW=https://raw.githubusercontent.com/DownPlease/care-at-your-pace/reviews-backend
mkdir -p ~/fn && cd ~/fn
for f in index.js package.json schema.yql gateway.yaml; do curl -sSfL "$RAW/$f?$(date +%s)" -o $f; done
yc iam service-account get reviews-fn >/dev/null 2>&1 || yc iam service-account create --name reviews-fn >/dev/null
SA=$(yc iam service-account get reviews-fn --format json | jq -r .id)
for r in ydb.editor functions.functionInvoker; do yc resource-manager folder add-access-binding "$F" --role $r --subject serviceAccount:$SA >/dev/null 2>&1 || true; done
yc ydb database get reviews >/dev/null 2>&1 || yc ydb database create --name reviews --serverless >/dev/null
CONN=$(yc ydb database get reviews --format json | jq -r .endpoint)
EP=${CONN%%/?database=*}; DBP=${CONN##*database=}
[ -x ~/ydb/bin/ydb ] || curl -sSL https://install.ydb.tech/cli | bash >/dev/null
yc iam create-token > ~/.ydbtoken
~/ydb/bin/ydb -e "$EP" -d "$DBP" --iam-token-file ~/.ydbtoken scheme ls 2>/dev/null | grep -q reviews || ~/ydb/bin/ydb -e "$EP" -d "$DBP" --iam-token-file ~/.ydbtoken yql -f schema.yql
~/ydb/bin/ydb -e "$EP" -d "$DBP" --iam-token-file ~/.ydbtoken scheme ls
yc serverless function get reviews-api >/dev/null 2>&1 || yc serverless function create --name reviews-api >/dev/null
FID=$(yc serverless function get reviews-api --format json | jq -r .id)
sed -e "s/FUNCTION_ID/$FID/g" -e "s/SA_ID/$SA/g" gateway.yaml > gw.yaml
if yc serverless api-gateway get reviews >/dev/null 2>&1; then yc serverless api-gateway update reviews --spec gw.yaml >/dev/null; else yc serverless api-gateway create --name reviews --spec gw.yaml >/dev/null; fi
DOMAIN=$(yc serverless api-gateway get reviews --format json | jq -r .domain)
[ -s ~/.reviews-secrets ] || printf 'MS=%s\nOS=%s\n' "$(openssl rand -hex 32)" "$(openssl rand -hex 32)" > ~/.reviews-secrets
chmod 600 ~/.reviews-secrets 2>/dev/null || true; . ~/.reviews-secrets
mkdir -p src && cp index.js package.json src/
# keep the GitHub dispatch token that was set by hand in the console (never stored in files)
GH=$(yc serverless function version get-by-tag --function-name reviews-api --tag '$latest' --format json 2>/dev/null | jq -r '.environment.GH_DISPATCH_TOKEN // empty')
yc serverless function version create --function-name reviews-api --runtime nodejs22 --entrypoint index.handler \
  --memory 256m --execution-timeout 15s --source-path src --service-account-id "$SA" \
  --environment "YDB_CONNECTION_STRING=$CONN" --environment "SERVICE_ORIGIN=https://$DOMAIN" \
  --environment "MODERATION_SECRET=$MS" --environment "OUTBOX_SECRET=$OS" --environment TG_DIRECT=0 \
  --environment TG_BOT_TOKEN=relay --environment '"TG_REVIEW_CHATS=488588060,376181827"' ${GH:+--environment "GH_DISPATCH_TOKEN=$GH"} >/dev/null
echo "GH_DISPATCH_TOKEN: ${GH:+set}${GH:-not set}" | sed 's/not set.*/not set/'
echo "FUNCTION=$FID SA=$SA"
echo "API=https://$DOMAIN"
curl -s "https://$DOMAIN/health"; echo
curl -s "https://$DOMAIN/api/reviews"; echo
