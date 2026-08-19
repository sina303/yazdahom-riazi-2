/* =========================================
   CHAPTER PAGE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadChapterPage();

});


/* =========================================
   LOAD CHAPTER
========================================= */

async function loadChapterPage() {

    const lessonGrid =
        document.getElementById("lessonGrid");

    if (!lessonGrid) {
        return;
    }


    try {

        /* -----------------------------
           Get chapter ID from URL
        ----------------------------- */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const chapterId =
            params.get("chapter");


        if (!chapterId) {

            throw new Error(
                "Chapter ID not found"
            );

        }


        /* -----------------------------
           Load subjects.json
        ----------------------------- */

        const response =
            await fetch(
                "data/subjects.json"
            );


        if (!response.ok) {

            throw new Error(
                "subjects.json could not be loaded"
            );

        }


        const data =
            await response.json();


        /* -----------------------------
           Find Hesaban
        ----------------------------- */

        if (
            !data ||
            !Array.isArray(data.subjects)
        ) {

            throw new Error(
                "Invalid subjects.json structure"
            );

        }


        const hesaban =
            data.subjects.find(
                subject =>
                    subject.id === "hesaban"
            );


        if (!hesaban) {

            throw new Error(
                "Hesaban subject not found"
            );

        }


        /* -----------------------------
           Find Chapter
        ----------------------------- */

        if (
            !Array.isArray(
                hesaban.chapters
            )
        ) {

            throw new Error(
                "Chapters not found"
            );

        }


        const chapter =
            hesaban.chapters.find(
                item =>
                    item.id === chapterId
            );


        if (!chapter) {

            throw new Error(
                "Chapter not found"
            );

        }


        /* -----------------------------
           Update page information
        ----------------------------- */

        updateChapterInfo(chapter);


        /* -----------------------------
           Render lessons
        ----------------------------- */

        renderLessons(
            chapter.lessons || []
        );


    } catch (error) {

        console.error(
            "Chapter loading error:",
            error
        );


        lessonGrid.innerHTML = `

            <div class="loading">

                <div style="font-size:32px; margin-bottom:12px;">
                    ⚠️
                </div>

                <div>
                    خطا در بارگذاری درس‌ها
                </div>

                <small
                    style="
                        display:block;
                        margin-top:10px;
                        color:#8d9690;
                    "
                >
                    ${error.message}
                </small>

            </div>

        `;

    }

}


/* =========================================
   UPDATE CHAPTER INFO
========================================= */

function updateChapterInfo(chapter) {

    const chapterNumber =
        document.getElementById(
            "chapterNumber"
        );

    const chapterTitle =
        document.getElementById(
            "chapterTitle"
        );

    const chapterDescription =
        document.getElementById(
            "chapterDescription"
        );

    const breadcrumbChapter =
        document.getElementById(
            "breadcrumbChapter"
        );

    const progressText =
        document.getElementById(
            "progressText"
        );

    const progressFill =
        document.getElementById(
            "progressFill"
        );


    /* -----------------------------
       Number
    ----------------------------- */

    if (chapterNumber) {

        chapterNumber.textContent =
            String(
                chapter.number
            ).padStart(2, "0");

    }


    /* -----------------------------
       Title
    ----------------------------- */

    if (chapterTitle) {

        chapterTitle.textContent =
            chapter.title || "فصل";

    }


    /* -----------------------------
       Description
    ----------------------------- */

    if (chapterDescription) {

        chapterDescription.textContent =
            chapter.description || "";

    }


    /* -----------------------------
       Breadcrumb
    ----------------------------- */

    if (breadcrumbChapter) {

        breadcrumbChapter.textContent =
            chapter.title || "فصل";

    }


    /* -----------------------------
       Progress
    ----------------------------- */

    const progress =
        Number(chapter.progress) || 0;


    if (progressText) {

        progressText.textContent =
            `${progress}%`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${progress}%`;

    }

}


/* =========================================
   RENDER LESSONS
========================================= */

function renderLessons(lessons) {

    const lessonGrid =
        document.getElementById(
            "lessonGrid"
        );

    const lessonCount =
        document.getElementById(
            "lessonCount"
        );


    if (!lessonGrid) {
        return;
    }


    /* -----------------------------
       Update count
    ----------------------------- */

    if (lessonCount) {

        lessonCount.textContent =
            `${lessons.length} درس`;

    }


    /* -----------------------------
       Empty state
    ----------------------------- */

    if (
        !Array.isArray(lessons) ||
        lessons.length === 0
    ) {

        lessonGrid.innerHTML = `

            <div class="loading">

                هنوز درسی برای این فصل
                اضافه نشده است.

            </div>

        `;

        return;

    }


    /* -----------------------------
       Clear grid
    ----------------------------- */

    lessonGrid.innerHTML = "";


    /* -----------------------------
       Create lesson cards
    ----------------------------- */

    lessons.forEach(
        (lesson, index) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "lesson-card";


            const number =
                lesson.number ||
                index + 1;


            card.innerHTML = `

                <div class="lesson-icon">

                    ${String(number).padStart(2, "0")}

                </div>


                <div>

                    <h3>
                        ${escapeHTML(
                            lesson.title ||
                            "درس بدون عنوان"
                        )}
                    </h3>


                    <p>
                        ${escapeHTML(
                            lesson.description ||
                            "توضیحی برای این درس ثبت نشده است."
                        )}
                    </p>

                </div>


                <button
                    type="button"
                    data-lesson-id="${escapeHTML(
                        lesson.id || ""
                    )}"
                >
                    مطالعه →
                </button>

            `;


            /* -----------------------------
               Open lesson
            ----------------------------- */

            const button =
                card.querySelector(
                    "button"
                );


            if (button) {

                button.addEventListener(
                    "click",
                    () => {

                        const lessonId =
                            button.dataset.lessonId;


                        if (!lessonId) {

                            console.error(
                                "Lesson ID not found"
                            );

                            return;

                        }


                        openLesson(
                            lessonId
                        );

                    }
                );

            }


            lessonGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================
   OPEN LESSON
========================================= */

function openLesson(lessonId) {

    window.location.href =
        "lesson.html?lesson=" +
        encodeURIComponent(
            lessonId
        );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

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
