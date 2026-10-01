/* =========================================
DATA — مستقیم داخل کد
========================================= */
const LESSONS_DATA = {
  "hesaban-ch1-lesson-1": {
    id: "hesaban-ch1-lesson-1",
    number: 1,
    title: "مجموع جملات دنباله‌های حسابی",
    description: "آموزش دنباله‌های حسابی و فرمول مجموع",
    chapterId: "hesaban-chapter-1",
    questions: [
      {
        id: "h1q1",
        type: "exercise",
        question: "جمله عمومی دنباله‌ای با جمله اول ۱ و قدر نسبت ۳ را بنویسید.",
        correctAnswer: "3n - 2",
        answer: "از فرمول جمله عمومی دنباله حسابی استفاده می‌کنیم.",
        solution: "a_n = a_1 + (n-1)d = 1 + (n-1)×3 = 3n - 2",
        difficulty: "آسان"
      },
      {
        id: "h1q2",
        type: "exercise",
        question: "مجموع ۱۰ جمله اول دنباله حسابی ۱, ۴, ۷, ۱۰, ... را حساب کنید.",
        correctAnswer: "145",
        answer: "از فرمول مجموع n جمله اول استفاده می‌کنیم.",
        solution: "S_n = n/2 [2a_1 + (n-1)d] = 10/2 [2(1) + 9(3)] = 5 × 29 = 145",
        difficulty: "متوسط"
      },
      {
        id: "h1q3",
        type: "exercise",
        question: "اگر جمله اول یک دنباله حسابی ۵ و قدر نسبت آن ۲ باشد، جمله دهم چند است؟",
        correctAnswer: "23",
        answer: "از فرمول جمله عمومی استفاده می‌کنیم.",
        solution: "a_10 = a_1 + 9d = 5 + 9×2 = 5 + 18 = 23",
        difficulty: "آسان"
      }
    ]
  },
  "hesaban-ch1-lesson-2": {
    id: "hesaban-ch1-lesson-2",
    number: 2,
    title: "دنباله‌های هندسی",
    description: "آموزش دنباله‌های هندسی و فرمول مجموع",
    chapterId: "hesaban-chapter-1",
    questions: [
      {
        id: "h2q1",
        type: "exercise",
        question: "جمله عمومی دنباله هندسی با جمله اول ۲ و نسبت ۳ را بنویسید.",
        correctAnswer: "2 × 3^(n-1)",
        answer: "از فرمول جمله عمومی دنباله هندسی استفاده می‌کنیم.",
        solution: "a_n = a_1 × r^(n-1) = 2 × 3^(n-1)",
        difficulty: "آسان"
      },
      {
        id: "h2q2",
        type: "exercise",
        question: "مجموع ۴ جمله اول دنباله هندسی ۱, ۲, ۴, ۸, ... چقدر است؟",
        correctAnswer: "15",
        answer: "جملات را با هم جمع می‌کنیم.",
        solution: "1 + 2 + 4 + 8 = 15",
        difficulty: "آسان"
      }
    ]
  }
};

/* =========================================
STATE
========================================= */
let currentLesson = null;
let currentQuestionIndex = 0;
let score = 0;

/* =========================================
LOAD LESSON
========================================= */
function loadLesson() {
  console.log("درس شروع شد");

  const questionsList = document.getElementById("questionsList");

  try {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get("lesson");
    console.log("Lesson ID:", lessonId);

    if (!lessonId) {
      throw new Error("شناسه درس در آدرس نیست. آدرس باید ?lesson=... داشته باشد.");
    }

    const lesson = LESSONS_DATA[lessonId];

    if (!lesson) {
      throw new Error("درسی با شناسه " + lessonId + " پیدا نشد.");
    }

    currentLesson = lesson;
    console.log("درس پیدا شد:", lesson.title);

    document.getElementById("lessonNumber").textContent = "درس " + lesson.number;
    document.getElementById("lessonTitle").textContent = lesson.title;
    document.getElementById("lessonDescription").textContent = lesson.description;
    document.getElementById("breadcrumbLesson").textContent = lesson.title;
    document.getElementById("backToChapter").href = "chapter.html?chapter=" + lesson.chapterId;
    document.getElementById("questionCount").textContent = lesson.questions.length + " سوال";

    renderCurrentQuestion();

  } catch (error) {
    console.error("خطا:", error);
    if (questionsList) {
      questionsList.innerHTML =
        '<div class="loading" style="color:#e05252;">خطا: ' + error.message + '</div>';
    }
  }
}

/* =========================================
RENDER QUESTION
========================================= */
function renderCurrentQuestion() {
  const container = document.getElementById("questionsList");
  const questions = currentLesson.questions;

  if (!questions.length) {
    container.innerHTML = '<div class="loading">هنوز سوالی برای این درس ثبت نشده.</div>';
    return;
  }

  const q = questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  container.innerHTML = `
    <article class="question-card">
      <div class="question-top">
        <span class="question-number">سوال ${currentQuestionIndex + 1} از ${questions.length}</span>
        <span class="difficulty">${q.difficulty}</span>
      </div>
      <div class="question-progress">
        <div><i style="width: ${progress}%"></i></div>
      </div>
      <div class="question-text">${q.question}</div>
      <div class="answer-input-area">
        <label for="userAnswer">پاسخ خود را وارد کنید</label>
        <input type="text" id="userAnswer" placeholder="مثلاً: 3n - 2" autocomplete="off">
      </div>
      <div id="resultArea" class="result-area hidden"></div>
      <div class="question-actions">
        <button class="check-button" id="checkButton" onclick="checkAnswer()">بررسی پاسخ</button>
        <button class="solution-button hidden" id="solutionButton" onclick="showSolution()">مشاهده راه‌حل</button>
      </div>
      <div id="navigationArea" class="navigation-area hidden">
        <button onclick="previousQuestion()" class="nav-button secondary">← قبلی</button>
        <button onclick="nextQuestion()" class="nav-button">بعدی →</button>
      </div>
    </article>
  `;
}

/* =========================================
CHECK ANSWER
========================================= */
function checkAnswer() {
  const input = document.getElementById("userAnswer");
  const resultArea = document.getElementById("resultArea");
  const checkButton = document.getElementById("checkButton");
  const solutionButton = document.getElementById("solutionButton");
  const navigationArea = document.getElementById("navigationArea");

  const userAnswer = input.value.trim();

  if (!userAnswer) {
    resultArea.className = "result-area wrong";
    resultArea.innerHTML = "لطفاً یک پاسخ وارد کنید.";
    return;
  }

  const q = currentLesson.questions[currentQuestionIndex];
  const correct = normalizeAnswer(q.correctAnswer);
  const user = normalizeAnswer(userAnswer);
  const isCorrect = user === correct;

  if (isCorrect) {
    score += 10;
    resultArea.className = "result-area correct";
    resultArea.innerHTML = "<strong>آفرین!</strong><span>+10 XP</span>";
  } else {
    resultArea.className = "result-area wrong";
    resultArea.innerHTML = "<strong>پاسخ درست نیست.</strong>";
  }

  input.disabled = true;
  checkButton.disabled = true;
  solutionButton.classList.remove("hidden");
  navigationArea.classList.remove("hidden");
}

/* =========================================
SOLUTION
========================================= */
function showSolution() {
  const q = currentLesson.questions[currentQuestionIndex];
  const resultArea = document.getElementById("resultArea");

  resultArea.innerHTML += `
    <div class="solution-box">
      <div class="solution-title">راه‌حل</div>
      <p>${q.answer}</p>
      <p class="solution-text">${q.solution}</p>
    </div>
  `;

  document.getElementById("solutionButton").disabled = true;
}

/* =========================================
NAVIGATION
========================================= */
function nextQuestion() {
  if (currentQuestionIndex < currentLesson.questions.length - 1) {
    currentQuestionIndex++;
    renderCurrentQuestion();
  } else {
    showLessonResult();
  }
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
  }
}

/* =========================================
RESULT
========================================= */
function showLessonResult() {
  document.getElementById("questionsList").innerHTML = `
    <div class="lesson-result">
      <div class="result-icon">✓</div>
      <h2>درس تمام شد!</h2>
      <p>امتیاز شما</p>
      <strong>${score} XP</strong>
      <button onclick="restartLesson()">شروع دوباره</button>
    </div>
  `;
}

function restartLesson() {
  currentQuestionIndex = 0;
  score = 0;
  renderCurrentQuestion();
}

/* =========================================
NORMALIZE
========================================= */
function normalizeAnswer(answer) {
  return String(answer)
    .trim()
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/\s+/g, "")
    .toLowerCase();
}

/* =========================================
START
========================================= */
document.addEventListener("DOMContentLoaded", loadLesson);
