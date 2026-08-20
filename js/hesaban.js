/* =========================================
   HESABAN PAGE
   Yazdahom Plus
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadHesaban();
});


/* =========================================
   LOAD HESABAN
========================================= */

async function loadHesaban() {

    try {

        const response = await fetch(
            "data/subjects.json"
        );


        if (!response.ok) {
            throw new Error(
                "فایل اطلاعات دروس قابل دریافت نیست."
            );
        }


        const data = await response.json();


        if (
            !data ||
            !Array.isArray(data.subjects)
        ) {
            throw new Error(
                "ساختار subjects.json صحیح نیست."
            );
        }


        /* ---------------------------------
           Find Hesaban
        --------------------------------- */

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


        /* ---------------------------------
           Chapters
        --------------------------------- */

        const chapters =
            Array.isArray(hesaban.chapters)
                ? hesaban.chapters
                : [];


        renderChapters(chapters);


        updateStatistics(chapters);


    } catch (error) {

        console.error(
            "Hesaban error:",
            error
        );


        showHesabanError(
            error.message
        );

    }

}


/* =========================================
   RENDER CHAPTERS
========================================= */

function renderChapters(
    chapters
) {

    const container =
        document.getElementById(
            "chaptersContainer"
        );


    if (!container) {
        return;
    }


    /* ---------------------------------
       Empty
    --------------------------------- */

    if (chapters.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📚
                </div>

                <h3>
                    هنوز فصلی اضافه نشده
                </h3>

                <p>
                    فصل‌های حسابان به‌زودی اضافه می‌شوند.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    /* ---------------------------------
       Create cards
    --------------------------------- */

    chapters.forEach(
        (chapter, index) => {

            const card =
                createChapterCard(
                    chapter,
                    index + 1
                );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CREATE CHAPTER CARD
========================================= */

function createChapterCard(
    chapter,
    number
) {

    const link =
        document.createElement("a");


    link.className =
        "chapter-card";


    link.href =
        `chapter.html?chapter=${encodeURIComponent(
            chapter.id
        )}`;


    const lessons =
        Array.isArray(chapter.lessons)
            ? chapter.lessons
            : [];


    const lessonCount =
        lessons.length;


    const title =
        chapter.title ||
        `فصل ${number}`;


    const description =
        chapter.description ||
        "مشاهده درس‌های این فصل";


    link.innerHTML = `

        <div class="chapter-number">

            ${String(number).padStart(2, "0")}

        </div>


        <div class="chapter-icon">

            ∫

        </div>


        <div class="chapter-content">

            <span>
                فصل ${number}
            </span>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(description)}
            </p>

            <small>
                ${lessonCount}
                درس
            </small>

        </div>


        <div class="chapter-arrow">

            ←

        </div>

    `;


    return link;

}


/* =========================================
   STATISTICS
========================================= */

function updateStatistics(
    chapters
) {

    const chapterCount =
        document.getElementById(
            "chapterCount"
        );


    const lessonCount =
        document.getElementById(
            "lessonCount"
        );


    const completedCount =
        document.getElementById(
            "completedCount"
        );


    /* ---------------------------------
       Chapter count
    --------------------------------- */

    if (chapterCount) {

        chapterCount.textContent =
            chapters.length;

    }


    /* ---------------------------------
       Total lessons
    --------------------------------- */

    let totalLessons = 0;


    chapters.forEach(
        chapter => {

            if (
                Array.isArray(
                    chapter.lessons
                )
            ) {

                totalLessons +=
                    chapter.lessons.length;

            }

        }
    );


    if (lessonCount) {

        lessonCount.textContent =
            totalLessons;

    }


    /* ---------------------------------
       Completed lessons
    --------------------------------- */

    let completedLessons = 0;


    const user =
        typeof getUser === "function"
            ? getUser()
            : null;


    if (
        user &&
        user.progress &&
        Array.isArray(
            user.progress.completedLessons
        )
    ) {

        completedLessons =
            user.progress.completedLessons.length;

    }


    if (completedCount) {

        completedCount.textContent =
            completedLessons;

    }

}


/* =========================================
   ERROR
========================================= */

function showHesabanError(
    message
) {

    const container =
        document.getElementById(
            "chaptersContainer"
        );


    const error =
        document.getElementById(
            "hesabanError"
        );


    if (container) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    خطا در بارگذاری حسابان
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
