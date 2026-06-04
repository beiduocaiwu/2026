// Cloudflare Pages Function - 企业微信消息代理
// 放置路径: 2026/functions/api/submit.js
// 部署后访问: https://2026.1174614459.workers.dev/api/submit

export async function onRequestPost(context) {
  const WECOM_WEBHOOK = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=cca569a2-0f10-48a9-beb7-37312dba13cd';

  try {
    const data = await context.request.json();
    const ts = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    const markdown = [
      '## 新客户咨询',
      `> 姓名：<font color="info">${data.name || ''}</font>`,
      `> 手机：<font color="info">${data.phone || ''}</font>`,
      `> 公司：<font color="info">${data.company || ''}</font>`,
      `> 服务：<font color="info">${data.service || ''}</font>`,
      `> 需求：${data.needs || ''}`,
      `> 时间：${ts}`,
    ].join('\n');

    await fetch(WECOM_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msgtype: 'markdown', markdown: { content: markdown } }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
