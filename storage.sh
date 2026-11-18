#!/usr/bin/env bash
# 18.11.2026. Run in Yandex Cloud Shell: bucket for reviews (storage.yandexcloud.net is reachable from Russia
# when apigw/functions addresses are not), static key for upload policy, triggers, then redeploy the function.
set -euo pipefail
F=$(yc config get folder-id 2>/dev/null || true); F=${F:-b1g4rj04meutic27jaog}
B=care-at-your-pace-reviews
RAW=https://raw.githubusercontent.com/DownPlease/care-at-your-pace/${REV:-reviews-backend}
SA=$(yc iam service-account get reviews-fn --format json | jq -r .id)
yc resource-manager folder add-access-binding "$F" --role storage.editor --subject serviceAccount:$SA >/dev/null 2>&1 || true
yc storage bucket get $B >/dev/null 2>&1 || yc storage bucket create --name $B --default-storage-class standard --max-size 1073741824 >/dev/null
cat > /tmp/policy.json <<P
{"Version":"2012-10-17","Statement":[
 {"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::$B/public/*"},
 {"Effect":"Allow","Principal":{"CanonicalUser":"$SA"},"Action":"*","Resource":["arn:aws:s3:::$B","arn:aws:s3:::$B/*"]}]}
P
yc storage bucket update --name $B --policy-from-file /tmp/policy.json >/dev/null
yc storage bucket update --name $B --cors 'allowed-methods=[method-get,method-head,method-post],allowed-origins=[https://care-at-your-pace.com,https://www.care-at-your-pace.com],allowed-headers=[*],max-age-seconds=3600' >/dev/null
echo "bucket ok"
touch ~/.reviews-secrets; chmod 600 ~/.reviews-secrets
if ! grep -q '^S3K=' ~/.reviews-secrets; then
  K=$(yc iam access-key create --service-account-id "$SA" --description reviews-upload-policy --format json)
  printf 'S3K=%s\nS3S=%s\n' "$(jq -r .access_key.key_id <<<"$K")" "$(jq -r .secret <<<"$K")" >> ~/.reviews-secrets
  echo "access key created"
fi
curl -sSfL "$RAW/setup.sh?$(date +%s)" -o ~/setup.sh && REV="${REV:-reviews-backend}" bash ~/setup.sh
FID=$(yc serverless function get reviews-api --format json | jq -r .id)
yc serverless trigger get reviews-inbox >/dev/null 2>&1 || yc serverless trigger create object-storage --name reviews-inbox \
  --bucket-id $B --prefix inbox/ --events create-object --batch-size 1 --batch-cutoff 1s \
  --invoke-function-id "$FID" --invoke-function-service-account-id "$SA" >/dev/null
yc serverless trigger get reviews-timer >/dev/null 2>&1 || yc serverless trigger create timer --name reviews-timer \
  --cron-expression '*/5 * ? * * *' --invoke-function-id "$FID" --invoke-function-service-account-id "$SA" >/dev/null
echo "triggers ok"
yc serverless function invoke reviews-api -d '{"messages":[{"event_metadata":{"event_type":"yandex.cloud.events.serverless.triggers.TimerMessage"}}]}'
echo
curl -s https://storage.yandexcloud.net/$B/public/reviews.json | head -c 200; echo
curl -s https://storage.yandexcloud.net/$B/public/upload.json | jq -r '.url, .expires'
curl -s -o /dev/null -w 'CORS preflight %{http_code}\n' -X OPTIONS https://storage.yandexcloud.net/$B/public/upload.json -H 'Origin: https://care-at-your-pace.com' -H 'Access-Control-Request-Method: POST'
