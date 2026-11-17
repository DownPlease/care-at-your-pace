#!/usr/bin/env bash
# Runs the function handler locally in Cloud Shell against the real YDB to see errors.
set -uo pipefail
cd ~/fn && curl -sSfL "https://raw.githubusercontent.com/DownPlease/care-at-your-pace/reviews-backend/index.js?$(date +%s)" -o src/index.js
cd src && [ -d node_modules/ydb-sdk ] || npm i --omit=dev --silent >/dev/null 2>&1
export YDB_CONNECTION_STRING=$(yc ydb database get reviews --format json | jq -r .endpoint)
export SERVICE_ORIGIN=https://local MODERATION_SECRET=$(openssl rand -hex 32) TG_DIRECT=0 TG_BOT_TOKEN=relay TG_REVIEW_CHATS=1
TOKEN=$(yc iam create-token) node -e "
const m=require('./index.js');const ctx={token:{access_token:process.env.TOKEN}};
(async()=>{for(const ev of [{httpMethod:'GET',url:'/api/reviews',headers:{}}]){const r=await m.handler(ev,ctx);console.log(r.statusCode,r.body.slice(0,300));}process.exit(0)})().catch(e=>{console.log('ERR',e);process.exit(1)})" 2>&1 | tail -15
