var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// yc/handler.js
var handler_exports = {};
__export(handler_exports, {
  handler: () => handler,
  respond: () => respond,
  toRequest: () => toRequest
});
module.exports = __toCommonJS(handler_exports);
var import_ydb_sdk2 = __toESM(require("ydb-sdk"), 1);

// worker/index.js
var PAGE = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043E\u0442\u0437\u044B\u0432\u0430 \u2014 \u0410\u043B\u0438\u043D\u0430</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f1eb;color:#171a1e;font:17px/1.65 system-ui,sans-serif}main{max-width:800px;margin:auto;padding:40px 24px}h1{font-size:36px;font-weight:400;line-height:1.2;letter-spacing:-.04em}h2{font-size:22px;font-weight:500;overflow-wrap:anywhere}a{color:#3b506e}blockquote{margin:24px 0;white-space:pre-wrap;overflow-wrap:anywhere;border-top:1px solid #c2c6ca;padding-top:24px}.actions{display:flex;gap:12px;flex-wrap:wrap}button{font:inherit;padding:14px 22px;border:1px solid #3b506e;border-radius:30px;background:transparent;color:#3b506e;cursor:pointer}button.primary{background:#3b506e;color:white}button:disabled{opacity:.5;cursor:default}button:focus-visible,a:focus-visible{outline:3px solid #8a6238;outline-offset:4px}.meta{color:#596779;font-size:14px}#status{color:#3b506e}#confirm{border-top:1px solid #c2c6ca;padding:24px 0;margin-top:24px}#confirm[hidden],#review[hidden]{display:none}@media(max-width:500px){h1{font-size:32px}.actions{display:grid}button{width:100%}}</style></head><body><main><a href="https://care-at-your-pace.com/otzyvy/" rel="noreferrer">\u2190 \u041E\u0442\u0437\u044B\u0432\u044B \u043D\u0430 \u0441\u0430\u0439\u0442\u0435</a><h1>\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043E\u0442\u0437\u044B\u0432\u0430</h1><p id="status" role="status">\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443 \u0438\u0437 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0431\u043E\u0442\u0430 \u0432 Telegram.</p><section id="review" hidden><h2 id="name"></h2><p class="meta" id="meta"></p><blockquote id="text"></blockquote><div class="actions"><button class="primary" data-status="approved">\u041E\u0434\u043E\u0431\u0440\u0438\u0442\u044C</button><button data-status="rejected">\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C</button><button data-status="pending">\u0421\u043D\u044F\u0442\u044C \u0441 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438</button><button id="refresh">\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C</button></div><div id="confirm" hidden><p id="confirm-text"></p><div class="actions"><button id="save" class="primary">\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C</button><button id="cancel">\u041E\u0442\u043C\u0435\u043D\u0430</button></div></div><p class="meta">\u041D\u0435 \u043F\u0435\u0440\u0435\u0441\u044B\u043B\u0430\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0443: \u043E\u043D\u0430 \u0434\u0430\u0451\u0442 \u0434\u043E\u0441\u0442\u0443\u043F \u0442\u043E\u043B\u044C\u043A\u043E \u043A \u044D\u0442\u043E\u043C\u0443 \u043E\u0442\u0437\u044B\u0432\u0443. \u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u2014 90 \u0434\u043D\u0435\u0439.</p></section></main><script>
const token=location.hash.slice(1),id=token.split('.')[0],status=document.querySelector('#status'),review=document.querySelector('#review'),confirmBox=document.querySelector('#confirm');let version=0,pending=null;
const labels={pending:'\u041D\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0435',approved:'\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D',rejected:'\u041E\u0442\u043A\u043B\u043E\u043D\u0451\u043D'};
async function load(){try{const response=await fetch('/api/moderate/'+id,{headers:{Authorization:'Bearer '+token}});const data=await response.json();if(!response.ok)throw Error(data.error);const r=data.review;version=r.version;document.querySelector('#name').textContent=r.name;document.querySelector('#text').textContent=r.text;document.querySelector('#meta').textContent=new Date(r.created_at).toLocaleString('ru-RU');status.textContent='\u0421\u0442\u0430\u0442\u0443\u0441: '+labels[r.status];review.hidden=false;confirmBox.hidden=true;document.querySelectorAll('[data-status]').forEach(b=>b.disabled=b.dataset.status===r.status||(b.dataset.status==='pending'&&r.status!=='approved'));}catch(e){status.textContent=e.message||'\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432.';review.hidden=true;}}
document.querySelectorAll('[data-status]').forEach(button=>button.addEventListener('click',()=>{pending=button.dataset.status;confirmBox.hidden=false;document.querySelector('#confirm-text').textContent=pending==='approved'?'\u041E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u044D\u0442\u043E\u0442 \u043E\u0442\u0437\u044B\u0432 \u043D\u0430 \u0433\u043B\u0430\u0432\u043D\u043E\u0439 \u0438 \u043D\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435 \u043E\u0442\u0437\u044B\u0432\u043E\u0432?':pending==='rejected'?'\u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C \u043E\u0442\u0437\u044B\u0432? \u041E\u043D \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u0432\u0438\u0434\u0435\u043D \u043F\u043E\u0441\u0435\u0442\u0438\u0442\u0435\u043B\u044F\u043C \u0441\u0430\u0439\u0442\u0430.':'\u0421\u043D\u044F\u0442\u044C \u043E\u0442\u0437\u044B\u0432 \u0441 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u0438?';document.querySelector('#save').focus()}));document.querySelector('#cancel').addEventListener('click',()=>confirmBox.hidden=true);document.querySelector('#refresh').addEventListener('click',load);
document.querySelector('#save').addEventListener('click',async()=>{const button=document.querySelector('#save');button.disabled=true;try{const response=await fetch('/api/moderate/'+id,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({status:pending,version})});const data=await response.json();if(!response.ok)throw Error(data.error);await load();}catch(e){status.textContent=e.message||'\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u0435.';}finally{button.disabled=false;}});if(token)load();
</script></body></html>
`;
var encoder = new TextEncoder();
var ALLOWED = /* @__PURE__ */ new Set(["https://care-at-your-pace.com", "https://www.care-at-your-pace.com"]);
function json(value, status = 200, headers = {}) {
  return new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
}
async function key(secret) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}
function hex(bytes) {
  return [...new Uint8Array(bytes)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
async function sign(secret, value) {
  return hex(await crypto.subtle.sign("HMAC", await key(secret), encoder.encode(value)));
}
async function moderationToken(env, review) {
  const expires = Math.floor(Date.parse(review.created_at) / 1e3) + 90 * 86400;
  const value = review.id + "." + expires;
  return value + "." + await sign(env.MODERATION_SECRET, value);
}
async function authorize(env, token, id) {
  const parts = (token || "").split(".");
  if (parts.length !== 3 || parts[0] !== id || !/^\d+$/.test(parts[1]) || Number(parts[1]) < Date.now() / 1e3 || !/^[a-f0-9]{64}$/.test(parts[2])) return false;
  return crypto.subtle.verify("HMAC", await key(env.MODERATION_SECRET), Uint8Array.from(parts[2].match(/../g), (x) => parseInt(x, 16)), encoder.encode(parts[0] + "." + parts[1]));
}
function validInput(data) {
  if (!data || typeof data !== "object" || typeof data.name !== "string" || typeof data.text !== "string" || typeof data.request_id !== "string") return null;
  const name = data.name.trim() || "\u0410\u043D\u043E\u043D\u0438\u043C\u043D\u043E", text = data.text.trim();
  if (name.length > 60 || text.length < 20 || text.length > 5e3 || data.consent !== true || data.website || !/^[a-zA-Z0-9-]{16,64}$/.test(data.request_id)) return null;
  return { name, text, request_id: data.request_id };
}
async function body(request) {
  const contentType = (request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
  if (!["application/json", "text/plain"].includes(contentType)) return null;
  if (Number(request.headers.get("Content-Length")) > 32e3) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.length;
    if (total > 32e3) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
async function limit(env, request) {
  const now = Math.floor(Date.now() / 1e3), hour = Math.floor(now / 3600);
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0] || "unknown";
  const hash = await sign(env.MODERATION_SECRET, ip + ":" + hour);
  const entries = [["ip:" + hash, 3], ["global:" + hour, 100]];
  for (const [name, max] of entries) {
    const row = await env.DB.prepare("INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count").bind(name, now + 7200).first();
    if (row.count > max) return false;
  }
  await env.DB.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(now).run();
  return true;
}
async function telegramMessage(env, chat, review) {
  const token = await moderationToken(env, review);
  const url = env.SERVICE_ORIGIN + "/moderate/#" + token;
  const message = "\u041D\u043E\u0432\u044B\u0439 \u043E\u0442\u0437\u044B\u0432 \u043D\u0430 care-at-your-pace.com\n\n" + review.name + "\n\n" + review.text.slice(0, 3200) + (review.text.length > 3200 ? "\n\n\u041F\u043E\u043B\u043D\u044B\u0439 \u0442\u0435\u043A\u0441\u0442 \u2014 \u043F\u043E \u043A\u043D\u043E\u043F\u043A\u0435 \u043D\u0438\u0436\u0435." : "") + "\n\n\u041E\u0442\u0437\u044B\u0432 \u043F\u043E\u043A\u0430 \u043D\u0435 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D.";
  return { chat_id: chat, text: message, link_preview_options: { is_disabled: true }, reply_markup: { inline_keyboard: [[{ text: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0438 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u0442\u044C \u043E\u0442\u0437\u044B\u0432", url }]] } };
}
async function telegram(env, chat, review) {
  const response = await fetch("https://api.telegram.org/bot" + env.TG_BOT_TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(Number(env.TG_TIMEOUT_MS) || 1e4),
    body: JSON.stringify(await telegramMessage(env, chat, review))
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error("Telegram delivery failed");
  return String(result.result.message_id);
}
async function flush(env, reviewId = null) {
  if (env.TG_DIRECT === "0") return;
  const now = Math.floor(Date.now() / 1e3);
  const sql = "SELECT d.review_id,d.chat_id,r.name,r.text,r.created_at,r.id FROM deliveries d JOIN reviews r ON r.id=d.review_id WHERE d.sent_at IS NULL AND d.claimed_until < ?" + (reviewId ? " AND d.review_id=?" : "") + " ORDER BY r.created_at LIMIT 4";
  const rows2 = await env.DB.prepare(sql).bind(...reviewId ? [now, reviewId] : [now]).all();
  for (const row of rows2.results) {
    const claim = await env.DB.prepare("UPDATE deliveries SET claimed_until=? WHERE review_id=? AND chat_id=? AND sent_at IS NULL AND claimed_until < ?").bind(now + 60, row.id, row.chat_id, now).run();
    if (!claim.meta.changes) continue;
    try {
      const message = await telegram(env, row.chat_id, row);
      await env.DB.prepare("UPDATE deliveries SET sent_at=?,message_id=? WHERE review_id=? AND chat_id=?").bind((/* @__PURE__ */ new Date()).toISOString(), message, row.id, row.chat_id).run();
    } catch {
      console.warn("Review notification pending retry");
    }
  }
}
async function route(request, env, ctx) {
  const url = new URL(request.url), origin = request.headers.get("Origin"), own = env.SERVICE_ORIGIN;
  const isPublic = url.pathname === "/api/reviews";
  const cors = origin && (ALLOWED.has(origin) || origin === own) ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {};
  const respond2 = (data, status = 200) => json(data, status, isPublic ? cors : {});
  if (request.method === "OPTIONS" && isPublic) {
    if (!cors["Access-Control-Allow-Origin"]) return respond2({ error: "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u043D\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0451\u043D." }, 403);
    return new Response(null, { status: 204, headers: { ...cors, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600" } });
  }
  if (url.pathname === "/health") return respond2({ ok: true });
  if (url.pathname === "/" || url.pathname === "/moderate/" || url.pathname === "/moderate") {
    return new Response(PAGE, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'" } });
  }
  if (!env.DB || !env.MODERATION_SECRET) return respond2({ error: "\u0421\u0435\u0440\u0432\u0438\u0441 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D." }, 503);
  if (url.pathname === "/api/outbox" || url.pathname === "/api/outbox/ack") {
    const auth = request.headers.get("Authorization")?.replace(/^Bearer /, "") || "";
    if (!env.OUTBOX_SECRET || env.OUTBOX_SECRET.length < 32 || await sign(env.MODERATION_SECRET, auth) !== await sign(env.MODERATION_SECRET, env.OUTBOX_SECRET)) return respond2({ error: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u0430." }, 403);
    const now = Math.floor(Date.now() / 1e3);
    if (url.pathname === "/api/outbox" && request.method === "POST") {
      const rows2 = await env.DB.prepare("SELECT d.review_id,d.chat_id,r.name,r.text,r.created_at,r.id FROM deliveries d JOIN reviews r ON r.id=d.review_id WHERE d.sent_at IS NULL AND d.claimed_until < ? ORDER BY r.created_at LIMIT 4").bind(now).all();
      const messages = [];
      for (const row of rows2.results) {
        const claim = await env.DB.prepare("UPDATE deliveries SET claimed_until=? WHERE review_id=? AND chat_id=? AND sent_at IS NULL AND claimed_until < ?").bind(now + 300, row.id, row.chat_id, now).run();
        if (claim.meta.changes) messages.push({ review_id: row.id, chat_id: row.chat_id, message: await telegramMessage(env, row.chat_id, row) });
      }
      return respond2({ messages });
    }
    if (url.pathname === "/api/outbox/ack" && request.method === "POST") {
      const data = await body(request);
      if (!data || typeof data.review_id !== "string" || typeof data.chat_id !== "string" || !/^\d+$/.test(String(data.message_id))) return respond2({ error: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435." }, 400);
      await env.DB.prepare("UPDATE deliveries SET sent_at=?,message_id=? WHERE review_id=? AND chat_id=?").bind((/* @__PURE__ */ new Date()).toISOString(), String(data.message_id), data.review_id, data.chat_id).run();
      return respond2({ ok: true });
    }
    return respond2({ error: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430." }, 404);
  }
  if (isPublic && request.method === "GET") {
    ctx.waitUntil(flush(env).catch(() => {
    }));
    const data = await env.DB.prepare("SELECT name,text,created_at FROM reviews WHERE status='approved' ORDER BY created_at DESC LIMIT 300").all();
    return respond2({ reviews: data.results });
  }
  if (isPublic && request.method === "POST") {
    if (!cors["Access-Control-Allow-Origin"]) return respond2({ error: "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u043D\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0451\u043D." }, 403);
    const input = validInput(await body(request));
    if (!input) return respond2({ error: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0444\u043E\u0440\u043C\u0443: \u043E\u0442\u0437\u044B\u0432 \u043E\u0442 20 \u0434\u043E 5 000 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432, \u0438\u043C\u044F \u0434\u043E 60 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 \u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u0438\u0435 \u043D\u0430 \u043F\u0443\u0431\u043B\u0438\u043A\u0430\u0446\u0438\u044E." }, 400);
    const existing = await env.DB.prepare("SELECT id,name,text FROM reviews WHERE request_id=?").bind(input.request_id).first();
    if (existing) {
      if (existing.name !== input.name || existing.text !== input.text) return respond2({ error: "\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u043F\u0435\u0440\u0435\u0434 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u043E\u0439 \u043D\u043E\u0432\u043E\u0433\u043E \u043E\u0442\u0437\u044B\u0432\u0430." }, 409);
      ctx.waitUntil(flush(env, existing.id).catch(() => {
      }));
      return respond2({ status: "received" });
    }
    if (!await limit(env, request)) return respond2({ error: "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u043D\u043E\u0433\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u043E\u043A. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0447\u0435\u0440\u0435\u0437 \u0447\u0430\u0441." }, 429);
    const id = crypto.randomUUID(), now = (/* @__PURE__ */ new Date()).toISOString();
    const chats = [...new Set((env.TG_REVIEW_CHATS || "").split(",").map((x) => x.trim()).filter((x) => /^-?\d+$/.test(x)))];
    if (!chats.length || !env.TG_BOT_TOKEN) return respond2({ error: "\u041F\u0440\u0438\u0451\u043C \u043E\u0442\u0437\u044B\u0432\u043E\u0432 \u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D." }, 503);
    const statements = [env.DB.prepare("INSERT INTO reviews(id,request_id,name,text,created_at,consent_at) VALUES(?,?,?,?,?,?)").bind(id, input.request_id, input.name, input.text, now, now), ...chats.map((chat) => env.DB.prepare("INSERT INTO deliveries(review_id,chat_id) VALUES(?,?)").bind(id, chat))];
    try {
      await env.DB.batch(statements);
    } catch (error) {
      const duplicate = await env.DB.prepare("SELECT id,name,text FROM reviews WHERE request_id=?").bind(input.request_id).first();
      if (duplicate && duplicate.name === input.name && duplicate.text === input.text) return respond2({ status: "received" });
      throw error;
    }
    ctx.waitUntil(flush(env, id).catch(() => {
    }));
    return respond2({ status: "received" }, 201);
  }
  const match = url.pathname.match(/^\/api\/moderate\/([a-f0-9-]{36})$/);
  if (match) {
    const token = request.headers.get("Authorization")?.replace(/^Bearer /, "");
    if (!await authorize(env, token, match[1])) return respond2({ error: "\u0421\u0441\u044B\u043B\u043A\u0430 \u043D\u0435\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u0430 \u0438\u043B\u0438 \u0441\u0440\u043E\u043A \u0435\u0451 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0438\u0441\u0442\u0451\u043A." }, 403);
    if (request.method === "GET") {
      const review = await env.DB.prepare("SELECT id,name,text,created_at,status,version FROM reviews WHERE id=?").bind(match[1]).first();
      return review ? respond2({ review }) : respond2({ error: "\u041E\u0442\u0437\u044B\u0432 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D." }, 404);
    }
    if (request.method === "POST") {
      if (origin !== own) return respond2({ error: "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u043D\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0451\u043D." }, 403);
      const data = await body(request);
      if (!data || !["approved", "rejected", "pending"].includes(data.status) || !Number.isInteger(data.version)) return respond2({ error: "\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435." }, 400);
      const changed = await env.DB.prepare("UPDATE reviews SET status=?,moderated_at=?,version=version+1 WHERE id=? AND version=?").bind(data.status, (/* @__PURE__ */ new Date()).toISOString(), match[1], data.version).run();
      if (!changed.meta.changes) return respond2({ error: "\u0420\u0435\u0448\u0435\u043D\u0438\u0435 \u0443\u0436\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u043E. \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u043E\u0442\u0437\u044B\u0432 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0442\u0435\u043A\u0443\u0449\u0438\u0439 \u0441\u0442\u0430\u0442\u0443\u0441." }, 409);
      return respond2({ status: data.status });
    }
  }
  return respond2({ error: "\u0421\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430." }, 404);
}
var worker_default = { async fetch(request, env, ctx) {
  try {
    return await route(request, env, ctx);
  } catch (error) {
    console.error("Review service request failed", String(error?.message || error).slice(0, 500));
    return json({ error: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0440\u043E\u0441. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u043F\u043E\u0437\u0436\u0435." }, 503, ALLOWED.has(request.headers.get("Origin")) ? { "Access-Control-Allow-Origin": request.headers.get("Origin"), "Vary": "Origin" } : {});
  }
} };

// yc/ydb-d1.js
var import_ydb_sdk = __toESM(require("ydb-sdk"), 1);
var { TypedValues } = import_ydb_sdk.default;
var U = "Utf8";
var I = "Int64";
var q = (types, yql) => ({ types, yql });
var Q = /* @__PURE__ */ new Map([
  ["INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count", q([U, I], (s) => `
$c${s} = (SELECT \`count\` FROM rate_limits WHERE \`key\`=$p0${s});
SELECT COALESCE($c${s},0l)+1l AS \`count\`;
UPSERT INTO rate_limits(\`key\`,\`count\`,expires_at) VALUES($p0${s},COALESCE($c${s},0l)+1l,$p1${s});`)],
  ["DELETE FROM rate_limits WHERE expires_at < ?", q([I], (s) => `DELETE FROM rate_limits WHERE expires_at < $p0${s};`)],
  ["SELECT d.review_id,d.chat_id,r.name,r.text,r.created_at,r.id FROM deliveries d JOIN reviews r ON r.id=d.review_id WHERE d.sent_at IS NULL AND d.claimed_until < ? ORDER BY r.created_at LIMIT 4", q([I], (s) => `
SELECT d.review_id AS review_id,d.chat_id AS chat_id,r.name AS name,r.text AS text,r.created_at AS created_at,r.id AS id
FROM deliveries AS d JOIN reviews AS r ON r.id=d.review_id WHERE d.sent_at IS NULL AND d.claimed_until < $p0${s} ORDER BY created_at LIMIT 4;`)],
  ["SELECT d.review_id,d.chat_id,r.name,r.text,r.created_at,r.id FROM deliveries d JOIN reviews r ON r.id=d.review_id WHERE d.sent_at IS NULL AND d.claimed_until < ? AND d.review_id=? ORDER BY r.created_at LIMIT 4", q([I, U], (s) => `
SELECT d.review_id AS review_id,d.chat_id AS chat_id,r.name AS name,r.text AS text,r.created_at AS created_at,r.id AS id
FROM deliveries AS d JOIN reviews AS r ON r.id=d.review_id WHERE d.sent_at IS NULL AND d.claimed_until < $p0${s} AND d.review_id=$p1${s} ORDER BY created_at LIMIT 4;`)],
  ["UPDATE deliveries SET claimed_until=? WHERE review_id=? AND chat_id=? AND sent_at IS NULL AND claimed_until < ?", q([I, U, U, I], (s) => `
$r${s} = (SELECT review_id,chat_id FROM deliveries WHERE review_id=$p1${s} AND chat_id=$p2${s} AND sent_at IS NULL AND claimed_until < $p3${s});
SELECT COUNT(*) AS changes FROM $r${s};
UPDATE deliveries ON SELECT review_id,chat_id,$p0${s} AS claimed_until FROM $r${s};`)],
  ["UPDATE deliveries SET sent_at=?,message_id=? WHERE review_id=? AND chat_id=?", q([U, U, U, U], (s) => `UPDATE deliveries SET sent_at=$p0${s},message_id=$p1${s} WHERE review_id=$p2${s} AND chat_id=$p3${s};`)],
  ["SELECT name,text,created_at FROM reviews WHERE status='approved' ORDER BY created_at DESC LIMIT 300", q([], () => `SELECT name,text,created_at FROM reviews WHERE status='approved'u ORDER BY created_at DESC LIMIT 300;`)],
  ["SELECT id,name,text FROM reviews WHERE request_id=?", q([U], (s) => `SELECT id,name,text FROM reviews WHERE request_id=$p0${s} LIMIT 1;`)],
  ["INSERT INTO reviews(id,request_id,name,text,created_at,consent_at) VALUES(?,?,?,?,?,?)", q([U, U, U, U, U, U], (s) => `INSERT INTO reviews(id,request_id,name,text,created_at,consent_at,status,version) VALUES($p0${s},$p1${s},$p2${s},$p3${s},$p4${s},$p5${s},'pending'u,0l);`)],
  ["INSERT INTO deliveries(review_id,chat_id) VALUES(?,?)", q([U, U], (s) => `INSERT INTO deliveries(review_id,chat_id,claimed_until) VALUES($p0${s},$p1${s},0l);`)],
  ["SELECT id,name,text,created_at,status,version FROM reviews WHERE id=?", q([U], (s) => `SELECT id,name,text,created_at,status,version FROM reviews WHERE id=$p0${s};`)],
  ["UPDATE reviews SET status=?,moderated_at=?,version=version+1 WHERE id=? AND version=?", q([U, U, U, I], (s) => `
$r${s} = (SELECT id FROM reviews WHERE id=$p2${s} AND version=$p3${s});
SELECT COUNT(*) AS changes FROM $r${s};
UPDATE reviews ON SELECT id,$p0${s} AS status,$p1${s} AS moderated_at,$p3${s}+1l AS version FROM $r${s};`)]
]);
function native(v) {
  if (v == null) return null;
  const own = (k) => Object.prototype.hasOwnProperty.call(v, k) && v[k] != null;
  if (own("nestedValue")) return native(v.nestedValue);
  if (own("nullFlagValue")) return null;
  for (const k of ["textValue", "bytesValue", "boolValue", "int32Value", "uint32Value"]) if (own(k)) return k === "bytesValue" ? Buffer.from(v[k]).toString("utf8") : v[k];
  for (const k of ["int64Value", "uint64Value"]) if (own(k)) return Number(v[k]);
  return null;
}
function rows(set) {
  if (!set) return [];
  const cols = (set.columns || []).map((c) => c.name);
  return (set.rows || []).map((r) => Object.fromEntries(cols.map((c, i) => [c, native(r.items[i])])));
}
function build(statements) {
  const decl = [], params = {}, body2 = [];
  statements.forEach((st, n) => {
    const t = Q.get(st.sql);
    if (!t) throw new Error("Unmapped SQL: " + st.sql);
    if (st.args.length !== t.types.length) throw new Error("Arity mismatch: " + st.sql);
    const s = "_" + n;
    t.types.forEach((type, i) => {
      decl.push(`DECLARE $p${i}${s} AS ${type};`);
      params[`$p${i}${s}`] = type === U ? TypedValues.utf8(String(st.args[i])) : TypedValues.int64(Number(st.args[i]));
    });
    body2.push(t.yql(s));
  });
  return { yql: decl.join("\n") + "\n" + body2.join("\n"), params };
}
function createD1(getDriver2) {
  const exec = async (statements) => {
    const { yql, params } = build(statements);
    const driver2 = await getDriver2();
    return driver2.tableClient.withSession((session) => session.executeQuery(yql, params));
  };
  const prepare = (sql, args = []) => ({
    sql,
    args,
    bind: (...values) => prepare(sql, values),
    first: async () => rows((await exec([{ sql, args }])).resultSets[0])[0] || null,
    all: async () => ({ results: rows((await exec([{ sql, args }])).resultSets[0]) }),
    run: async () => {
      const res = await exec([{ sql, args }]);
      const r = rows(res.resultSets[0])[0];
      return { meta: { changes: r && "changes" in r ? r.changes : 1 } };
    }
  });
  return { prepare, batch: async (statements) => {
    await exec(statements);
    return statements.map(() => ({ meta: { changes: 1 } }));
  }, _build: build };
}

// yc/handler.js
var { Driver, TokenAuthService } = import_ydb_sdk2.default;
var driver = null;
var driverToken = null;
var iamToken = null;
async function getDriver() {
  if (driver && driverToken === iamToken) return driver;
  const old = driver;
  driver = new Driver({ connectionString: process.env.YDB_CONNECTION_STRING, authService: new TokenAuthService(iamToken) });
  driverToken = iamToken;
  if (old) old.destroy().catch(() => {
  });
  if (!await driver.ready(8e3)) throw new Error("YDB not ready");
  return driver;
}
var DB = createD1(getDriver);
var ENV_KEYS = ["SERVICE_ORIGIN", "MODERATION_SECRET", "TG_BOT_TOKEN", "TG_REVIEW_CHATS", "TG_DIRECT", "TG_TIMEOUT_MS", "OUTBOX_SECRET"];
function toRequest(event, origin) {
  let path = event.url || event.path || "/";
  if (path.includes("{")) {
    const p = event.pathParams || event.pathParameters || {};
    path = "/" + (p.proxy || "");
  }
  const url = new URL(path, origin);
  if (!event.url && event.queryStringParameters) for (const [k, v] of Object.entries(event.queryStringParameters)) url.searchParams.set(k, v);
  const headers = new Headers();
  for (const [k, v] of Object.entries(event.headers || {})) if (!/^(cf-connecting-ip|host|content-length)$/i.test(k)) headers.set(k, v);
  const ip = event.requestContext?.identity?.sourceIp;
  if (ip) headers.set("CF-Connecting-IP", ip);
  const method = (event.httpMethod || "GET").toUpperCase();
  let body2;
  if (event.body && !["GET", "HEAD"].includes(method)) {
    body2 = event.isBase64Encoded ? Buffer.from(event.body, "base64") : Buffer.from(event.body, "utf8");
    headers.set("Content-Length", String(body2.length));
  }
  return new Request(url, { method, headers, body: body2 });
}
async function respond(response) {
  const headers = {};
  response.headers.forEach((v, k) => {
    headers[k] = v;
  });
  return { statusCode: response.status, headers, body: await response.text(), isBase64Encoded: false };
}
async function handler(event, context) {
  iamToken = context?.token?.access_token || iamToken;
  const env = { DB };
  for (const k of ENV_KEYS) if (process.env[k] != null) env[k] = process.env[k];
  const jobs = [];
  const ctx = { waitUntil: (p) => jobs.push(p) };
  const response = await worker_default.fetch(toRequest(event, env.SERVICE_ORIGIN || "https://localhost"), env, ctx);
  await Promise.allSettled(jobs);
  return respond(response);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler,
  respond,
  toRequest
});
