/* =========================================
   LESSON PAGE
   Yazdahom Plus
========================================= */

let currentLesson = null;
let currentChapter = null;
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    initializeLesson();
});


/* =========================================
   INITIALIZE
========================================= */

async function initializeLesson() {

    try {

        /*
         * Get lesson ID from URL
         *
         * Example:
         * lesson.html?lesson=lesson-1
         */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const lessonId =
            params.get("lesson");


        if (!lessonId) {

            throw new Error(
                "شناسه درس پیدا نشد."
            );

        }


        /* -----------------------------
           Load data
        ----------------------------- */

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
           Find lesson
        ----------------------------- */

        let foundLesson = null;
        let foundChapter = null;


        const chapters =
            Array.isArray(
                hesaban.chapters
            )
                ? hesaban.chapters
                : [];


        for (
            const chapter of chapters
        ) {

            const lessons =
                Array.isArray(
                    chapter.lessons
                )
                    ? chapter.lessons
                    : [];


            const lesson =
                lessons.find(
                    item =>
                        item.id === lessonId
                );


            if (lesson) {

                foundLesson =
                    lesson;

                foundChapter =
                    chapter;

                break;

            }

        }


        if (!foundLesson) {

            throw new Error(
                "درس موردنظر پیدا نشد."
            );

        }


        /* -----------------------------
           Save current data
        ----------------------------- */

        currentLesson =
            foundLesson;

        currentChapter =
            foundChapter;


        /* -----------------------------
           User
        ----------------------------- */

        if (
            typeof getUser === "function"
        ) {

            currentUser =
                getUser();

        }


        /* -----------------------------
           Render
        ----------------------------- */

        renderLesson(
            currentLesson,
            currentChapter
        );


        /* -----------------------------
           Events
        ----------------------------- */

        setupLessonEvents();


    } catch (error) {

        console.error(
            "Lesson error:",
            error
        );


        showLessonError(
            error.message
        );

    }

}


/* =========================================
   RENDER LESSON
========================================= */

function renderLesson(
    lesson,
    chapter
) {

    /* ---------------------------------
       Title
    --------------------------------- */

    const title =
        document.getElementById(
            "lessonTitle"
        );


    if (title) {

        title.textContent =
            lesson.title ||
            "درس حسابان";

    }


    /* ---------------------------------
       Description
    --------------------------------- */

    const description =
        document.getElementById(
            "lessonDescription"
        );


    if (description) {

        description.textContent =
            lesson.description ||
            "محتوای این درس را مطالعه کن.";

    }


    /* ---------------------------------
       Lesson number
    --------------------------------- */

    const number =
        document.getElementById(
            "lessonNumber"
        );


    if (number) {

        number.textContent =
            lesson.number
                ? `درس ${lesson.number}`
                : "درس";

    }


    /* ---------------------------------
       Breadcrumb
    --------------------------------- */

    const breadcrumb =
        document.getElementById(
            "lessonBreadcrumb"
        );


    if (breadcrumb) {

        breadcrumb.textContent =
            lesson.title ||
            "درس";

    }


    /* ---------------------------------
       Chapter link
    --------------------------------- */

    const chapterLink =
        document.getElementById(
            "chapterLink"
        );


    if (chapterLink) {

        chapterLink.textContent =
            chapter.title ||
            "فصل";


        chapterLink.href =
            `chapter.html?chapter=${encodeURIComponent(
                chapter.id
            )}`;

    }


    /* ---------------------------------
       Page title
    --------------------------------- */

    document.title =
        `${lesson.title || "درس"} | یازدهم‌پلاس`;


    /* ---------------------------------
       Content
    --------------------------------- */

    renderLessonContent(
        lesson
    );


    /* ---------------------------------
       Exercises
    --------------------------------- */

    renderExercises(
        lesson.exercises
    );


    /* ---------------------------------
       Progress
    --------------------------------- */

    updateLessonProgress(
        lesson.id
    );

}


/* =========================================
   LESSON CONTENT
========================================= */

function renderLessonContent(
    lesson
) {

    const container =
        document.getElementById(
            "lessonContent"
        );


    if (!container) {
        return;
    }


    /*
     * Support both:
     *
     * lesson.content
     *
     * lesson.sections
     */

    if (
        Array.isArray(
            lesson.sections
        ) &&
        lesson.sections.length > 0
    ) {

        container.innerHTML = "";


        lesson.sections.forEach(
            section => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "content-block";


                if (section.title) {

                    const heading =
                        document.createElement(
                            "h3"
                        );


                    heading.textContent =
                        section.title;


                    element.appendChild(
                        heading
                    );

                }


                if (section.text) {

                    const paragraph =
                        document.createElement(
                            "p"
                        );


                    paragraph.textContent =
                        section.text;


                    element.appendChild(
                        paragraph
                    );

                }


                container.appendChild(
                    element
                );

            }
        );


        return;

    }


    if (
        lesson.content &&
        typeof lesson.content === "string"
    ) {

        container.innerHTML =
            formatLessonText(
                lesson.content
            );

        return;

    }


    container.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                📖
            </div>

            <h3>
                محتوای این درس هنوز آماده نیست
            </h3>

            <p>
                محتوای آموزشی این درس به‌زودی اضافه می‌شود.
            </p>

        </div>

    `;

}


/* =========================================
   FORMAT TEXT
========================================= */

function formatLessonText(
    text
) {

    return escapeHTML(text)

        .replace(
            /\n\n/g,
            "</p><p>"
        )

        .replace(
            /\n/g,
            "<br>"
        )

        .replace(
            /^/,
            "<p>"
        )

        .replace(
            /$/,
            "</p>"
        );

}


/* =========================================
   EXERCISES
========================================= */

function renderExercises(
    exercises
) {

    const container =
        document.getElementById(
            "exercisesContainer"
        );


    if (!container) {
        return;
    }


    const list =
        Array.isArray(exercises)
            ? exercises
            : [];


    if (list.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✏️
                </div>

                <h3>
                    هنوز تمرینی برای این درس ثبت نشده
                </h3>

                <p>
                    تمرین‌های این درس به‌زودی اضافه می‌شوند.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    list.forEach(
        (exercise, index) => {

            const card =
                createExerciseCard(
                    exercise,
                    index + 1
                );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   EXERCISE CARD
========================================= */

function createExerciseCard(
    exercise,
    number
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "exercise-card";


    const question =
        exercise.question ||
        `تمرین ${number}`;


    article.innerHTML = `

        <div class="exercise-number">

            تمرین ${number}

        </div>


        <div class="exercise-question">

            ${escapeHTML(question)}

        </div>

    `;


    if (
        exercise.answer
    ) {

        const answerButton =
            document.createElement(
                "button"
            );


        answerButton.type =
            "button";


        answerButton.className =
            "answer-button";


        answerButton.textContent =
            "نمایش پاسخ";


        const answer =
            document.createElement(
                "div"
            );


        answer.className =
            "exercise-answer";


        answer.hidden =
            true;


        answer.textContent =
            exercise.answer;


        answerButton.addEventListener(
            "click",
            () => {

                const isHidden =
                    answer.hidden;


                answer.hidden =
                    !isHidden;


                answerButton.textContent =
                    isHidden
                        ? "پنهان کردن پاسخ"
                        : "نمایش پاسخ";

            }
        );


        article.appendChild(
            answerButton
        );


        article.appendChild(
            answer
        );

    }


    return article;

}


/* =========================================
   PROGRESS
========================================= */

function updateLessonProgress(
    lessonId
) {

    let completed = false;


    if (
        currentUser &&
        currentUser.progress &&
        Array.isArray(
            currentUser.progress.completedLessons
        )
    ) {

        completed =
            currentUser.progress.completedLessons
                .includes(
                    lessonId
                );

    }


    const percent =
        completed
            ? 100
            : 0;


    const progressPercent =
        document.getElementById(
            "progressPercent"
        );


    const progressFill =
        document.getElementById(
            "progressFill"
        );


    if (progressPercent) {

        progressPercent.textContent =
            `${percent}%`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${percent}%`;

    }


    const button =
        document.getElementById(
            "completeLessonButton"
        );


    if (button) {

        if (completed) {

            button.textContent =
                "درس تکمیل شده ✓";


            button.classList.add(
                "completed"
            );

        }

    }

}


/* =========================================
   EVENTS
========================================= */

function setupLessonEvents() {

    const button =
        document.getElementById(
            "completeLessonButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            completeCurrentLesson
        );

    }

}


/* =========================================
   COMPLETE LESSON
========================================= */

function completeCurrentLesson() {

    if (!currentLesson) {
        return;
    }


    if (
        typeof getUser !== "function" ||
        typeof saveUser !== "function"
    ) {

        console.warn(
            "User system is not available."
        );

        return;

    }


    let user =
        getUser();


    if (!user) {

        return;

    }


    if (!user.progress) {

        user.progress = {

            completedLessons: []

        };

    }


    if (
        !Array.isArray(
            user.progress.completedLessons
        )
    ) {

        user.progress.completedLessons =
            [];

    }


    const lessonId =
        currentLesson.id;


    const alreadyCompleted =
        user.progress.completedLessons
            .includes(
                lessonId
            );


    if (!alreadyCompleted) {

        user.progress.completedLessons.push(
            lessonId
        );


        /*
         * XP reward
         */

        const reward =
            Number(
                currentLesson.xp || 20
            );


        user.xp =
            Number(
                user.xp || 0
            ) + reward;


        /*
         * Save
         */

        saveUser(
            user
        );


        currentUser =
            user;

    }


    updateLessonProgress(
        lessonId
    );

}


/* =========================================
   ERROR
========================================= */

function showLessonError(
    message
) {

    const content =
        document.getElementById(
            "lessonContent"
        );


    const exercises =
        document.getElementById(
            "exercisesContainer"
        );


    const error =
        document.getElementById(
            "lessonError"
        );


    if (content) {

        content.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    خطا در بارگذاری درس
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


    if (exercises) {

        exercises.innerHTML = "";

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
