// shared/common.js
const STORAGE_KEY = 'coolTechScores';
const MAX_SCORES = { pretest: 20, study: 10, activity: 20, posttest: 30 };

// 👈 ตัวแปรสำหรับจับเวลา (ป้องกันการกดข้ามบทเรียน)
let studyStartTime = Date.now();

const defaultScores = {
    chapter1: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
    chapter2: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
    chapter3: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
    chapter4: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
    chapter5: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
    chapter6: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
    chapter7: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
    chapter8: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
    chapter9: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false }
};

// 🔒 ฟังก์ชันสร้าง Checksum ป้องกันการแก้ไขคะแนน
function generateChecksum(data) {
    return btoa(data + "SECRET_KEY_BY_KRU_SUCHIN");
}

// ดึงคะแนนทั้งหมด
function getAllScores() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const checksum = localStorage.getItem("checksum");

    if (!saved) return defaultScores;

    // ตรวจสอบความถูกต้องของข้อมูล (ถ้าถูกแก้ค่าใน LocalStorage ลายเซ็นจะผิดพลาด)
    if (checksum !== generateChecksum(saved)) {
        console.warn("⚠️ ตรวจพบการแก้ไขข้อมูลคะแนน! ระบบจะรีเซ็ตค่าเพื่อความปลอดภัย");
        localStorage.clear();
        return defaultScores;
    }
    
    return JSON.parse(saved);
}

// บันทึกคะแนนลง LocalStorage
function saveChapterScore(chId, type, score, max) {
    // 🔒 ระบบเช็คเวลาเรียน: ต้องใช้เวลาอย่างน้อย 3 นาที (180,000 มิลลิวินาที) ถึงจะบันทึกคะแนนการเรียนได้
    if (type === 'study') {
        let timeSpent = Date.now() - studyStartTime;
        if (timeSpent < 180000) {
            alert("⚠️ นักเรียนต้องอ่านสไลด์หรือดูวิดีโออย่างน้อย 3 นาที ก่อนทำการยืนยันการเรียนรู้ครับ!");
            return;
        }
        // บังคับให้สรุปบทเรียน
        let summary = prompt("💡 สรุปใจความสำคัญของบทเรียนนี้มา 1 ประโยค เพื่อยืนยันการเรียนรู้:");
        if (!summary || summary.length < 10) {
            alert("❌ กรุณาสรุปบทเรียนให้ชัดเจนก่อนบันทึกคะแนนครับ");
            return;
        }
    }

    const scores = getAllScores();
    const chKey = `chapter${chId}`;
    scores[chKey][type] = score;
    scores[chKey].total = scores[chKey].pretest + scores[chKey].study + scores[chKey].activity + scores[chKey].posttest;
    scores[chKey].completed = (scores[chKey].total >= 60); 
    
    // บันทึกพร้อมสร้าง Checksum กำกับไว้
    const dataString = JSON.stringify(scores);
    localStorage.setItem(STORAGE_KEY, dataString);
    localStorage.setItem("checksum", generateChecksum(dataString));

    alert("✅ บันทึกคะแนนสำเร็จ!");
    updateDashboard(); // อัปเดต UI หน้าหลัก
}

// อัปเดต Dashboard
function updateDashboard() {
    const scores = getAllScores();
    let totalPoints = 0;
    let completedCount = 0;

    Object.keys(scores).forEach(key => {
        totalPoints += scores[key].total;
        if (scores[key].completed) completedCount++;
    });

    if (document.getElementById('globalTotalPoints')) document.getElementById('globalTotalPoints').innerText = totalPoints;
    if (document.getElementById('globalCompletedChapters')) document.getElementById('globalCompletedChapters').innerText = completedCount;
    
    let stars = 'ไม่มีอันดับ';
    if (totalPoints >= 576) stars = '⭐⭐⭐⭐⭐';
    else if (totalPoints >= 432) stars = '⭐⭐⭐⭐';
    else if (totalPoints >= 288) stars = '⭐⭐⭐';
    else if (totalPoints >= 144) stars = '⭐⭐';
    else if (totalPoints >= 72) stars = '⭐';
    if (document.getElementById('globalStarRank')) document.getElementById('globalStarRank').innerText = stars;

    // ส่วนเพิ่ม: ตรวจสอบและแสดงปุ่มสอบปลายภาคในหน้า Chapter ถ้ามี Element finalExamSection
    if (completedCount >= 9) {
        const finalBtn = document.getElementById('finalExamSection');
        if (finalBtn) finalBtn.style.display = "block";
    }
}

// --- พี่ตู้เย็น: ระบบพี่เลี้ยงประจำห้องแล็บ COOL TECH QUEST ---
// ฟังก์ชันนี้จะคอยตรวจสอบว่าปุ่มพี่ตู้เย็นถูกสร้างหรือยัง ถ้ายังให้สร้างให้โดยอัตโนมัติ
function initAiMentor() {
    if (!document.querySelector('.ai-mentor-btn')) {
        const btn = document.createElement('div');
        btn.className = 'ai-mentor-btn';
        btn.innerHTML = '🤖 ปรึกษาพี่ตู้เย็น';
        btn.onclick = function() {
            window.open('https://gemini.google.com/share/89a2551adc9e', '_blank'); // อย่าลืมแก้ URL ตรงนี้ครับ!
        };
        document.body.appendChild(btn);
    }
}

// เรียกใช้เมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
document.addEventListener('DOMContentLoaded', initAiMentor);
