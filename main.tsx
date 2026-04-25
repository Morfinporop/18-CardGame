
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --gold: #ffd700;
  --red: #ff4d4d;
  --dark: #0f0f0f;
  --panel: #1a1a1a;
  --table: radial-gradient(circle, #1a4d1a 0%, #0a240a 100%);
}

body {
  font-family: 'Rajdhani', sans-serif;
  background-color: var(--dark);
  color: white;
  overflow: hidden;
}

h1, h2, .orbitron {
  font-family: 'Orbitron', sans-serif;
  text-transform: uppercase;
}

/* --- AGE GATE & MENU --- */
.screen-center {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative;
  overflow: hidden;
}

.screen-center::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, #111 0%, #000 70%);
  animation: pulse-bg 10s infinite alternate;
}

@keyframes pulse-bg {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 0.8; }
}

.modal {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(25px);
  padding: 40px;
  border-radius: 30px;
  border: 1px solid rgba(255,255,255,0.1);
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
  animation: modal-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes modal-pop {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border: 2px solid rgba(255,255,255,0.1);
  margin: 0 auto 20px;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
}

.card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  background: #0a0a0a;
  box-shadow: 0 10px 20px rgba(0,0,0,0.4);
}

.input-field {
  border-radius: 12px;
}

.btn {
  border-radius: 12px;
}

.screamer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: shake 0.1s infinite;
}

@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.blood-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle, transparent 50%, rgba(139,0,0,0.4) 100%);
  z-index: 999;
}


.input-field {
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  background: transparent;
  border: 1px solid #333;
  color: white;
  border-radius: 0px;
  font-family: 'Rajdhani', sans-serif;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #666;
}

.btn {
  padding: 15px 30px;
  border: 1px solid #333;
  background: transparent;
  color: white;
  cursor: pointer;
  transition: 0.3s;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 12px;
}

.btn:hover {
  background: white;
  color: black;
  border-color: white;
}

.btn-primary {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.btn-primary:hover {
  background: transparent;
  color: #fff;
}

.table-zone {
  flex: 1;
  background: #000;
  margin: 20px;
  border: 1px solid #222;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.card {
  border-radius: 0px;
  border: 1px solid #333;
  background: #050505;
}

.sidebar {
  background: rgba(5, 5, 5, 0.95);
  backdrop-filter: blur(10px);
  border-left: 1px solid #222;
}

.private-room-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}


.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
  font-family: 'Orbitron', sans-serif;
}

.btn-primary { background: var(--red); color: white; }
.btn-primary:hover { transform: scale(1.05); filter: brightness(1.2); }
.btn-gold { background: var(--gold); color: black; }

.input-field {
  width: 100%;
  padding: 12px;
  margin: 20px 0;
  background: #2a2a2a;
  border: 1px solid #444;
  color: white;
  border-radius: 8px;
}

/* --- GAME LAYOUT --- */
.game-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.main-board {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #000;
}

.opponents-zone {
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 20px;
}

.table-zone {
  flex: 1;
  background: var(--table);
  margin: 0 40px;
  border-radius: 150px 150px 0 0;
  border: 10px solid #222;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.player-zone {
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 20px;
  background: linear-gradient(to top, #111, transparent);
  position: relative;
}

/* --- CARDS --- */
.card {
  width: 140px;
  height: 200px;
  background: #222;
  border-radius: 12px;
  border: 2px solid #444;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: 0.3s;
  user-select: none;
}

.card-img {
  width: 100%;
  height: 70%;
  object-fit: cover;
  border-bottom: 2px solid #333;
}

.card-info {
  padding: 8px;
  text-align: center;
}

.card-name {
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 4px;
}

.card-power {
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0,0,0,0.8);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gold);
  font-weight: bold;
  font-size: 12px;
}

.card.selected {
  border-color: var(--gold);
  box-shadow: 0 0 15px var(--gold);
  transform: translateY(-40px) scale(1.1) !important;
  z-index: 100;
}

.hand-card {
  margin-left: -50px;
}
.hand-card:first-child { margin-left: 0; }

.hand-card:hover {
  transform: translateY(-20px);
  z-index: 50;
}

/* --- SIDEBAR --- */
.sidebar {
  width: 350px;
  background: var(--panel);
  border-left: 1px solid #333;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 500;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.open {
  transform: translateX(0);
}

.sidebar-toggle {
  position: absolute;
  left: -50px;
  top: 20px;
  width: 50px;
  height: 50px;
  background: var(--panel);
  border: 1px solid #333;
  border-right: none;
  border-radius: 10px 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gold);
}

.rules-modal {
  max-width: 600px;
  text-align: left;
  line-height: 1.6;
}

.rules-modal h2 { color: var(--gold); margin-bottom: 15px; }
.rules-modal ul { margin-left: 20px; margin-bottom: 20px; }

.mode-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #333;
  margin-left: 10px;
}

.bottle-spin {
  animation: spin 3s cubic-bezier(0.15, 0, 0.15, 1) forwards;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(1440deg); }
}


.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid #333;
}

.tab-btn {
  flex: 1;
  padding: 15px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
}

.tab-btn.active {
  color: var(--gold);
  border-bottom: 2px solid var(--gold);
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

/* --- UI ELEMENTS --- */
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  background: #222;
}

.active-turn {
  border-color: var(--gold) !important;
  box-shadow: 0 0 10px var(--gold);
}

.notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.9);
  padding: 20px 40px;
  border: 2px solid var(--gold);
  border-radius: 10px;
  z-index: 200;
  font-size: 24px;
}

.play-btn {
  position: absolute;
  right: 40px;
  bottom: 120px;
  z-index: 110;
  padding: 15px 40px;
  font-size: 20px;
}

.deck {
  position: absolute;
  right: 40px;
  width: 100px;
  height: 140px;
  background: #333;
  border: 2px solid #555;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
