// ฟังก์ชันแปลง ไร่-งาน-วา เป็นตารางเมตร
export const areaToSqMeters = (rai = 0, ngan = 0, wa = 0) => {
  return (Number(rai) * 1600) + (Number(ngan) * 400) + (Number(wa) * 4);
};

// ฟังก์ชันหาเส้นรอบรูปจากพื้นที่ (สมมติทรงสี่เหลี่ยมจัตุรัสเพื่อหาค่าประเมิน)
export const getPerimeterFromArea = (sqMeters) => {
  return Math.sqrt(sqMeters) * 4;
};

// ฟังก์ชันคำนวณวัสดุและงบประมาณ
export const calculateFenceProject = ({
  perimeter,
  layers,
  postSpacing,
  rollLength,
  pricePerRoll,
  pricePerPost
}) => {
  const wireNeeded = (perimeter * layers) * 1.1; // เผื่อ 10%
  const totalPosts = Math.ceil(perimeter / postSpacing) + 1; // +1 สำหรับต้นปิดท้าย
  const totalRolls = Math.ceil(wireNeeded / rollLength);
  
  const wireCost = totalRolls * pricePerRoll;
  const postCost = totalPosts * pricePerPost;

  return {
    perimeter: Math.round(perimeter),
    totalPosts,
    totalRolls,
    wireNeeded: Math.round(wireNeeded),
    wireCost,
    postCost,
    totalBudget: wireCost + postCost
  };
};