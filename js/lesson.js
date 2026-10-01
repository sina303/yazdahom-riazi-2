let currentLesson = null;
let currentQuestionIndex = 0;
let score = 0;
let currentQuestionAnswered = false;

/* =========================================
LOAD LESSON
========================================= */
async function loadLesson() {
  const questionsList = document.getElementById("questionsList");

  try {
    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get("lesson");

    if (!lessonId) {
      throw new Error("Lesson ID not found");
    }

    const response = await fetch("data/subjects.json");
    if (!response.ok) {
      throw new Error("Could not load data");
    }

    const data = await response.json();
    const hesaban = data.subjects.find((subject) => subject.id === "hesaban");

    let foundLesson = null;
    let foundChapter = null;

    for (const chapter of hesaban.chapters) {
      const lesson = chapter.lessons?.find((lesson) => lesson.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        foundChapter = chapter;
        break;
      }
    }

    if (!foundLesson) {
      throw new Error("Lesson not found");
    }

    currentLesson = foundLesson;

    document.getElementById("lessonNumber").textContent = `درس ${foundLesson.number}`;
    document.getElementById("lessonTitle").textContent = foundLesson.title;
    document.getElementById("lessonDescription").textContent = foundLesson.description;
    document.getElementById("breadcrumbLesson").textContent = foundLesson.title;
    document.getElementById("backToChapter").href = `chapter.html?chapter=${foundChapter.id}`;
    document.getElementById("questionCount").textContent = `${foundLesson.questions.length} سوال`;

    renderCurrentQuestion();
  } catch (error) {
    console.error(error);
    questionsList.innerHTML = `
      <div class="loading">
        خطا در بارگذاری درس.
      </div>
    `;
  }
}

/* =========================================
RENDER CURRENT QUESTION
========================================= */
function renderCurrentQuestion() {
  currentQuestionAnswered = false;
  const container = document.getElementById("questionsList");
  const questions = currentLesson.questions;

  if (!questions.length) {
    container.innerHTML = `
      <div class="loading">
        هنوز سوالی برای این درس ثبت نشده.
      </div>
    `;
    return;
  }

  const question = questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  container.innerHTML = `
    <article class="question-card">
      <div class="question-top">
        <span class="question-number">
          سوال ${currentQuestionIndex + 1} از ${questions.length}
        </span>
        <span class="difficulty">
          ${question.difficulty}
        </span>
      </div>

      <div class="question-progress">
        <div>
          <i style="width: ${progress}%"></i>
        </div>
      </div>

      <div class="question-text">
        ${question.question}
      </div>

      <div class="answer-input-area">
        <label for="userAnswer">
          پاسخ خود را وارد کنید
        </label>
        <input
          type="text"
          id="userAnswer"
          placeholder="مثلاً: 3n - 2"
          autocomplete="off"
        >
      </div>

      <div id="resultArea" class="result-area hidden"></div>

      <div class="question-actions">
        <button class="check-button" id="checkButton" onclick="checkAnswer()">
          بررسی پاسخ
        </button>
        <button class="solution-button hidden" id="solutionButton" onclick="showSolution()">
          مشاهده راه‌حل
        </button>
      </div>

      <div id="navigationArea" class="navigation-area hidden">
        <button onclick="previousQuestion()" class="nav-button secondary">
          ← قبلی
        </button>
        <button onclick="nextQuestion()" class="nav-button">
          بعدی →
        </button>
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
    resultArea.innerHTML = `لطفاً یک پاسخ وارد کنید.`;
    return;
  }

  const question = currentLesson.questions[currentQuestionIndex];
  const correctAnswer = normalizeAnswer(question.correctAnswer);
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const isCorrect = normalizedUserAnswer === correctAnswer;

  const user = registerAnswer(question.id, isCorrect);

  if (isCorrect) {
    score += 10;
    resultArea.className = "result-area correct";
    resultArea.innerHTML = `
      <strong>آفرین!</strong>
      <span>+10 XP</span>
      <span>XP کل: ${user.xp}</span>
    `;
  } else {
    resultArea.className = "result-area wrong";
    resultArea.innerHTML = `
      <strong>پاسخ درست نیست.</strong>
      <span>XP کل: ${user.xp}</span>
    `;
  }

  currentQuestionAnswered = true;
  input.disabled = true;
  checkButton.disabled = true;
  solutionButton.classList.remove("hidden");
  navigationArea.classList.remove("hidden");
}

/* =========================================
SHOW SOLUTION
========================================= */
function showSolution() {
  const question = currentLesson.questions[currentQuestionIndex];
  const resultArea = document.getElementById("resultArea");

  resultArea.innerHTML += `
    <div class="solution-box">
      <div class="solution-title">راه‌حل</div>
      <p>${question.answer}</p>
      <p class="solution-text">${question.solution}</p>
    </div>
  `;

  document.getElementById("solutionButton").disabled = true;
}

/* =========================================
NEXT QUESTION
========================================= */
function nextQuestion() {
  if (currentQuestionIndex < currentLesson.questions.length - 1) {
    currentQuestionIndex++;
    renderCurrentQuestion();
  } else {
    showLessonResult();
  }
}

/* =========================================
PREVIOUS QUESTION
========================================= */
function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderCurrentQuestion();
  }
}

/* =========================================
LESSON RESULT
========================================= */
function showLessonResult() {
  const container = document.getElementById("questionsList");
  container.innerHTML = `
    <div class="lesson-result">
      <div class="result-icon">✓</div>
      <h2>درس تمام شد!</h2>
      <p>امتیاز شما</p>
      <strong>${score} XP</strong>
      <button onclick="restartLesson()">شروع دوباره</button>
    </div>
  `;
}

/* =========================================
RESTART
========================================= */
function restartLesson() {
  currentQuestionIndex = 0;
  score = 0;
  renderCurrentQuestion();
}

/* =========================================
NORMALIZE ANSWER
========================================= */
function normalizeAnswer(answer) {
  return String(answer)
    .trim()
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    .replace(/\s+/g, "")
    .toLowerCase();
}

/* =========================================
START
========================================= */
document.addEventListener("DOMContentLoaded", loadLesson);
