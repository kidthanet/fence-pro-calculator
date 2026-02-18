import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, phone, perimeter, budget } = data;

    // ข้อความที่จะแจ้งเตือนใน LINE
    const message = `
🌟 มี Lead ใหม่จากเครื่องมือคำนวณ!
👤 ชื่อลูกค้า: ${name || 'ไม่ระบุชื่อ'}
📞 เบอร์ติดต่อ: ${phone}
📏 พื้นที่รั้ว: ${perimeter.toLocaleString()} เมตร
💰 งบประมาณวัสดุ: ฿${budget.toLocaleString()}
--------------------------
เข้าดูรายละเอียดได้ในระบบจัดการ Lead
`.trim();

    // *** นำ Token ที่ได้จาก LINE Notify มาใส่ที่นี่ ***
    const LINE_TOKEN = 'YOUR_LINE_NOTIFY_TOKEN_HERE';

    const response = await fetch('https://notify-api.line.me/api/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${LINE_TOKEN}`,
      },
      body: new URLSearchParams({ message }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}