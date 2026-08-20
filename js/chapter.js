/* =========================================
   CHAPTER PAGE
   Yazdahom Plus
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadChapter();
});


/* =========================================
   LOAD CHAPTER
========================================= */

async function loadChapter() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const chapterId =
            params.get("chapter");


        if (!chapterId) {

            showChapterError(
                "شناسه فصل پیدا نشد."
            );

            return;

        }


        const response =
            await fetch(
                "data/subjects.json"
            );


        if (!response.ok) {

            throw new Error(
                "فایل اطلاعات دروس قابل دریافت نیست."
            );

        }


        const data =
            await response.json();


        if (
            !data ||
            !Array.isArray(data.subjects)
        ) {

            throw new Error(
                "ساختار subjects.json صحیح نیست."
            );

        }


        /* -----------------------------
           Find Hesaban
        ----------------------------- */

        const hesaban =
            data.subjects.find(
                subject =>
                    subject.id === "hesaban"
            );


        if (!hesaban) {

            throw new Error(
                "درس حسابان پیدا نشد."
            );

        }


        /* -----------------------------
           Find Chapter
        ----------------------------- */

        const chapter =
            hesaban.chapters?.find(
                item =>
                    item.id === chapterId
            );


        if (!chapter) {

            throw new Error(
                "فصل موردنظر پیدا نشد."
            );

        }


        /* -----------------------------
           Render
        ----------------------------- */

        renderChapter(
            chapter
        );


    } catch (error) {

        console.error(
            "Chapter error:",
            error
        );


        showChapterError(
            error.message
        );

    }

}


/* =========================================
   RENDER CHAPTER
========================================= */

function renderChapter(
    chapter
) {

    const title =
        document.getElementById(
            "chapterTitle"
        );


    const description =
        document.getElementById(
            "chapterDescription"
        );


    const count =
        document.getElementById(
            "lessonCount"
        );


    const breadcrumb =
        document.getElementById(
            "breadcrumbChapter"
        );


    /* -----------------------------
       Title
    ----------------------------- */

    if (title) {

        title.textContent =
            chapter.title ||
            "فصل حسابان";

    }


    /* -----------------------------
       Description
    ----------------------------- */

    if (description) {

        description.textContent =
            chapter.description ||
            "محتوای این فصل را مطالعه کن.";

    }


    /* -----------------------------
       Breadcrumb
    ----------------------------- */

    if (breadcrumb) {

        breadcrumb.textContent =
            chapter.title ||
            "فصل";

    }


    /* -----------------------------
       Lessons
    ----------------------------- */

    const lessons =
        Array.isArray(
            chapter.lessons
        )
            ? chapter.lessons
            : [];


    if (count) {

        count.textContent =
            lessons.length;

    }


    renderLessons(
        lessons
    );


    /* -----------------------------
       Page title
    ----------------------------- */

    document.title =
        `${chapter.title || "فصل حسابان"} | یازدهم‌پلاس`;

}


/* =========================================
   RENDER LESSONS
========================================= */

function renderLessons(
    lessons
) {

    const container =
        document.getElementById(
            "lessonsContainer"
        );


    if (!container) {
        return;
    }


    /* -----------------------------
       Empty
    ----------------------------- */

    if (lessons.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📚
                </div>

                <h3>
                    هنوز درسی اضافه نشده
                </h3>

                <p>
                    محتوای این فصل به‌زودی اضافه می‌شود.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    /* -----------------------------
       Create lesson cards
    ----------------------------- */

    lessons.forEach(
        (lesson, index) => {

            const card =
                createLessonCard(
                    lesson,
                    index + 1
                );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   LESSON CARD
========================================= */

function createLessonCard(
    lesson,
    number
) {

    const link =
        document.createElement(
            "a"
        );


    link.className =
        "lesson-card";


    link.href =
        `lesson.html?lesson=${encodeURIComponent(
            lesson.id
        )}`;


    const title =
        lesson.title ||
        `درس ${number}`;


    const description =
        lesson.description ||
        "مشاهده محتوای درس";


    link.innerHTML = `

        <div class="lesson-number">

            ${String(number).padStart(2, "0")}

        </div>


        <div class="lesson-icon">

            ∫

        </div>


        <div class="lesson-content">

            <span>
                درس ${number}
            </span>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>

        </div>


        <div class="lesson-arrow">

            ←

        </div>

    `;


    return link;

}


/* =========================================
   ERROR
========================================= */

function showChapterError(
    message
) {

    const container =
        document.getElementById(
            "lessonsContainer"
        );


    const error =
        document.getElementById(
            "chapterError"
        );


    if (container) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    خطا در بارگذاری فصل
                </h3>

                <p>
                    ${escapeHTML(
                        message ||
                        "مشکلی رخ داد."
                    )}
                </p>

            </div>

        `;

    }


    if (error) {

        error.textContent =
            message || "";

        error.style.display =
            "block";

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
