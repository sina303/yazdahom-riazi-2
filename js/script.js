/* =========================================
HOME
========================================= */
function openSubject(subject) {
  if (subject === "hesaban") {
    window.location.href = "hesaban.html";
  }
}

function scrollToChapters() {
  const chapters = document.getElementById("chapters");
  if (chapters) chapters.scrollIntoView({ behavior: "smooth" });
}

/* =========================================
LOAD HESABAN
========================================= */
async function loadHesaban() {
  const chaptersGrid = document.getElementById("chaptersGrid");
  if (!chaptersGrid) return;

  try {
    const res = await fetch("data/subjects.json");
    const data = await res.json();
    const hesaban = data.subjects.find((s) => s.id === "hesaban");
    if (!hesaban) throw new Error("Hesaban not found");
    renderChapters(hesaban.chapters);
  } catch (e) {
    console.error(e);
    chaptersGrid.innerHTML = '<div class="loading">خطا در بارگذاری</div>';
  }
}

/* =========================================
RENDER CHAPTERS
========================================= */
function renderChapters(chapters) {
  const grid = document.getElementById("chaptersGrid");
  if (!grid) return;
  grid.innerHTML = "";

  chapters.forEach((ch) => {
    const card = document.createElement("div");
    card.className = "chapter-card";
    card.innerHTML = `
      <div class="chapter-number">${String(ch.number).padStart(2, "0")}</div>
      <div class="chapter-content">
        <h3>${ch.title}</h3>
        <p>${ch.description}</p>
        <div class="chapter-progress">
          <span>پیشرفت ${ch.progress}%</span>
          <div><i style="width: ${ch.progress}%"></i></div>
        </div>
      </div>
      <button onclick="openChapter('${ch.id}')">شروع →</button>
    `;
    grid.appendChild(card);
  });
}

/* =========================================
OPEN CHAPTER
========================================= */
function openChapter(chapterId) {
  window.location.href = "chapter.html?chapter=" + encodeURIComponent(chapterId);
}

/* =========================================
LOAD CHAPTER
========================================= */
async function loadChapter() {
  const lessonGrid = document.getElementById("lessonGrid");
  if (!lessonGrid) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const chapterId = params.get("chapter");

    if (!chapterId) throw new Error("Chapter ID not found");

    const res = await fetch("data/subjects.json");
    const data = await res.json();
    const hesaban = data.subjects.find((s) => s.id === "hesaban");
    if (!hesaban) throw new Error("Subject not found");

    const chapter = hesaban.chapters.find((c) => c.id === chapterId);
    if (!chapter) throw new Error("Chapter not found");

    const label = document.getElementById("chapterLabel");
    const title = document.getElementById("chapterTitle");
    const desc = document.getElementById("chapterDescription");
    const bread = document.getElementById("breadcrumbChapter");
    const progText = document.getElementById("chapterProgressText");
    const progBar = document.getElementById("chapterProgressBar");
    const count = document.getElementById("chapterLessonCount");

    if (label) label.textContent = "فصل " + chapter.number;
    if (title) title.textContent = chapter.title;
    if (desc) desc.textContent = chapter.description;
    if (bread) bread.textContent = chapter.title;
    if (progText) progText.textContent = chapter.progress + "%";
    if (progBar) progBar.style.width = chapter.progress + "%";
    if (count) count.textContent = (chapter.lessons?.length || 0) + " درس";

    renderLessons(chapter.lessons);
  } catch (e) {
    console.error(e);
    lessonGrid.innerHTML = '<div class="loading">خطا: ' + e.message + '</div>';
  }
}

/* =========================================
RENDER LESSONS
========================================= */
function renderLessons(lessons) {
  const grid = document.getElementById("lessonGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!lessons || lessons.length === 0) {
    grid.innerHTML = '<div class="loading">هنوز درسی ثبت نشده.</div>';
    return;
  }

  lessons.forEach((l) => {
    const card = document.createElement("article");
    card.className = "lesson-card";
    card.innerHTML = `
      <div class="lesson-icon">${String(l.number).padStart(2, "0")}</div>
      <div>
        <h3>${l.title}</h3>
        <p>${l.description}</p>
      </div>
      <button onclick="openLesson('${l.id}')">شروع →</button>
    `;
    grid.appendChild(card);
  });
}

/* =========================================
OPEN LESSON
========================================= */
function openLesson(lessonId) {
  window.location.href = "lesson.html?lesson=" + encodeURIComponent(lessonId);
}

/* =========================================
START
========================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadHesaban();
  loadChapter();
});
