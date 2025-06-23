// Quiz data
const quiz = [
  {
    question: "What term describes the ratio of charge stored to the potential difference across a capacitor?",
    answer: "CAPACITANCE"
  },
  {
    question: "What imaginary surface is used to apply Gauss’s Law effectively?",
    answer: "GAUSSIAN"
  },
  {
    question: "What insulating material is inserted between the plates of a capacitor to increase its capacitance?",
    answer: "DIELECTRIC"
  },
  {
    question: "What quantity measures the number of electric field lines passing through a surface?",
    answer: "FLUX"
  },
  {
    question: "What branch of physics deals with electric charges at rest?",
    answer: "ELECTROSTATICS"
  },
  {
    question: "What is the SI unit of electric flux?",
    answer: "NEWTON"
  },
  {
    question: "What property of a dielectric reduces the effective electric field within the capacitor?",
    answer: "POLARIZATION"
  },
  {
    question: "What device stores electric charge and energy in an electric field?",
    answer: "CAPACITOR"
  },
  {
    question: "What law relates the electric flux through a closed surface to the net enclosed charge?",
    answer: "GAUSS"
  },
  {
    question: "What fundamental force is described by Coulomb's Law in this field?",
    answer: "ELECTRIC"
  }
];

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const wordleGrid = document.getElementById('wordle-grid');
const keyboard = document.getElementById('keyboard');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const finalScoreEl = document.getElementById('final-score');

// Game state
let currentQuestion = 0;
let score = 0;
let attempt = 0;
let grid = [];
let currentInput = '';
let timer = null;
let timeLeft = 30;
let gameActive = false;
let keyboardState = {};
let playerName = '';

const KEYBOARD_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','⌫']
];

function showScreen(screen) {
  // Hide all screens
  document.getElementById('start-screen').style.display = 'none';
  document.getElementById('game-screen').style.display = 'none';
  document.getElementById('end-screen').style.display = 'none';
  // Show only the requested screen
  screen.style.display = '';
}

function saveScoreToFile(name, score) {
  // Save to a local file using Blob and download (browser limitation workaround)
  const content = `${name}: ${score}\n`;
  const blob = new Blob([content], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'quiz_scores.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function startGame() {
  const nameInput = document.getElementById('player-name');
  playerName = nameInput ? nameInput.value.trim() : '';
  if (!playerName) {
    nameInput.classList.add('input-error');
    nameInput.focus();
    return;
  }
  nameInput.classList.remove('input-error');
  currentQuestion = 0;
  score = 0;
  showScreen(document.getElementById('game-screen'));
  nextQuestion();
}

function endGame() {
  showScreen(document.getElementById('end-screen'));
  finalScoreEl.textContent = `Your Score: ${score} / ${quiz.length}`;
  saveScoreToFile(playerName, score);
}

function nextQuestion() {
  if (timer) clearInterval(timer);
  if (currentQuestion >= quiz.length) {
    endGame();
    return;
  }
  attempt = 0;
  currentInput = '';
  keyboardState = {};
  timeLeft = 30;
  updateTimer();
  renderKeyboard();
  renderGrid();
  questionNumber.textContent = `QUESTION ${currentQuestion + 1}`;
  questionText.textContent = quiz[currentQuestion].question;
  scoreEl.textContent = `Score: ${score}`;
  gameActive = true;
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      markIncorrect();
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = `${timeLeft} s`;
}

function renderGrid() {
  const answerLen = quiz[currentQuestion].answer.length;
  grid = Array.from({length: 3}, () => Array(answerLen).fill(''));
  wordleGrid.innerHTML = '';
  for (let row = 0; row < 3; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'wordle-row';
    for (let col = 0; col < answerLen; col++) {
      const box = document.createElement('div');
      box.className = 'wordle-box';
      if (grid[row][col]) {
        box.textContent = grid[row][col];
        box.classList.add('filled');
      }
      // Animate selection for current input row
      if (row === attempt) {
        box.classList.add('selected');
      }
      rowDiv.appendChild(box);
    }
    wordleGrid.appendChild(rowDiv);
  }
}

function renderKeyboard() {
  keyboard.innerHTML = '';
  KEYBOARD_ROWS.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach(key => {
      const keyBtn = document.createElement('button');
      keyBtn.className = 'key';
      if (key === 'ENTER' || key === '⌫') keyBtn.classList.add('wide');
      keyBtn.textContent = key;
      if (keyboardState[key]) keyBtn.classList.add(keyboardState[key]);
      keyBtn.onclick = () => handleKey(key);
      rowDiv.appendChild(keyBtn);
    });
    keyboard.appendChild(rowDiv);
  });
}

function handleKey(key) {
  if (!gameActive) return;
  const answerLen = quiz[currentQuestion].answer.length;
  if (key === 'ENTER') {
    if (currentInput.length === answerLen) {
      submitAttempt();
    }
    return;
  }
  if (key === '⌫') {
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      updateCurrentRow();
    }
    return;
  }
  if (/^[A-Z]$/.test(key) && currentInput.length < answerLen) {
    currentInput += key;
    updateCurrentRow();
  }
}

function updateCurrentRow() {
  const answerLen = quiz[currentQuestion].answer.length;
  grid[attempt] = Array(answerLen).fill('');
  for (let i = 0; i < currentInput.length; i++) {
    grid[attempt][i] = currentInput[i];
  }
  // Re-render only current row
  const rowDivs = wordleGrid.querySelectorAll('.wordle-row');
  const rowDiv = rowDivs[attempt];
  if (rowDiv) {
    for (let col = 0; col < answerLen; col++) {
      const box = rowDiv.children[col];
      box.textContent = grid[attempt][col];
      box.classList.toggle('filled', !!grid[attempt][col]);
      box.classList.add('selected');
    }
  }
}

function submitAttempt() {
  const answer = quiz[currentQuestion].answer;
  const guess = currentInput.toUpperCase();
  const answerArr = answer.split('');
  const guessArr = guess.split('');
  const result = Array(answer.length).fill('absent');
  const answerUsed = Array(answer.length).fill(false);

  // First pass: correct
  for (let i = 0; i < answer.length; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i] = 'correct';
      answerUsed[i] = true;
    }
  }
  // Second pass: present
  for (let i = 0; i < answer.length; i++) {
    if (result[i] === 'correct') continue;
    for (let j = 0; j < answer.length; j++) {
      if (!answerUsed[j] && guessArr[i] === answerArr[j]) {
        result[i] = 'present';
        answerUsed[j] = true;
        break;
      }
    }
  }
  // Animate and color boxes
  const rowDivs = wordleGrid.querySelectorAll('.wordle-row');
  const rowDiv = rowDivs[attempt];
  for (let i = 0; i < answer.length; i++) {
    const box = rowDiv.children[i];
    box.classList.add(result[i]);
    // Animate flip
    setTimeout(() => {
      box.classList.add('flip');
    }, i * 150);
    // Update keyboard
    const letter = guessArr[i];
    if (!keyboardState[letter] || keyboardState[letter] === 'present' && result[i] === 'correct' || keyboardState[letter] === 'absent' && (result[i] === 'present' || result[i] === 'correct')) {
      keyboardState[letter] = result[i];
    }
  }
  renderKeyboard();
  // Check win/lose
  if (guess === answer) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    gameActive = false;
    setTimeout(() => {
      currentQuestion++;
      nextQuestion();
    }, 1200);
    clearInterval(timer);
    return;
  }
  attempt++;
  if (attempt >= 3) {
    markIncorrect();
    return;
  }
  currentInput = '';
}

function markIncorrect() {
  gameActive = false;
  // Show correct answer
  const answer = quiz[currentQuestion].answer;
  const rowDivs = wordleGrid.querySelectorAll('.wordle-row');
  const lastRow = rowDivs[attempt >= 3 ? 2 : attempt];
  for (let i = 0; i < answer.length; i++) {
    if (lastRow && !lastRow.children[i].textContent) {
      lastRow.children[i].textContent = answer[i];
      lastRow.children[i].classList.add('absent');
    }
    lastRow && lastRow.children[i].classList.add('reveal');
  }
  clearInterval(timer);
  setTimeout(() => {
    currentQuestion++;
    nextQuestion();
  }, 1500);
}

// Keyboard input
window.addEventListener('keydown', (e) => {
  if (!gameActive) return;
  let key = e.key.toUpperCase();
  if (key === 'BACKSPACE') key = '⌫';
  if (key === 'ENTER' || key === '⌫' || (/^[A-Z]$/.test(key) && key.length === 1)) {
    handleKey(key);
    e.preventDefault();
  }
});

// Update event listeners
startBtn.onclick = startGame;
restartBtn.onclick = () => {
  showScreen(document.getElementById('start-screen'));
};

// On page load, ensure only start screen is visible
window.addEventListener('DOMContentLoaded', () => {
  showScreen(document.getElementById('start-screen'));
});
