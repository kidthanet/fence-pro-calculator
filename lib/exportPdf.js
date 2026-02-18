import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { sarabunBase64 } from './fontData';

/**
 * ฟังก์ชันสร้างใบเสนอราคา PDF (ฉบับสมบูรณ์ที่สุด)
 * แก้ไขปัญหา TypeError: doc.autoTable is not a function
 * รองรับภาษาไทย 100% และแสดงข้อมูล Lead (ชื่อ/เบอร์โทร)
 */
export const generateQuotation = (data) => {
  if (!data) {
    alert("ไม่พบข้อมูลสำหรับการประเมินราคา");
    return;
  }

  const doc = new jsPDF();
  const fontName = "Sarabun";

  // 1. ลงทะเบียนฟอนต์ภาษาไทยจาก Base64
  try {
    if (sarabunBase64) {
      doc.addFileToVFS(`${fontName}-Regular.ttf`, sarabunBase64);
      doc.addFont(`${fontName}-Regular.ttf`, fontName, "normal");
      doc.setFont(fontName);
    }
  } catch (error) {
    console.error("Font loading error:", error);
  }

  // 2. ส่วนหัวเอกสาร (Header)
  doc.setFontSize(22);
  doc.setTextColor(30, 58, 138); // Blue-900
  doc.text("ใบประเมินราคาวัสดุล้อมรั้ว", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("ประมาณการโดยโปรแกรม Fence Pro Calculator", 105, 27, { align: "center" });
  doc.text("สนับสนุนโดย PK Group (www.pkgroupth.com)", 105, 32, { align: "center" });

  // เส้นคั่นหัวกระดาษ
  doc.setDrawColor(200);
  doc.line(15, 38, 195, 38);

  // 3. ข้อมูลลูกค้า (Lead Information)
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("ข้อมูลผู้ติดต่อและโครงการ:", 15, 48);
  
  doc.setFontSize(10);
  doc.text(`ชื่อลูกค้า: ${data.customer?.name || 'ไม่ระบุ'}`, 20, 55);
  doc.text(`เบอร์โทรศัพท์: ${data.customer?.phone || 'ไม่ระบุ'}`, 20, 61);
  doc.text(`วันที่ประเมิน: ${new Date().toLocaleDateString('th-TH')}`, 20, 67);

  // ข้อมูลทางเทคนิค
  doc.text(`ความยาวรั้วรวม: ${data.perimeter.toLocaleString()} เมตร`, 120, 55);
  doc.text(`จำนวนชั้นลวด: ${data.layers} ชั้น`, 120, 61);
  doc.text(`ระยะห่างเสา: ${data.postSpacing} เมตร`, 120, 67);

  // 4. ตารางรายการวัสดุ (ใช้ฟังก์ชัน autoTable โดยตรงเพื่อเลี่ยง Error)
  autoTable(doc, {
    startY: 75,
    head: [['รายการวัสดุ', 'จำนวน', 'หน่วย', 'ราคา/หน่วย', 'รวมเงิน (บาท)']],
    body: [
      [
        'ลวดหนามคุณภาพ (High-Tensile Wire)', 
        data.totalRolls, 
        'ม้วน', 
        (data.wireCost / data.totalRolls).toLocaleString(), 
        data.wireCost.toLocaleString()
      ],
      [
        'เสารั้วลวดหนาม (Fence Posts)', 
        data.totalPosts, 
        'ต้น', 
        (data.postCost / data.totalPosts).toLocaleString(), 
        data.postCost.toLocaleString()
      ]
    ],
    foot: [
      [
        { content: 'งบประมาณรวมทั้งสิ้น (โดยประมาณ)', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `฿${data.totalBudget.toLocaleString()}`, styles: { halign: 'left', fontStyle: 'bold', textColor: [22, 163, 74] } }
      ]
    ],
    styles: { 
      font: fontName, 
      fontStyle: 'normal',
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: { 
      fillColor: [30, 58, 138], 
      textColor: [255, 255, 255],
      halign: 'center'
    },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    }
  });

  // 5. หมายเหตุและช่องทางติดต่อ
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("หมายเหตุ:", 15, finalY);
  doc.setFontSize(9);
  doc.text("• ข้อมูลนี้เป็นการประมาณการเบื้องต้นเท่านั้น ไม่รวมค่าแรงและค่าขนส่ง", 15, finalY + 6);
  doc.text("• กรุณาตรวจสอบสต็อกสินค้าและราคาปัจจุบันได้ที่ Line: @pkgroup", 15, finalY + 11);

  // 6. บันทึกไฟล์
  doc.save(`Quotation-PKGroup-${Date.now()}.pdf`);
};