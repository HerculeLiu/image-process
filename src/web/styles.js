export const APP_CSS = `:root {
  --bg: #f3f7fb;
  --panel: rgba(255, 255, 255, 0.88);
  --text: #0b1b2b;
  --muted: #4c5f73;
  --line: rgba(23, 56, 88, 0.16);
  --brand: #0070f3;
  --warn: #b45309;
  --shadow: 0 20px 45px rgba(9, 29, 51, 0.12);
  --radius-xl: 24px;
  --radius-md: 14px;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Noto Sans SC", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 8% 8%, #d8ecff 0, transparent 34%),
    radial-gradient(circle at 90% 12%, #dcfff0 0, transparent 30%),
    linear-gradient(160deg, #f2f7fc 0%, #edf5ff 40%, #eefaf5 100%);
  min-height: 100vh;
}

.app {
  width: min(1120px, 92vw);
  margin: 28px auto 40px;
  display: grid;
  gap: 18px;
}

.hero, .panel {
  background: var(--panel);
  backdrop-filter: blur(8px);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
}

.hero {
  padding: 28px;
  display: grid;
  gap: 8px;
}

h1 {
  font-family: "Space Grotesk", sans-serif;
  margin: 0;
  font-size: clamp(1.6rem, 2.2vw, 2.3rem);
  letter-spacing: 0.01em;
}

.subtitle {
  margin: 0;
  color: var(--muted);
  font-size: 0.98rem;
  line-height: 1.55;
}

.grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 18px;
}

.panel {
  padding: 18px;
}

.section-title {
  font-family: "Space Grotesk", sans-serif;
  margin: 0 0 12px;
  font-size: 1.1rem;
}

.upload {
  border: 1.5px dashed #7ea2c2;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(0,112,243,.07), rgba(0,184,148,.06));
  padding: 16px;
  text-align: center;
}

input[type="file"] {
  width: 100%;
  margin-top: 10px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: white;
  padding: 8px;
}

.hint {
  font-size: .86rem;
  color: var(--muted);
  margin-top: 8px;
  line-height: 1.5;
}

.feature-list {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.feature-btn {
  width: 100%;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--text);
  border-radius: 12px;
  padding: 12px;
  text-align: left;
  cursor: pointer;
  transition: .22s ease;
  font-weight: 600;
}

.feature-btn:hover { transform: translateY(-1px); border-color: #8bb4d7; }

.feature-btn.active {
  border-color: #4b92d8;
  background: linear-gradient(135deg, rgba(0,112,243,.10), rgba(0,184,148,.10));
  box-shadow: inset 0 0 0 1px rgba(0,112,243,.14);
}

.control-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

select, button {
  border-radius: 10px;
  border: 1px solid var(--line);
  padding: 10px 12px;
  font-family: inherit;
  font-size: .92rem;
}

select { background: #fff; }

button.primary {
  background: linear-gradient(135deg, var(--brand), #3397ff);
  color: #fff;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

button.ghost {
  background: #fff;
  color: var(--text);
  cursor: pointer;
}

.canvas-wrap {
  border-radius: 16px;
  border: 1px solid var(--line);
  background: #fff;
  min-height: 320px;
  padding: 12px;
  display: grid;
  place-items: center;
  overflow: auto;
}

canvas {
  max-width: 100%;
  border-radius: 12px;
  box-shadow: 0 14px 28px rgba(7, 30, 57, .16);
}

.placeholder {
  color: var(--muted);
  font-size: .95rem;
}

.result {
  margin-top: 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fbfdff;
  padding: 12px;
  max-height: 220px;
  overflow: auto;
  font-size: .9rem;
  line-height: 1.55;
  white-space: pre-wrap;
}

.status { margin-top: 10px; color: var(--muted); font-size: .88rem; }
.status.warn { color: var(--warn); }

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
}
`;
