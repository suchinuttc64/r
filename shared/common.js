/* ==========================================================================
   shared/common.js - ระบบบันทึกคะแนนและ AI Mentor (เชื่อมต่อ Gemini API)
   ========================================================================== */
const STORAGE_KEY = 'coolTechScores';
const API_KEY = 'ใส่_API_KEY_ของอาจารย์ที่นี่'; // <--- ใส่ API Key ของอาจารย์ตรงนี้ครับ
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

    const modalHtml = `
    <div class="ai-mentor-btn" onclick="openAiModal()">
        <img src="images/fridge-logo.png" alt="พี่ตู้เย็น" style="width:100%; height:100%; object-fit:cover;">
    </div>
    <div id="aiChatModal" class="ai-modal">
        <div class="ai-modal-content">
            <span class="ai-modal-close" onclick="closeAiModal()">&times;</span>
            <h3 style="color:#38bdf8; margin-bottom:10px; display:flex; align-items:center; gap:10px;">
                <img src="images/refrig.png" alt="พี่ตู้เย็น" style="width:30px; height:30px; border-radius:5px;"> 
                ถามพี่ตู้เย็น
            </h3>
            <div id="chatHistory" style="flex-grow:1; overflow-y:auto; color:#fff; background:rgba(0,0,0,0.2); padding:10px; border-radius:5px; margin-bottom:10px;">
                <div><strong>พี่ตู้เย็น:</strong> สวัสดีครับ! มีปัญหาเรื่องระบบทำความเย็น ถามพี่ได้เลยนะครับ!</div>
            </div>
            <div style="margin-bottom:10px;">
                <button onclick="setPrompt('คอมเพรสเซอร์คืออะไร?')">คอมเพรสเซอร์คืออะไร?</button>
                <button onclick="setPrompt('การเติมสารทำความเย็น')">การเติมสารทำความเย็น</button>
            </div>
            <div style="display:flex; gap:5px;">
                <input type="text" id="chatInput" style="flex-grow:1; padding:10px; border-radius:5px; border:none;">
                <button onclick="sendChatMessage()" style="padding:0 15px;">ส่ง</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// --- 3. ระบบแชท Gemini AI ---
window.openAiModal = () => { document.getElementById('aiChatModal').style.display = 'flex'; };
window.closeAiModal = () => { document.getElementById('aiChatModal').style.display = 'none'; };
window.setPrompt = (txt) => { document.getElementById('chatInput').value = txt; };

window.sendChatMessage = async () => {
    const input = document.getElementById('chatInput');
    const history = document.getElementById('chatHistory');
    if (!input.value.trim()) return;

    history.innerHTML += `<div><strong>คุณ:</strong> ${input.value}</div>`;
    const userMsg = input.value;
    input.value = '';
    history.scrollTop = history.scrollHeight;

    history.innerHTML += `<div id="loading"><strong>พี่ตู้เย็น:</strong> กำลังวิเคราะห์...</div>`;
    
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "คุณคือ 'พี่ตู้เย็น' ที่ปรึกษาด้านระบบทำความเย็น แผนกไฟฟ้ากำลัง วิทยาลัยเทคนิคอุตรดิตถ์ ตอบคำถามงานช่างอย่างเป็นกันเองและให้ความรู้ถูกต้อง: " + userMsg }] }]
            })
        });
        const data = await response.json();
        document.getElementById('loading').remove();
        history.innerHTML += `<div><strong>พี่ตู้เย็น:</strong> ${data.candidates[0].content.parts[0].text}</div>`;
    } catch (e) {
        document.getElementById('loading').innerHTML = "<strong>พี่ตู้เย็น:</strong> ขออภัยครับ ระบบขัดข้องเล็กน้อยครับ";
    }
    history.scrollTop = history.scrollHeight;
};

document.addEventListener('DOMContentLoaded', injectAiMentor);
