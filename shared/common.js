/* ==========================================================================
   shared/common.js - ระบบบันทึกคะแนนและ AI Mentor (Updated)
   ========================================================================== */
const STORAGE_KEY = 'coolTechScores';
const MAX_SCORES = { pretest: 20, study: 10, activity: 20, posttest: 30 };
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

function generateChecksum(data) {
    try { return btoa(String(data) + "SECRET_KEY_BY_KRU_SUCHIN"); } catch (e) { return ''; }
}

function getAllScores() {
    const saved = localStorage.getItem(STORAGE_KEY);
    const checksum = localStorage.getItem("checksum");
    if (!saved) return structuredClone(defaultScores);
    if (!checksum || checksum !== generateChecksum(saved)) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("checksum");
        return structuredClone(defaultScores);
    }
    try { return JSON.parse(saved); } catch (e) { return structuredClone(defaultScores); }
}

function saveChapterScore(chId, type, score, max) {
    if (type === 'study') {
        if ((Date.now() - studyStartTime) < 180000) {
            alert("⚠️ ต้องศึกษาบทเรียนอย่างน้อย 3 นาทีครับ!");
            return;
        }
        let summary = prompt("💡 สรุปใจความสำคัญของบทเรียนนี้มา 1 ประโยค:");
        if (!summary || summary.trim().length < 10) {
            alert("❌ กรุณาสรุปบทเรียนให้ชัดเจนก่อนบันทึกครับ");
            return;
        }
    }

    const scores = getAllScores();
    const chKey = `chapter${chId}`;
    if (!scores[chKey]) return;

    scores[chKey][type] = Math.max(0, Math.min(Number(score) || 0, Number(max || 9999)));
    scores[chKey].total = (scores[chKey].pretest + scores[chKey].study + scores[chKey].activity + scores[chKey].posttest);
    scores[chKey].completed = (scores[chKey].total >= 60);

    const dataString = JSON.stringify(scores);
    localStorage.setItem(STORAGE_KEY, dataString);
    localStorage.setItem("checksum", generateChecksum(dataString));
    alert("✅ บันทึกคะแนนสำเร็จ!");
    if (typeof updateDashboard === 'function') updateDashboard();
}

function updateDashboard() {
    const scores = getAllScores();
    let totalPoints = 0, completedCount = 0;
    Object.keys(scores).forEach(key => {
        totalPoints += scores[key].total || 0;
        if (scores[key].completed) completedCount++;
    });

    if (document.getElementById('globalTotalPoints')) document.getElementById('globalTotalPoints').innerText = totalPoints;
    if (document.getElementById('globalCompletedChapters')) document.getElementById('globalCompletedChapters').innerText = completedCount;
    
    let stars = totalPoints >= 576 ? '⭐⭐⭐⭐⭐' : totalPoints >= 432 ? '⭐⭐⭐⭐' : totalPoints >= 288 ? '⭐⭐⭐' : totalPoints >= 144 ? '⭐⭐' : totalPoints >= 72 ? '⭐' : 'ไม่มีอันดับ';
    if (document.getElementById('globalStarRank')) document.getElementById('globalStarRank').innerText = stars;
}

/* AI Mentor Handling */
function initAiMentor() {
    if (document.querySelector('.ai-mentor-btn')) return;
    const btn = document.createElement('div');
    btn.className = 'ai-mentor-btn';
    btn.innerHTML = '<img src="images/fridge-logo.png" alt="พี่ตู้เย็น" style="width:100%;height:100%;border-radius:50%;">';
    btn.onclick = () => openAiModal();
    document.body.appendChild(btn);
}

function openAiModal() {
    const modal = document.getElementById('aiChatModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeAiModal() {
    const modal = document.getElementById('aiChatModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const history = document.getElementById('chatHistory');
    if (!input || !input.value.trim()) return;
    history.innerHTML += `<div><strong>คุณ:</strong> ${input.value}</div>`;
    input.value = '';
    setTimeout(() => {
        history.innerHTML += `<div><strong>AI Mentor:</strong> ระบบกำลังประมวลผลคำตอบ...</div>`;
        history.scrollTop = history.scrollHeight;
    }, 700);
}

document.addEventListener('DOMContentLoaded', () => {
    initAiMentor();
    if (typeof updateDashboard === 'function') updateDashboard();
});

window.getAllScores = getAllScores;
window.saveChapterScore = saveChapterScore;
window.updateDashboard = updateDashboard;
window.openAiModal = openAiModal;
window.closeAiModal = closeAiModal;
window.sendChatMessage = sendChatMessage;

function injectAiMentorElements() {
    // ป้องกันการสร้างซ้ำ
    if (document.getElementById('aiChatModal')) return;

    // สร้าง Modal HTML
    const modalHtml = `
    <div id="aiChatModal" class="ai-modal">
        <div class="ai-modal-content">
            <span class="ai-modal-close" onclick="closeAiModal()">&times;</span>
            <h3 style="color:#38bdf8; margin-bottom:10px;">🤖 พี่ตู้เย็น</h3>
            <div id="chatHistory" style="flex-grow:1; overflow-y:auto; color:#fff; background:rgba(0,0,0,0.2); padding:10px; border-radius:5px;">
                <div>พี่ตู้เย็น: มีปัญหาเรื่องระบบทำความเย็นหรือบทเรียนส่วนไหน ถามพี่ตู้เย็นได้เลยนะ เดี๋ยวพี่ช่วยสรุปให้ครับ!</div>
            </div>
            <div style="display:flex; gap:5px; margin-top:10px;">
                <input type="text" id="chatInput" style="flex-grow:1; padding:10px; border-radius:5px; border:none;" placeholder="พิมพ์ข้อความ...">
                <button onclick="sendChatMessage()" style="padding:0 20px;">ส่ง</button>
            </div>
        </div>
    </div>
    <div class="ai-mentor-btn" onclick="openAiModal()">💬</div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}
// เพิ่มส่วนนี้เข้าไปใน HTML ที่ฉีดผ่าน injectAiMentorElements
const starterPrompts = `
    <div style="margin-top:10px; display:flex; flex-wrap:wrap; gap:5px;">
        <button onclick="setPrompt('พี่ตู้เย็นครับ ช่วยอธิบายการทำงานของคอมเพรสเซอร์ให้หน่อย')">คอมเพรสเซอร์คืออะไร?</button>
        <button onclick="setPrompt('ขั้นตอนการเติมสารทำความเย็นทำอย่างไร?')">การเติมสารทำความเย็น</button>
        <button onclick="setPrompt('ตู้เย็นไม่เย็นเกิดจากสาเหตุอะไรได้บ้าง?')">วิเคราะห์อาการเสีย</button>
    </div>`;

// เพิ่มฟังก์ชันสำหรับปุ่ม
window.setPrompt = function(text) {
    document.getElementById('chatInput').value = text;
};
// เรียกใช้ฟังก์ชันนี้ตอนโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    injectAiMentorElements();
    // ... ส่วนของ initAiMentor และอื่นๆ ที่เคยมีไว้เดิม
});
