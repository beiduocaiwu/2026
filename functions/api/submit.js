export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (context.request.method !== 'POST') {
    return new Response('Not Found', { status: 404 });
  }

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

    await fetch('https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=cca569a2-0f10-48a9-beb7-37312dba13cd', {
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
