/* =========================================
   AXIS — CHAPTER PAGE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadChapter();

    }
);


/* =========================================
   GET CHAPTER ID
========================================= */

function getChapterId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


/* =========================================
   LOAD CHAPTER
========================================= */

async function loadChapter() {

    try {

        const chapterId =
            getChapterId();


        if (!chapterId) {

            throw new Error(
                "شناسه فصل پیدا نشد."
            );

        }


        const response =
            await fetch(
                "data/subjects.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const rawText =
            await response.text();


        const cleanedText =
            cleanJSON(
                rawText
            );


        let data;


        try {

            data =
                JSON.parse(
                    cleanedText
                );

        } catch (error) {

            console.error(
                "JSON ERROR:",
                error
            );

            console.error(
                "RAW JSON:",
                rawText
            );

            throw new Error(
                "ساختار subjects.json معتبر نیست."
            );

        }


        if (
            !Array.isArray(
                data.subjects
            )
        ) {

            throw new Error(
                "subjects در فایل JSON پیدا نشد."
            );

        }


        /*
         * پیدا کردن حسابان
         */

        const hesaban =
            data.subjects.find(
                subject =>
                    subject.id ===
                    "hesaban"
            );


        if (!hesaban) {

            throw new Error(
                "حسابان در subjects.json پیدا نشد."
            );

        }


        /*
         * پیدا کردن فصل
         */

        const chapter =
            hesaban.chapters?.find(
                item =>
                    item.id ===
                    chapterId
            );


        if (!chapter) {

            throw new Error(
                "فصل مورد نظر پیدا نشد."
            );

        }


        console.log(
            "Chapter loaded:",
            chapter
        );


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
        chapter.title ||
        "فصل";


    const description =
        chapter.description ||
        "درس‌های این فصل";


    /*
     * Title
     */

    setText(
        "chapterTitle",
        title
    );


    /*
     * Description
     */

    setText(
        "chapterDescription",
        description
    );


    /*
     * Breadcrumb
     */

    setText(
        "breadcrumbChapter",
        title
    );


    /*
     * Chapter number
     */

    const numberElement =
        document.querySelector(
            ".chapter-number-large"
        );


    if (numberElement) {

        numberElement.textContent =
            getChapterNumber(
                chapter
            );

    }


    /*
     * Lessons
     */

    const container =
        document.getElementById(
            "lessons"
        );


    if (!container) {

        console.warn(
            "lessons container پیدا نشد."
        );

        return;

    }


    container.innerHTML =
        "";


    const lessons =
        Array.isArray(
            chapter.lessons
        )
            ? chapter.lessons
            : [];


    if (
        lessons.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                هنوز درسی برای این فصل اضافه نشده است.

            </div>

        `;

        return;

    }


    lessons.forEach(
        (lesson, index) => {

            const card =
                createLessonCard(
                    lesson,
                    index
                );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CREATE LESSON CARD
========================================= */

function createLessonCard(
    lesson,
    index
) {

    const link =
        document.createElement(
            "a"
        );


    link.className =
        "lesson-card";


    link.href =
        `lesson.html?id=${encodeURIComponent(
            lesson.id
        )}`;


    /*
     * وضعیت فعلی کاربر
     */

    const completed =
        isLessonCompleted(
            lesson.id
        );


    if (completed) {

        link.classList.add(
            "completed"
        );

    }


    const number =
        String(
            index + 1
        ).padStart(
            2,
            "0"
        );


    const statusText =
        completed
            ? "کامل شده"
            : "شروع نشده";


    link.innerHTML = `

        <div class="lesson-number">

            ${number}

        </div>


        <div class="lesson-card-content">

            <h3>

                ${escapeHTML(
                    lesson.title ||
                    `درس ${index + 1}`
                )}

            </h3>


            <p>

                ${escapeHTML(
                    lesson.description ||
                    "آموزش و مطالب این درس"
                )}

            </p>

        </div>


        <div class="lesson-card-status">

            ${statusText}

        </div>


        <div class="lesson-card-arrow">

            ←

        </div>

    `;


    return link;

}


/* =========================================
   CHECK COMPLETION
========================================= */

function isLessonCompleted(
    lessonId
) {

    try {

        const progress =
            JSON.parse(
                localStorage.getItem(
                    "axis_progress"
                )
            );


        if (
            !progress ||
            !Array.isArray(
                progress.completedLessons
            )
        ) {

            return false;

        }


        return progress.completedLessons.includes(
            lessonId
        );


    } catch {

        return false;

    }

}


/* =========================================
   CHAPTER NUMBER
========================================= */

function getChapterNumber(
    chapter
) {

    /*
     * اگر JSON شماره فصل داشته باشد
     */

    if (
        chapter.number !== undefined
    ) {

        return String(
            chapter.number
        ).padStart(
            2,
            "0"
        );

    }


    /*
     * تلاش از ID
     */

    const match =
        String(
            chapter.id
        ).match(
            /\d+/
        );


    if (match) {

        return String(
            match[0]
        ).padStart(
            2,
            "0"
        );

    }


    return "01";

}


/* =========================================
   CLEAN JSON
========================================= */

function cleanJSON(
    text
) {

    if (
        typeof text !== "string"
    ) {

        return "";

    }


    let result =
        text.trim();


    result =
        result.replace(
            /^```json\s*/i,
            ""
        );


    result =
        result.replace(
            /\s*```$/i,
            ""
        );


    return result.trim();

}


/* =========================================
   SET TEXT
========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* =========================================
   ERROR
========================================= */

function showChapterError(
    message
) {

    const container =
        document.getElementById(
            "lessons"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="error-state">

            <h3>
                خطا در بارگذاری فصل
            </h3>

            <p>
                ${escapeHTML(
                    message ||
                    "خطای ناشناخته"
                )}
            </p>

        </div>

    `;

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )

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
