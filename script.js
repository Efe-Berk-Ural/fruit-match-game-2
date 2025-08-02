const grid = document.getElementById("grid");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");
const gameOverPanel = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const comboMessage = document.getElementById("comboMessage");

const fruits = ["🍒", "🍋", "🍇", "🍉", "🍍", "🍓"];
let board = [];
let score = 0;
let selected = null;
let timeLeft = 300;
let timer;

// Grid oluştur
function createBoard() {
  board = [];
  grid.innerHTML = "";
  for (let i = 0; i < 64; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    const fruit = fruits[Math.floor(Math.random() * fruits.length)];
    cell.innerText = fruit;
    cell.dataset.index = i;
    board.push(cell);
    grid.appendChild(cell);
  }
}

// Süreyi başlat
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.innerText = `⏱ ${mins}:${secs < 10 ? "0" : ""}${secs}`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// Oyun bitince
function endGame() {
  clearInterval(timer);
  gameOverPanel.style.display = "block";
  finalScore.innerText = score;
}

// Skoru artır
function addScore(points, comboText = "") {
  score += points;
  scoreDisplay.innerText = `⭐ ${score}`;
  if (comboText) showCombo(comboText);
}

// Combo mesajı göster
function showCombo(text) {
  comboMessage.innerText = text;
  comboMessage.style.display = "block";
  setTimeout(() => {
    comboMessage.style.display = "none";
  }, 1500);
}

// Swap
function swapFruits(a, b) {
  const temp = a.innerText;
  a.innerText = b.innerText;
  b.innerText = temp;
}

// Eşleşme kontrol
function checkMatches() {
  let matched = new Set();

  // Yatay
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 6; c++) {
      const start = r * 8 + c;
      const group = [start, start + 1, start + 2];
      const emoji = board[start].innerText;
      if (group.every(i => board[i].innerText === emoji)) {
        group.forEach(i => matched.add(i));
        if (board[start + 3] && board[start + 3].innerText === emoji) {
          matched.add(start + 3);
          addScore(40, "🔥 Combo 4x!");
          if (board[start + 4] && board[start + 4].innerText === emoji) {
            matched.add(start + 4);
            addScore(100, "💥 Combo 5x!");
            if (board[start + 5] && board[start + 5].innerText === emoji) {
              matched = new Set([...Array(64).keys()]);
              addScore(1000, "🌟 Combo 6x!");
              return dropFruits(matched);
            }
          }
        } else {
          addScore(10);
        }
      }
    }
  }

  // Dikey
  for (let c = 0; c < 8; c++) {
    for (let r = 0; r < 6; r++) {
      const start = r * 8 + c;
      const group = [start, start + 8, start + 16];
      const emoji = board[start].innerText;
      if (group.every(i => board[i].innerText === emoji)) {
        group.forEach(i => matched.add(i));
        if (board[start + 24] && board[start + 24].innerText === emoji) {
          matched.add(start + 24);
          addScore(40, "🔥 Combo 4x!");
          if (board[start + 32] && board[start + 32].innerText === emoji) {
            matched.add(start + 32);
            addScore(100, "💥 Combo 5x!");
            if (board[start + 40] && board[start + 40].innerText === emoji) {
              matched = new Set([...Array(64).keys()]);
              addScore(1000, "🌟 Combo 6x!");
              return dropFruits(matched);
            }
          }
        } else {
          addScore(10);
        }
      }
    }
  }

  if (matched.size > 0) {
    dropFruits(matched);
  }
}

// Düşen meyveler
function dropFruits(matched) {
  matched.forEach(i => {
    board[i].classList.add("pop");
  });

  setTimeout(() => {
    matched.forEach(i => {
      const emoji = fruits[Math.floor(Math.random() * fruits.length)];
      board[i].innerText = emoji;
      board[i].classList.remove("pop");
    });
    checkMatches();
  }, 300);
}

// Oyun hareketleri
grid.addEventListener("click", e => {
  const el = e.target;
  if (!el.classList.contains("cell")) return;

  if (!selected) {
    selected = el;
    el.style.border = "2px solid red";
  } else {
    swapFruits(selected, el);
    selected.style.border = "";
    selected = null;
    setTimeout(checkMatches, 100);
  }
});

// Yeniden başlat
restartBtn.addEventListener("click", () => {
  score = 0;
  timeLeft = 300;
  scoreDisplay.innerText = "⭐ 0";
  gameOverPanel.style.display = "none";
  comboMessage.style.display = "none";
  createBoard();
  startTimer();
  checkMatches();
});

// Başlat
createBoard();
startTimer();
checkMatches();
