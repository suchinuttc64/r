/* shared/style.css - ฉบับรวม Layout ใหม่ */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0f172a; /* พื้นหลังรวม */
    color: #f1f5f9;
    min-height: 100vh;
}

/* ==========================================================================
   🛠️ โครงสร้าง Layout สถาบัน (เพิ่มใหม่)
   ========================================================================== */
.institutional-header {
    background: #1e293b;
    padding: 1.5rem 2rem;
    display: flex;
    align-items: center;
    gap: 20px;
    border-bottom: 2px solid #38bdf8;
    color: white;
}
.header-title h1 { margin: 0; font-size: 1.5rem; color: #38bdf8; }
.header-title p { margin: 0; color: #cbd5e1; font-size: 0.9rem; }

.main-wrapper {
    display: flex;
    min-height: calc(100vh - 100px);
}

.sidebar {
    width: 260px;
    background: #1e293b;
    padding: 2rem 1.5rem;
    border-right: 1px solid #334155;
}

.content-area {
    flex: 1;
    padding: 2rem;
}

/* ==========================================================================
   🎨 ดีไซน์เดิมของอาจารย์ (คงไว้ครบถ้วน)
   ========================================================================== */
.container {
    max-width: 1200px;
    margin: 0 auto;
    /* ปรับให้โปร่งใสเมื่ออยู่ใน Layout ใหม่ */
    background: transparent; 
    padding: 0;
    box-shadow: none;
    border: none;
}

h1, h2, h3 { color: #38bdf8; margin-bottom: 1rem; }

.step {
    background: #0f172a;
    border-left: 6px solid #38bdf8;
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

button, .btn {
    background: #0288d1;
    border: none;
    color: white;
    padding: 10px 24px;
    border-radius: 40px;
    font-weight: 600;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 1rem;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s;
}
button:hover, .btn:hover { background: #026b9e; }

button:disabled, .btn:disabled {
    background-color: #475569 !important;
    cursor: not-allowed;
    opacity: 0.6;
    filter: grayscale(1);
}

.progress-bar {
    background: #334155;
    border-radius: 10px;
    height: 12px;
    width: 100%;
    margin: 10px 0;
    overflow: hidden;
}
.progress-fill {
    background: linear-gradient(90deg, #38bdf8, #0ea5e9);
    height: 100%;
    width: 0%;
    transition: width 0.3s;
}

.chapter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.chapter-card {
    background: #0f172a;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid rgba(255,255,255,0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.stats {
    display: flex;
    gap: 1.5rem;
    background: #0f172a;
    padding: 1.2rem;
    border-radius: 1rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(56, 189, 248, 0.1);
}

.stat-item { font-weight: 600; color: #cbd5e1; }
.stat-item span { color: #38bdf8; font-size: 1.1rem; }

/* 🛠️ ส่วนพิเศษและ AI Mentor */
.special-quest { border-left: 6px solid #ef4444; background: rgba(239, 68, 68, 0.02); }
.btn-final { background: #ef4444 !important; }
.btn-final:hover { background: #b91c1c !important; }

.ai-mentor-btn {
    position: fixed; bottom: 30px; right: 30px;
    width: 70px; height: 70px; background: #ffffff;
    border-radius: 50%; cursor: pointer;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    z-index: 1000; transition: transform 0.3s;
    display: flex; align-items: center; justify-content: center;
}
.ai-mentor-btn:hover { transform: scale(1.1); }
