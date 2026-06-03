// 企业微信 Webhook 代理
const WEBHOOK_URL = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=cca569a2-0f10-48a9-beb7-37312dba13cd';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, company, needs } = req.body;
    if (!name || !phone) return res.status(400).json({ error: '姓名和电话为必填项' });

    const ts = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const resp = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: { content: `## 新客户留资\n**时间**：${ts}\n**姓名**：${name}\n**电话**：${phone}\n**公司**：${company || '未填写'}\n**需求**：${needs || '未填写'}\n\n[查看网站](https://beiduocaiwu.github.io/2026/)` }
      })
    });
    const r = await resp.json();
    return res.status(r.errcode === 0 ? 200 : 500).json(r.errcode === 0 ? { success: true } : { error: '发送失败', details: r });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
