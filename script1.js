// ================================
// 🎧 Chargement des sons
// ================================
const correctSound = new Audio("sounds/correct.mp3");
const wrongSound = new Audio("sounds/wrong.mp3");

// ================================
// 📋 Questions du quiz
// ================================
const questions = [
  {
    question: "Quelle est la capitale de la France ?",
    options: ["Londres", "Paris", "Madrid", "Rome"],
    answer: "Paris",
  },
  {
    question: "Combien font 5 × 3 ?",
    options: ["15", "10", "20", "25"],
    answer: "15",
  },
  {
    question: "Quel est le langage du Web ?",
    options: ["Python", "HTML", "C++", "Java"],
    answer: "HTML",
  },
  {
    question: "Combien y a-t-il de continents sur Terre ?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
];

// ================================
// 🔢 Variables globales
// ================================
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;

// ================================
// 🚀 Lancer le quiz
// ================================
document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("restart-btn").addEventListener("click", restartQuiz);

function startQuiz() {
  document.getElementById("start-container").classList.add("d-none");
  document.getElementById("quiz-container").classList.remove("d-none");
  showQuestion();
  startTimer();
}

// ================================
// ❓ Afficher une question
// ================================
function showQuestion() {
  const questionData = questions[currentQuestionIndex];
  document.getElementById("question").textContent = questionData.question;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  questionData.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("btn", "btn-outline-primary");
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("next-btn").classList.add("d-none");
  resetTimer();
}

// ================================
// ✅ Vérifier la réponse
// ================================
function checkAnswer(selectedOption) {
  const correctAnswer = questions[currentQuestionIndex].answer;
  const buttons = document.querySelectorAll("#options button");

  buttons.forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.replace("btn-outline-primary", "btn-success");
    } else if (btn.textContent === selectedOption) {
      btn.classList.replace("btn-outline-primary", "btn-danger");
    }
  });

  if (selectedOption === correctAnswer) {
    score++;
    correctSound.play();
  } else {
    wrongSound.play();
  }

  document.getElementById("next-btn").classList.remove("d-none");
  clearInterval(timer);
}

// ================================
// ⏳ Gestion du temps
// ================================
function startTimer() {
  timeLeft = 10;
  document.getElementById("timer").textContent = `⏳ Temps restant : ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `⏳ Temps restant : ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      wrongSound.play();
      nextQuestion();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}

// ================================
// ⏭️ Question suivante
// ================================
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// ================================
// 🏁 Résultat final
// ================================
function showResult() {
  clearInterval(timer);
  document.getElementById("quiz-container").classList.add("d-none");
  document.getElementById("result-container").classList.remove("d-none");

  document.getElementById("score-text").textContent = `Tu as eu ${score} sur ${questions.length} !`;

  localStorage.setItem("lastScore", score);

  const ctx = document.getElementById("resultChart");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Bonnes réponses", "Mauvaises réponses"],
      datasets: [
        {
          data: [score, questions.length - score],
          backgroundColor: ["#2ecc71", "#e74c3c"],
        },
      ],
    },
  });
}

// ================================
// 🔄 Rejouer
// ================================
function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("result-container").classList.add("d-none");
  document.getElementById("quiz-container").classList.remove("d-none");
  showQuestion();
  startTimer();
}
