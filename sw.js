// 贝多财税 - Service Worker 表单代理
// 拦截 /api/submit 请求，转发到企业微信 Webhook（SW 上下文无 CORS 限制）

const WECOM_WEBHOOK = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=cca569a2-0f10-48a9-beb7-37312dba13cd';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 只拦截 /api/submit 请求
  if (url.pathname === '/2026/api/submit' && event.request.method === 'POST') {
    event.respondWith(handleSubmit(event.request));
  }
});

async function handleSubmit(request) {
  try {
    const body = await request.json();

    const wecomBody = {
      msgtype: 'markdown',
      markdown: {
        content: `## 🆕 新客户咨询\n> 姓名：<font color="info">${body.name || '未填写'}</font>\n> 手机：<font color="info">${body.phone || '未填写'}</font>\n> 公司：<font color="info">${body.company || '未填写'}</font>\n> 需求：${body.needs || '未填写'}\n> 时间：${body.timestamp || ''}`
      }
    };

    const resp = await fetch(WECOM_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wecomBody)
    });

    const result = await resp.json();

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}