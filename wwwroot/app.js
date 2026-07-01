const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const notesInput = document.getElementById('notesInput');
const charCount = document.getElementById('charCount');
const summaryBtn = document.getElementById('summaryBtn');
const flashcardBtn = document.getElementById('flashcardBtn');
const focusBtn = document.getElementById('focusBtn');
const summaryBox = document.getElementById('summaryBox');
const flashcardBox = document.getElementById('flashcardBox');

function setTheme(theme){
  root.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️ LIGHT MODE' : '🌙 DARK MODE';
}

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(next);
});

notesInput.addEventListener('input', () => {
  charCount.textContent = `Character count: ${notesInput.value.length}`;
});

async function postJson(url, payload){
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

summaryBtn.addEventListener('click', async () => {
  const data = await postJson('/api/summary', { text: notesInput.value });
  summaryBox.textContent = data.summary || 'No summary returned.';
});

flashcardBtn.addEventListener('click', async () => {
  const data = await postJson('/api/flashcards', { text: notesInput.value });
  flashcardBox.innerHTML = '';
  (data.cards || []).forEach((c, i) => {
    const div = document.createElement('div');
    div.className = 'card-item';
    div.innerHTML = `<strong>${i + 1}. ${c.front}</strong><br><span>${c.back}</span>`;
    flashcardBox.appendChild(div);
  });
  if (!data.cards || data.cards.length === 0) flashcardBox.textContent = 'No flashcards generated.';
});

focusBtn.addEventListener('click', async () => {
  const data = await postJson('/api/focus-session', { minutes: 15 });
  alert(`Focus session started: ${data.minutes} minutes`);
});

setTheme('light');
