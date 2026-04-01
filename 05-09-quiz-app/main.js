"use strict";

const quiz = [
  { text: "日本の首都は東京である。", answer: true, explain: "日本の首都は東京です。" },
  { text: "富士山は日本で一番高い山である。", answer: true, explain: "標高3,776mで日本最高峰です。" },
  { text: "日本には47の都道府県がある。", answer: true, explain: "都道府県は合計47あります。" },
  { text: "沖縄県は日本の本州にある。", answer: false, explain: "沖縄県は本州ではありません。" },
  { text: "新幹線は日本で生まれた高速鉄道である。", answer: true, explain: "新幹線は日本発祥です。" }
];

let index = 0;
let score = 0;
let answered = false;

// DOM
const meta = document.getElementById("meta");
const question = document.getElementById("question");
const feedback = document.getElementById("feedback");
const btnMaru = document.getElementById("btnMaru");
const btnBatsu = document.getElementById("btnBatsu");
const btnNext = document.getElementById("btnNext");
const playArea = document.getElementById("playArea");
const resultArea = document.getElementById("resultArea");
const result = document.getElementById("result");
const btnRestart = document.getElementById("btnRestart");

function render() {
  meta.textContent = `第 ${index + 1} 問 / ${quiz.length}`;
  question.textContent = quiz[index].text;

  feedback.textContent = "";
  answered = false;

  btnNext.disabled = true;
  btnMaru.disabled = false;
  btnBatsu.disabled = false;
}

function judge(userAnswer) {
  if (answered) return;
  answered = true;

  const q = quiz[index];
  const correct = userAnswer === q.answer;
  if (correct) score++;

  // classなしで表示（記号と文章だけ）
  feedback.textContent = `${correct ? "正解！" : "不正解…"} ${q.explain}`;

  btnNext.disabled = false;
  btnMaru.disabled = true;
  btnBatsu.disabled = true;
}

function next() {
  if (index < quiz.length - 1) {
    index++;
    render();
  } else {
    showResult();
  }
}

function showResult() {
  playArea.style.display = "none";
  resultArea.style.display = "block";

  meta.textContent = "結果";
  question.textContent = "";
  result.textContent = `あなたの正解数は ${score} / ${quiz.length} です。`;
}

function restart() {
  index = 0;
  score = 0;

  playArea.style.display = "block";
  resultArea.style.display = "none";
  render();
}

// Events
btnMaru.addEventListener("click", () => judge(true));
btnBatsu.addEventListener("click", () => judge(false));
btnNext.addEventListener("click", next);
btnRestart.addEventListener("click", restart);

// init
render();