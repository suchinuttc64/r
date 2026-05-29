/* ==========================================================================
   shared/common.js - ระบบบันทึกคะแนนและ AI Mentor (Cleaned & Optimized)
   ========================================================================== */
const STORAGE_KEY = 'coolTechScores';
let studyStartTime = Date.now();

// --- 1. ระบบบันทึกคะแนน ---
function getAllScores() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone({
        chapter1: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
        chapter2: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
        chapter3: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
        chapter4: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
        chapter5: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
        chapter6: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
        chapter7: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
        chapter8: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false },
        chapter9: { pretest: 0, study: 0, activity: 0, posttest: 0, total: 0, completed: false }
    });
}

function saveChapterScore(chId, type, score, max) {
    if (type === 'study') {
        if ((Date.now() - studyStartTime) < 180000) {
            alert("⚠️ ต้องศึกษาบทเรียนอย่างน้อย 3 นาทีครับ!");
            return;
        }
        let summary = prompt("💡 พี่ตู้เย็น: สรุปใจความสำคัญของบทเรียนนี้มาครับ:");
        if (!summary || summary.trim().length < 10) {
            alert("❌ สรุปสั้นไปหน่อยครับ พี่ตู้เย็นขอรายละเอียดเพิ่มอีกนิดนะ!");
            return;
        }
    }

    const scores = getAllScores();
    const chKey = `chapter${chId}`;
    scores[chKey][type] = Math.min(Number(score), Number(max));
    scores[chKey].total = (scores[chKey].pretest + scores[chKey].study + scores[chKey].activity + scores[chKey].posttest);
    scores[chKey].completed = (scores[chKey].total >= 60);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    alert("✅ บันทึกคะแนนสำเร็จ!");
    if (typeof updateDashboard === 'function') updateDashboard();
}

// --- 2. ระบบ AI Mentor (ฉีดโค้ดอัตโนมัติ) ---
function injectAiMentor() {
    if (document.getElementById('aiChatModal')) return;
// สร้างปุ่มใหม่ที่ดึงรูปจาก images/fridge-logo.jpg
    const aiBtn = document.createElement('div');
    aiBtn.className = 'ai-mentor-btn';
    aiBtn.onclick = () => openAiModal();
    aiBtn.innerHTML = '<img src="images/fridge-logo.jpg" alt="ถามพี่ตู้เย็น">';
    document.body.appendChild(aiBtn);
    const modalHtml = `
    <div id="aiChatModal" class="ai-modal">
        <div class="ai-modal-content">
            <span class="ai-modal-close" onclick="closeAiModal()">&times;</span>
            <h3 style="color:#38bdf8; margin-bottom:10px;">🤖 ถามพี่ตู้เย็น</h3>
            <div id="chatHistory" style="flex-grow:1; overflow-y:auto; color:#fff; background:rgba(0,0,0,0.2); padding:10px; border-radius:5px;">
                <div>พี่ตู้เย็น: สวัสดีครับ! มีปัญหาเรื่องระบบทำความเย็นหรือบทเรียนส่วนไหน ถามพี่ได้เลยนะน้องๆ!</div>
            </div>
            <div style="margin:10px 0;">
                <button onclick="setPrompt('คอมเพรสเซอร์คืออะไร?')">คอมเพรสเซอร์คืออะไร?</button>
                <button onclick="setPrompt('การเติมสารทำความเย็น')">การเติมสารทำความเย็น</button>
            </div>
            <div style="display:flex; gap:5px;">
                <input type="text" id="chatInput" style="flex-grow:1; padding:10px; border-radius:5px;">
                <button onclick="sendChatMessage()">ส่ง</button>
            </div>
        </div>
    </div>
    <div class="ai-mentor-btn" onclick="openAiModal()">
        <img src="images/fridge-logo.png" alt="พี่ตู้เย็น" style="width:100%; height:100%; border-radius:50%;">
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

window.openAiModal = () => { document.getElementById('aiChatModal').style.display = 'flex'; };
window.closeAiModal = () => { document.getElementById('aiChatModal').style.display = 'none'; };
window.setPrompt = (txt) => { document.getElementById('chatInput').value = txt; };
window.sendChatMessage = () => {
    const input = document.getElementById('chatInput');
    if(!input.value) return;
    document.getElementById('chatHistory').innerHTML += `<div><strong>คุณ:</strong> ${input.value}</div>`;
    input.value = '';
};

// เริ่มต้นระบบ
document.addEventListener('DOMContentLoaded', () => {
    injectAiMentor();
    if (typeof updateDashboard === 'function') updateDashboard();
});
