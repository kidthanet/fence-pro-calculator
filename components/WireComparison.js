"use client";

import React from 'react';

export default function WireComparison({ totalPerimeter }) {
  // Logic ตามสั่ง: 
  // 1. ถ้ายังไม่กรอก (0) หรือกรอกแล้วแต่ไม่เกิน 50 เมตร -> ให้ถือว่าใช้ 1 ม้วน (ราคายืนพื้น)
  // 2. ถ้าพื้นที่รอบรูปเกิน 50 เมตร (เงื่อนไขเปลี่ยนที่ 51 เมตร หรือ 99 เมตร) -> ให้ปัดขึ้นเป็นจำนวนม้วนจริง
  const currentPerimeter = parseFloat(totalPerimeter) || 0;
  const rollsNeeded = (currentPerimeter <= 50) ? 1 : Math.ceil(currentPerimeter / 50);

  const tensileNetOptions = [
    { h: "1.0 ม.", model: "รุ่น 7 ช่อง", pricePerRoll: 2100, desc: "ความสูงมาตรฐาน สำหรับกั้นสัตว์เล็ก" },
    { h: "1.2 ม.", model: "รุ่น 9 ช่อง", pricePerRoll: 2500, desc: "ความสูงยอดนิยม ป้องกันสุนัขและสัตว์ทั่วไป" },
    { h: "1.5 ม.", model: "รุ่น 10 ช่อง", pricePerRoll: 2800, desc: "ความสูงพิเศษ ป้องกันการกระโดด" },
    { h: "2.0 ม.", model: "รุ่น 12 ช่อง", pricePerRoll: 3500, desc: "ความสูงสูงสุด เพื่อความปลอดภัยระดับสูงสุด" }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        ทางเลือกอื่น: ตาข่ายแรงดึงสูง (ม้วนละ 50 ม.)
      </h3>
      
      <div className="space-y-3">
        {tensileNetOptions.map((item, index) => {
          const totalPrice = rollsNeeded * item.pricePerRoll;
          
          return (
            <div key={index} className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-blue-400 font-black text-lg mr-2">สูง {item.h}</span>
                    <span className="bg-slate-700 text-[10px] px-2 py-0.5 rounded text-slate-300">
                      {item.model}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                </div>
                <div className="text-right">
                  <span className="block text-green-400 font-bold text-xl">
                    ฿{totalPrice.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-slate-600 italic">
                    {rollsNeeded > 1 ? `คำนวณจาก ${rollsNeeded} ม้วน` : "ราคายืนพื้น/ม้วน"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-slate-800/60 rounded-xl border border-white/5">
        <p className="text-[10px] text-slate-500 leading-relaxed text-center">
          * ตาข่ายแรงดึงสูงมีความทนทานกว่าลวดหนามทั่วไป 3-5 เท่า และติดตั้งง่ายกว่า
        </p>
      </div>
    </div>
  );
}