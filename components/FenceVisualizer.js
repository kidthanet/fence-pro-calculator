"use client";

export default function FenceVisualizer({ width, length, postSpacing }) {
  // สเกลภาพให้พอดีกับหน้าจอ (สมมติ max ที่ 200px)
  const maxView = 200;
  const ratio = Math.min(maxView / width, maxView / length);
  const svgW = width * ratio;
  const svgH = length * ratio;

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 flex flex-col items-center">
      <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">Preview: ตำแหน่งเสาและแนวรั้ว</p>
      <svg width={svgW + 20} height={svgH + 20} viewBox={`-10 -10 ${svgW + 20} ${svgH + 20}`}>
        {/* แนวรั้ว */}
        <rect x="0" y="0" width={svgW} height={svgH} fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
        {/* จุดเสา (ตัวอย่างเสามุม) */}
        <circle cx="0" cy="0" r="4" fill="#ef4444" />
        <circle cx={svgW} cy="0" r="4" fill="#ef4444" />
        <circle cx="0" cy={svgH} r="4" fill="#ef4444" />
        <circle cx={svgW} cy={svgH} r="4" fill="#ef4444" />
      </svg>
      <p className="text-[10px] text-gray-400 mt-2">* ภาพจำลองสัดส่วนโดยประมาณ</p>
    </div>
  );
}