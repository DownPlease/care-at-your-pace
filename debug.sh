#!/usr/bin/env bash
# Runs the function handler in Cloud Shell against the real YDB: submit, dedupe, list, outbox, ack, moderation; then deletes test rows.
set -uo pipefail
cd ~/fn && curl -sSfL "https://raw.githubusercontent.com/DownPlease/care-at-your-pace/reviews-backend/index.js?$(date +%s)" -o src/index.js
cp src/index.js /tmp/fnt/ && cd /tmp/fnt
export YDB_CONNECTION_STRING=$(yc ydb database get reviews --format json | jq -r .endpoint)
export SERVICE_ORIGIN=https://local MODERATION_SECRET=$(openssl rand -hex 32) OUTBOX_SECRET=$(openssl rand -hex 32) TG_DIRECT=0 TG_BOT_TOKEN=relay TG_REVIEW_CHATS=1
TOKEN=$(yc iam create-token) node -e "
const m=require('./index.js');const ctx={token:{access_token:process.env.TOKEN}};
const O='https://care-at-your-pace.com',H={Origin:O,'Content-Type':'text/plain;charset=UTF-8'};
const call=async(ev)=>{const r=await m.handler({headers:{},...ev},ctx);console.log(ev.httpMethod,ev.url,r.statusCode,r.body.slice(0,160).replace(/\n/g,' '));return r;};
(async()=>{
 const rid='debugtest-'+Date.now();
 const body=JSON.stringify({name:'DEBUG',text:'Технический тест, не настоящий отзыв, будет удалён.',consent:true,request_id:rid});
 await call({httpMethod:'POST',url:'/api/reviews',headers:H,body,requestContext:{identity:{sourceIp:'203.0.113.9'}}});
 await call({httpMethod:'POST',url:'/api/reviews',headers:H,body,requestContext:{identity:{sourceIp:'203.0.113.9'}}});
 await call({httpMethod:'GET',url:'/api/reviews'});
 const box=JSON.parse((await call({httpMethod:'POST',url:'/api/outbox',headers:{Authorization:'Bearer '+process.env.OUTBOX_SECRET}})).body);
 const msg=box.messages[0];
 if(msg){await call({httpMethod:'POST',url:'/api/outbox/ack',headers:{Authorization:'Bearer '+process.env.OUTBOX_SECRET,'Content-Type':'application/json'},body:JSON.stringify({review_id:msg.review_id,chat_id:msg.chat_id,message_id:1})});
  const tok=msg.message.reply_markup.inline_keyboard[0][0].url.split('#')[1];
  const g=await call({httpMethod:'GET',url:'/api/moderate/'+msg.review_id,headers:{Authorization:'Bearer '+tok}});
  await call({httpMethod:'POST',url:'/api/moderate/'+msg.review_id,headers:{Authorization:'Bearer '+tok,Origin:'https://local','Content-Type':'application/json'},body:JSON.stringify({status:'rejected',version:JSON.parse(g.body).review.version})});
  await call({httpMethod:'GET',url:'/api/moderate/'+msg.review_id,headers:{Authorization:'Bearer '+tok}});}
 process.exit(0)})().catch(e=>{console.log('ERR',e);process.exit(1)})" 2>&1 | tail -20
EP=${YDB_CONNECTION_STRING%%/?database=*}; DBP=${YDB_CONNECTION_STRING##*database=}
yc iam create-token > /tmp/.ydbtoken
~/ydb/bin/ydb -e "$EP" -d "$DBP" --iam-token-file /tmp/.ydbtoken yql -s "
\$ids = (SELECT id FROM reviews WHERE name='DEBUG'u);
DELETE FROM deliveries WHERE review_id IN \$ids;
DELETE FROM reviews WHERE name='DEBUG'u;
DELETE FROM rate_limits;
SELECT COUNT(*) AS left_reviews FROM reviews;" 2>&1 | tail -5
