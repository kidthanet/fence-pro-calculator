"use client";

import { useState, useEffect } from 'react';
import { areaToSqMeters, getPerimeterFromArea, calculateFenceProject } from '@/lib/calculations';
import FenceVisualizer from '@/components/FenceVisualizer';
import WireComparison from '@/components/WireComparison';

export default function FenceCalculatorPage() {
  const [calcMode, setCalcMode] = useState('dimension');
  
  // ค่าเริ่มต้นเป็น 0 ทั้งหมดตามที่คุณเอ๋ต้องการ
  const [inputs, setInputs] = useState({
    width: 0, 
    length: 0, 
    rai: 0, 
    ngan: 0, 
    wa: 0,
    layers: 4, 
    postSpacing: 2.5, 
    rollLength: 50,    
    pricePerRoll: 510, 
    pricePerPost: 150
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    // ดัก NaN เพื่อความปลอดภัย
    const w = parseFloat(inputs.width) || 0;
    const l = parseFloat(inputs.length) || 0;
    const r = parseFloat(inputs.rai) || 0;
    const n = parseFloat(inputs.ngan) || 0;
    const wa = parseFloat(inputs.wa) || 0;

    let currentPerimeter = 0;
    if (calcMode === 'dimension') {
      currentPerimeter = (w + l) * 2;
    } else {
      const sqMeters = areaToSqMeters(r, n, wa);
      currentPerimeter = getPerimeterFromArea(sqMeters);
    }

    const report = calculateFenceProject({
      perimeter: currentPerimeter,
      layers: Number(inputs.layers) || 0,
      postSpacing: Number(inputs.postSpacing) || 0,
      rollLength: Number(inputs.rollLength) || 50,
      pricePerRoll: Number(inputs.pricePerRoll) || 0,
      pricePerPost: Number(inputs.pricePerPost) || 0
    });

    const uClipPerPost = Number(inputs.layers) || 0;
    const totalUClips = (report.totalPosts || 0) * uClipPerPost;
    const uClipCost = totalUClips * 5; 

    setResults({
      ...report,
      perimeter: currentPerimeter, // ส่งค่านี้ไปให้ WireComparison เพื่อให้ราคาขยับเมื่อเกิน 50 เมตร
      totalUClips,
      uClipCost,
      totalBudget: (report.totalBudget || 0) + uClipCost 
    });
  }, [inputs, calcMode]);

  const handleRollChange = (e) => {
    const length = e.target.value;
    const price = (length === "100") ? 520 : 510;
    setInputs(prev => ({ ...prev, rollLength: length, pricePerRoll: price }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black text-blue-900 mb-3 tracking-tight uppercase">โปรแกรมคำนวณวัสดุล้อมรั้วมืออาชีพ</h1>
          <p className="text-slate-600 text-lg italic text-blue-600 font-bold">PK Group</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 space-y-6">
            {/* 1. ขนาดที่ดิน */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-5 flex items-center">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
                ระบุขนาดพื้นที่ดิน
              </h2>
              <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button onClick={() => setCalcMode('dimension')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${calcMode === 'dimension' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>ระบุกว้าง x ยาว (เมตร)</button>
                <button onClick={() => setCalcMode('area')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${calcMode === 'area' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>ระบุ ไร่ - งาน - วา</button>
              </div>

              {calcMode === 'dimension' ? (
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <input type="number" name="width" value={inputs.width} onChange={handleChange} className="w-full border rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    <p className="text-[10px] text-slate-400 ml-2 font-medium">* ความกว้างที่ดิน (เมตร)</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="length" value={inputs.length} onChange={handleChange} className="w-full border rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    <p className="text-[10px] text-slate-400 ml-2 font-medium">* ความยาวที่ดิน (เมตร)</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <input type="number" name="rai" value={inputs.rai} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    <p className="text-[10px] text-slate-400 text-center font-medium">* จำนวนไร่</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="ngan" value={inputs.ngan} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    <p className="text-[10px] text-slate-400 text-center font-medium">* จำนวนงาน</p>
                  </div>
                  <div className="space-y-1">
                    <input type="number" name="wa" value={inputs.wa} onChange={handleChange} className="w-full border rounded-xl p-3.5 text-center outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                    <p className="text-[10px] text-slate-400 text-center font-medium">* จำนวนตารางวา</p>
                  </div>
                </div>
              )}
            </section>

            {/* 2. ตั้งค่าวัสดุ */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold mb-5 flex items-center">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
                ตั้งค่าลวดหนามและเสา
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <select name="layers" value={inputs.layers} onChange={handleChange} className="w-full border rounded-xl p-3.5 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                    {[3,4,5,6,7,8].map(l => <option key={l} value={l}>{l} ชั้น</option>)}
                  </select>
                  <p className="text-[10px] text-slate-400 ml-2 font-medium">* จำนวนเส้นลวดแนวนอน</p>
                </div>
                <div className="space-y-1">
                  <input type="number" step="0.1" name="postSpacing" value={inputs.postSpacing} onChange={handleChange} className="w-full border rounded-xl p-3.5 outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-[10px] text-slate-400 ml-2 font-medium">* ระยะห่างเสา (เมตร)</p>
                </div>
                <div className="space-y-1">
                  <select name="rollLength" value={inputs.rollLength} onChange={handleRollChange} className="w-full border rounded-xl p-3.5 bg-white font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="50">เบอร์ 12 (50 ม.)</option>
                    <option value="100">เบอร์ 14 (100 ม.)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 ml-2 font-medium">* ความยาวลวดต่อม้วน</p>
                </div>
              </div>
            </section>

            {/* 3. ราคาวัสดุ */}
            <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-inner">
              <h2 className="text-xl font-bold text-blue-900 mb-5 flex items-center">
                <span className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center mr-3 text-sm">3</span>
                ตั้งค่าราคาวัสดุ (บาท)
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <input type="number" name="pricePerRoll" value={inputs.pricePerRoll} onChange={handleChange} className="w-full border-blue-200 rounded-xl p-3.5 text-blue-900 font-bold bg-white outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-[10px] text-blue-400 ml-2 font-medium">* ราคาลวดหนาม/ม้วน</p>
                </div>
                <div className="space-y-1">
                  <input type="number" name="pricePerPost" value={inputs.pricePerPost} onChange={handleChange} className="w-full border-blue-200 rounded-xl p-3.5 text-blue-900 font-bold bg-white outline-none focus:ring-2 focus:ring-blue-500" />
                  <p className="text-[10px] text-blue-400 ml-2 font-medium">* ราคาเสารั้ว/ต้น</p>
                </div>
              </div>
            </section>
          </div>

          {/* สรุปผลลัพธ์ */}
          <div className="lg:col-span-5">
            <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-8 border-4 border-slate-800">
              <h2 className="text-2xl font-black text-blue-400 mb-6 uppercase tracking-tighter">รายการวัสดุ</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">จำนวนเสา:</span>
                  <span className="text-2xl font-bold text-white">{results?.totalPosts || 0} ต้น</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">ลวดหนาม:</span>
                  <span className="text-2xl font-bold text-orange-400">{results?.totalRolls || 0} ม้วน</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">กิ๊บตัว U (2.5"):</span>
                  <span className="text-2xl font-bold text-orange-400">{results?.totalUClips || 0} ตัว</span>
                </div>
                
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mt-6 shadow-inner">
                   <p className="text-xs text-blue-400 font-bold mb-1 uppercase tracking-widest">งบประมาณรวม</p>
                   <p className="text-5xl font-black text-green-400">฿{(results?.totalBudget || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* ภาพจำลองพื้นดิน */}
              <FenceVisualizer 
                width={String(parseFloat(inputs.width) || 0)} 
                length={String(parseFloat(inputs.length) || 0)} 
              />
              
              {/* ส่งค่า perimeter ไปเช็คเงื่อนไขราคาตาข่ายแรงดึง */}
              <WireComparison totalPerimeter={results?.perimeter || 0} />

              {/* ส่วนปุ่มกด 2 ปุ่ม */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <a 
                  href="https://www.pkgroupth.com/shop/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-blue-700 hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 uppercase tracking-wider text-[11px]"
                >
                  ดูสินค้าเพิ่มเติม
                </a>
                
                <a 
                  href="https://line.me/ti/p/~@pkgroup" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 uppercase tracking-wider text-[11px]"
                >
                  <svg 
                    className="w-4 h-4 mr-2" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738s-12 4.369-12 9.738c0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.183.592.245.312.161.8.079 1.112l-.353 1.45c-.107.443-.513 1.734 2.212.946 2.725-.788 14.671-8.636 14.671-13.708l.172-.001z"/>
                  </svg>
                  ติดต่อฝ่ายขาย
                </a>
              </div>

            </section>
          </div>

        </div>
      </div>
    </main>
  );
}