"use client";

import React from 'react';

/**
 * คอมโพเนนต์แสดงภาพจำลองรั้วแบบ Real-time
 * แก้ไขปัญหา NaN error โดยการ Sanitize ค่าทุกจุดก่อน Render ลง SVG Attribute
 */
export default function FenceVisualizer({ width, length }) {
  // 1. แปลงค่าที่รับมาให้เป็นตัวเลขที่ปลอดภัย (ถ้าไม่ใช่ตัวเลขให้เป็น 0)
  const safeWidth = Number(width) || 0;
  const safeLength = Number(length) || 0;

  // 2. กำหนดขนาดของ Canvas จำลอง (px)
  const viewBoxSize = 200;
  const padding = 20;
  const drawArea = viewBoxSize - (padding * 2);

  // 3. คำนวณอัตราส่วนเพื่อให้รูปอยู่ตรงกลางและไม่หลุดขอบ
  const maxDim = Math.max(safeWidth, safeLength) || 1; // กันหารด้วย 0
  const scale = drawArea / maxDim;

  const rectWidth = safeWidth * scale;
  const rectHeight = safeLength * scale;

  // 4. จัดให้อยู่กึ่งกลาง
  const x = (viewBoxSize - rectWidth) / 2;
  const y = (viewBoxSize - rectHeight) / 2;

  return (
    <div className="mt-8 bg-slate-800/50 rounded-3xl p-6 border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          ภาพจำลองพื้นที่ดิน (Top View)
        </h3>
        <div className="text-[10px] text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md">
          {safeWidth.toLocaleString()} x {safeLength.toLocaleString()} ม.
        </div>
      </div>

      <div className="relative aspect-square w-full flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
        {/* เริ่มต้นการวาด SVG */}
        <svg
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          className="w-full h-full drop-shadow-2xl"
        >
          {/* พื้นที่ดิน (พื้นหลัง) */}
          <rect
            x={String(x)}
            y={String(y)}
            width={String(rectWidth)}
            height={String(rectHeight)}
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            rx="2"
          />

          {/* เส้นลวดหนาม (ขอบรั้ว) */}
          <rect
            x={String(x)}
            y={String(y)}
            width={String(rectWidth)}
            height={String(rectHeight)}
            fill="url(#grass-pattern)"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="4 2" // ทำให้ดูเหมือนแนวลวดหนาม
            rx="2"
            className="transition-all duration-500 ease-in-out"
          />

          {/* จุดเสาที่มุมทั้ง 4 */}
          {safeWidth > 0 && safeLength > 0 && (
            <>
              <circle cx={String(x)} cy={String(y)} r="3" fill="#fb923c" />
              <circle cx={String(x + rectWidth)} cy={String(y)} r="3" fill="#fb923c" />
              <circle cx={String(x)} cy={String(y + rectHeight)} r="3" fill="#fb923c" />
              <circle cx={String(x + rectWidth)} cy={String(y + rectHeight)} r="3" fill="#fb923c" />
            </>
          )}

          {/* Patterns สำหรับความสวยงาม */}
          <defs>
            <pattern id="grass-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#0f172a" />
              <circle cx="5" cy="5" r="0.5" fill="#1e293b" />
            </pattern>
          </defs>
        </svg>

        {/* ถ้าไม่มีข้อมูลให้โชว์ข้อความบอกผู้ใช้ */}
        {safeWidth === 0 && safeLength === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-600 text-[10px] italic">รอระบุขนาดพื้นที่...</p>
          </div>
        )}
      </div>
      
      <p className="text-[9px] text-slate-600 mt-3 text-center uppercase tracking-tighter">
        สัดส่วนในภาพอาจมีการปรับเพื่อการแสดงผลที่ชัดเจน
      </p>
    </div>
  );
}