// shared/common.js (ปรับปรุง)
const STORAGE_KEY = 'coolTechScores';
const MAX_SCORES = { pretest: 20, study: 10, activity: 20, posttest: 30 };

// ป้องกันการกดข้ามบทเรียน (เวลาเริ่มต้น)
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

// Simple checksum (ไม่ปลอดภัยระดับ production แต่ลดการแก้ไขแบบง่าย)
function generateChecksum(data) {
  try {
    return btoa(String(data) + "SECRET_KEY_BY_KRU_SUCHIN");
  } catch (e) {
    return '';
  }
}

// ดึงคะแนนทั้งหมด
function getAllScores() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const checksum = localStorage.getItem("checksum");

  if (!saved) return structuredClone(defaultScores);

  if (!checksum || checksum !== generateChecksum(saved)) {
    console.warn("⚠️ ตรวจพบการแก้ไขข้อมูลคะแนน! ระบบจะรีเซ็ตค่าเพื่อความปลอดภัย");
    // อย่าเรียก localStorage.clear() เพราะอาจลบข้อมูลอื่น ๆ ของผู้ใช้
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("checksum");
    return structuredClone(defaultScores);
  }

  try {
    return JSON.parse(saved);
  } catch (e) {
    console.warn("⚠️ ข้อมูลคะแนนไม่ถูกต้อง ไฟล์จะถูกรีเซ็ต");
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("checksum");
    return structuredClone(defaultScores);
  }
}

// บันทึกคะแนนลง LocalStorage
function saveChapterScore(chId, type, score, max) {
  // เวลาเรียนขั้นต่ำ 3 นาที (180,000ms) สำหรับ type 'study'
  if (type === 'study') {
    let timeSpent = Date.now() - studyStartTime;
    if (timeSpent < 180000) {
      alert("⚠️ นักเรียนต้องอ่านสไลด์หรือดูวิดีโออย่างน้อย 3 นาที ก่อนทำการยืนยันการเรียนรู้ครับ!");
      return;
    }
    let summary = prompt("💡 สรุปใจความสำคัญของบทเรียนนี้มา 1 ประโยค เพื่อยืนยันการเรียนรู้:");
    if (!summary || summary.trim().length < 10) {
      alert("❌ กรุณาสรุปบทเรียนให้ชัดเจนก่อนบันทึกคะแนนครับ");
      return;
    }
  }

  const scores = getAllScores();
  const chKey = `chapter${chId}`;
  if (!scores[chKey]) {
    console.warn("chapter key not found:", chKey);
    return;
  }

  // sanitize numeric input
  const nScore = Number(score) || 0;
  scores[chKey][type] = Math.max(0, Math.min(nScore, Number(max || MAX_SCORES[type] || 9999)));

  // recalc total
  scores[chKey].total = (Number(scores[chKey].pretest) || 0) + (Number(scores[chKey].study) || 0) + (Number(scores[chKey].activity) || 0) + (Number(scores[chKey].posttest) || 0);

  // completed threshold (ปรับตามต้องการ)
  scores[chKey].completed = (scores[chKey].total >= 60);

  // save with checksum
  try {
    const dataString = JSON.stringify(scores);
    localStorage.setItem(STORAGE_KEY, dataString);
    localStorage.setItem("checksum", generateChecksum(dataString));
    alert("✅ บันทึกคะแนนสำเร็จ!");
    updateDashboard();
  } catch (e) {
    console.error("Failed to save scores:", e);
    alert("❌ เกิดข้อผิดพลาดในการบันทึกคะแนน โปรดลองอีกครั้ง");
  }
}

// อัปเดต Dashboard
function updateDashboard() {
  const scores = getAllScores();
  let totalPoints = 0;
  let completedCount = 0;

  Object.keys(scores).forEach(key => {
    totalPoints += Number(scores[key].total) || 0;
    if (scores[key].completed) completedCount++;
  });

  const elTotal = document.getElementById('globalTotalPoints');
  const elCompleted = document.getElementById('globalCompletedChapters');
  const elStar = document.getElementById('globalStarRank');

  if (elTotal) elTotal.innerText = totalPoints;
  if (elCompleted) elCompleted.innerText = completedCount;

  let stars = 'ไม่มีอันดับ';
  if (totalPoints >= 576) stars = '⭐⭐⭐⭐⭐';
  else if (totalPoints >= 432) stars = '⭐⭐⭐⭐';
  else if (totalPoints >= 288) stars = '⭐⭐⭐';
  else if (totalPoints >= 144) stars = '⭐⭐';
  else if (totalPoints >= 72) stars = '⭐';
  if (elStar) elStar.innerText = stars;

  // แสดงปุ่มสอบปลายภาคถ้ามี element และเรียนจบครบ
  if (completedCount >= 9) {
    const finalBtn = document.getElementById('finalExamSection');
    if (finalBtn) finalBtn.style.display = "block";
  }
}

/* ---------------------------------------------
   AI Mentor / floating helper (init + fallback)
   --------------------------------------------- */

// สร้างปุ่ม AI Mentor อัตโนมัติถ้าไม่พบ (ไม่ทับของเดิม)
function initAiMentor() {
  if (!document.querySelector('.ai-mentor-btn')) {
    const btn = document.createElement('div');
    btn.className = 'ai-mentor-btn';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'พี่ตู้เย็น - เปิด AI Mentor');
    btn.setAttribute('tabindex', '0');
    btn.style.cursor = 'pointer';

    const img = document.createElement('img');
    img.src = '/r/images/fridge-logo.png';
    img.alt = 'พี่ตู้เย็น';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    img.loading = 'lazy';

    btn.appendChild(img);

    // default behavior: เปิดลิงก์ share (คุณบอกให้แก้ URL เอง)
    btn.addEventListener('click', function () {
      window.open('https://gemini.google.com/share/89a2551adc9e', '_blank');
    });

    // keyboard support
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });

    document.body.appendChild(btn);
  }
}
document.addEventListener('DOMContentLoaded', initAiMentor);

/* ---------------------------------------------
   Modal, Chat handling, Accessibility & Security
   --------------------------------------------- */

const aiModal = typeof document !== 'undefined' ? document.getElementById('aiChatModal') : null;
const chatInput = typeof document !== 'undefined' ? document.getElementById('chatInput') : null;
const aiBtn = typeof document !== 'undefined' ? document.querySelector('.ai-mentor-btn') : null;

// Show modal (accessible)
function openAiModal(){
  if(!aiModal) return;
  aiModal.style.display = 'flex';
  aiModal.setAttribute('aria-hidden','false');
  aiModal.setAttribute('aria-modal','true');

  // simple focus management
  setTimeout(()=> {
    if (chatInput) chatInput.focus();
  }, 120);

  // prevent page scroll behind modal
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeAiModal(){
  if(!aiModal) return;
  aiModal.style.display = 'none';
  aiModal.setAttribute('aria-hidden','true');
  aiModal.setAttribute('aria-modal','false');

  // restore scroll
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';

  if (aiBtn) aiBtn.focus();
}

// allow keyboard open/close for existing aiBtn and any dynamically created one
if (aiBtn) {
  aiBtn.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openAiModal(); }
  });
}

// close modal on escape
document.addEventListener('keydown', (e)=>{
  if (e.key === 'Escape' && aiModal && aiModal.style.display === 'flex') closeAiModal();
});

// close modal when clicking outside content
if (aiModal) {
  aiModal.addEventListener('click', function(e){
    if (e.target === aiModal) closeAiModal();
  });
}

// Basic HTML escape to avoid injection when inserting user text
function escapeHtml(s){
  if (!s) return '';
  return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// Safe sendChatMessage (ใช้ DOM methods แทน innerHTML กับ input ของผู้ใช้)
function sendChatMessage(){
  const input = document.getElementById('chatInput');
  const chatHistory = document.getElementById('chatHistory');
  if(!input || !chatHistory) return;
  const text = input.value.trim();
  if(!text) return;

  // create user message element
  const userDiv = document.createElement('div');
  const userStrong = document.createElement('strong');
  userStrong.innerText = 'คุณ:';
  userDiv.appendChild(userStrong);
  userDiv.insertAdjacentHTML('beforeend', ' ' + escapeHtml(text));
  chatHistory.appendChild(userDiv);

  input.value = '';
  chatHistory.scrollTop = chatHistory.scrollHeight;

  // simulate bot response (replace with real API call later)
  setTimeout(()=>{
    const botDiv = document.createElement('div');
    const botStrong = document.createElement('strong');
    botStrong.innerText = 'AI Mentor:';
    botDiv.appendChild(botStrong);
    botDiv.insertAdjacentHTML('beforeend', ' ระบบกำลังประมวลผลคำตอบ...');
    chatHistory.appendChild(botDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }, 700);
}

/* ---------------------------------------------
   Small helper: animate progress bars after renderDashboard()
   (call animateProgressBars() after you render .progress-fill elements)
   --------------------------------------------- */
function animateProgressBars(){
  document.querySelectorAll('.progress-fill').forEach(el=>{
    const target = el.getAttribute('data-target-width') || el.style.width || '0%';
    el.style.width = '0%';
    // force reflow then set
    requestAnimationFrame(()=> { el.style.width = target; });
  });
}

/* ---------------------------------------------
   Expose small API for other scripts (if needed)
   --------------------------------------------- */
window.getAllScores = getAllScores;
window.saveChapterScore = saveChapterScore;
window.updateDashboard = updateDashboard;
window.openAiModal = openAiModal;
window.closeAiModal = closeAiModal;
window.sendChatMessage = sendChatMessage;
window.animateProgressBars = animateProgressBars;
