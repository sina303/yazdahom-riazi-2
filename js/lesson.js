/* =========================================
   LESSON PAGE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadLesson();
});


/* =========================================
   LOAD LESSON
========================================= */

async function loadLesson() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );

        const lessonId =
            params.get("lesson");


        if (!lessonId) {
            throw new Error("Lesson ID not found");
        }


        const response =
            await fetch("data/subjects.json");


        if (!response.ok) {
            throw new Error("Could not load subjects.json");
        }


        const data =
            await response.json();


        if (
            !data ||
            !Array.isArray(data.subjects)
        ) {
            throw new Error("Invalid subjects data");
        }


        const hesaban =
            data.subjects.find(
                subject =>
                    subject.id === "hesaban"
            );


        if (!hesaban) {
            throw new Error("Hesaban not found");
        }


        let foundLesson = null;
        let foundChapter = null;


        /* -----------------------------
           Find lesson
        ----------------------------- */

        for (const chapter of hesaban.chapters || []) {

            const lesson =
                (chapter.lessons || []).find(
                    item =>
                        item.id === lessonId
                );


            if (lesson) {

                foundLesson = lesson;
                foundChapter = chapter;

                break;
            }

        }


        if (!foundLesson) {
            throw new Error("Lesson not found");
        }


        /* -----------------------------
           Render lesson
        ----------------------------- */

        renderLesson(
            foundLesson,
            foundChapter
        );


    } catch (error) {

        console.error(
            "Lesson loading error:",
            error
        );


        showLessonError(error.message);

    }

}


/* =========================================
   RENDER LESSON
========================================= */

function renderLesson(
    lesson,
    chapter
) {

    const title =
        document.getElementById(
            "lessonTitle"
        );

    const description =
        document.getElementById(
            "lessonDescription"
        );

    const infoTitle =
        document.getElementById(
            "lessonInfoTitle"
        );

    const infoDescription =
        document.getElementById(
            "lessonInfoDescription"
        );

    const breadcrumbChapter =
        document.getElementById(
            "breadcrumbChapter"
        );

    const breadcrumbLesson =
        document.getElementById(
            "breadcrumbLesson"
        );


    /* -----------------------------
       Title
    ----------------------------- */

    if (title) {

        title.textContent =
            lesson.title || "درس";

    }


    /* -----------------------------
       Description
    ----------------------------- */

    if (description) {

        description.textContent =
            lesson.description || "";

    }


    if (infoTitle) {

        infoTitle.textContent =
            lesson.title || "درس";

    }


    if (infoDescription) {

        infoDescription.textContent =
            lesson.description || "";

    }


    /* -----------------------------
       Breadcrumb
    ----------------------------- */

    if (breadcrumbChapter) {

        breadcrumbChapter.textContent =
            chapter.title || "فصل";

    }


    if (breadcrumbLesson) {

        breadcrumbLesson.textContent =
            lesson.title || "درس";

    }


    /* -----------------------------
       Page title
    ----------------------------- */

    document.title =
        `${lesson.title} | یازدهم‌پلاس`;


    /* -----------------------------
       Questions
    ----------------------------- */

    renderBookQuestions(
        lesson.bookQuestions || []
    );


    renderCustomQuestions(
        lesson.customQuestions || []
    );


    /* -----------------------------
       Section buttons
    ----------------------------- */

    setupSectionButtons();

}


/* =========================================
   BOOK QUESTIONS
========================================= */

function renderBookQuestions(
    questions
) {

    const container =
        document.getElementById(
            "bookQuestions"
        );

    const count =
        document.getElementById(
            "bookCount"
        );


    if (!container) {
        return;
    }


    if (count) {

        count.textContent =
            `${questions.length} سؤال`;

    }


    if (
        !Array.isArray(questions) ||
        questions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div style="font-size:32px;">
                    📖
                </div>

                <p style="margin-top:10px;">
                    هنوز سؤال کتابی برای این درس
                    اضافه نشده است.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    questions.forEach(
        (question, index) => {

            container.appendChild(
                createQuestionCard(
                    question,
                    index + 1
                )
            );

        }
    );

}


/* =========================================
   CUSTOM QUESTIONS
========================================= */

function renderCustomQuestions(
    questions
) {

    const container =
        document.getElementById(
            "customQuestions"
        );

    const count =
        document.getElementById(
            "customCount"
        );


    if (!container) {
        return;
    }


    if (count) {

        count.textContent =
            `${questions.length} سؤال`;

    }


    if (
        !Array.isArray(questions) ||
        questions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div style="font-size:32px;">
                    ✏️
                </div>

                <p style="margin-top:10px;">
                    هنوز تمرین تألیفی برای این درس
                    اضافه نشده است.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    questions.forEach(
        (question, index) => {

            container.appendChild(
                createQuestionCard(
                    question,
                    index + 1
                )
            );

        }
    );

}


/* =========================================
   QUESTION CARD
========================================= */

function createQuestionCard(
    question,
    number
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "question-card";


    const questionText =
        question.question ||
        question.text ||
        question.title ||
        "متن سؤال ثبت نشده است";


    const answer =
        question.answer ||
        question.solution ||
        "";


    card.innerHTML = `

        <div class="question-number">

            سؤال ${number}

        </div>


        <div class="question-text">

            ${escapeHTML(questionText)}

        </div>

    `;


    if (answer) {

        const answerBox =
            document.createElement(
                "div"
            );


        answerBox.className =
            "question-answer";


        answerBox.innerHTML = `

            <strong>
                پاسخ:
            </strong>

            <span>
                ${escapeHTML(answer)}
            </span>

        `;


        card.appendChild(
            answerBox
        );

    }


    return card;

}


/* =========================================
   SECTION BUTTONS
========================================= */

function setupSectionButtons() {

    const buttons =
        document.querySelectorAll(
            ".content-type"
        );


    const sections = {

        book:
            document.getElementById(
                "bookSection"
            ),

        custom:
            document.getElementById(
                "customSection"
            ),

        exam:
            document.getElementById(
                "examSection"
            )

    };


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const section =
                    button.dataset.section;


                buttons.forEach(
                    item => {
                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                Object.values(sections)
                    .forEach(element => {

                        if (element) {

                            element.classList.add(
                                "hidden"
                            );

                        }

                    });


                if (
                    sections[section]
                ) {

                    sections[section]
                        .classList.remove(
                            "hidden"
                        );

                }

            }
        );

    });

}


/* =========================================
   ERROR
========================================= */

function showLessonError(
    message
) {

    const title =
        document.getElementById(
            "lessonTitle"
        );

    const description =
        document.getElementById(
            "lessonDescription"
        );


    if (title) {

        title.textContent =
            "خطا در بارگذاری درس";

    }


    if (description) {

        description.textContent =
            message ||
            "مشکلی در دریافت اطلاعات درس رخ داد.";

    }


    const containers = [

        document.getElementById(
            "bookQuestions"
        ),

        document.getElementById(
            "customQuestions"
        )

    ];


    containers.forEach(
        container => {

            if (container) {

                container.innerHTML = `

                    <div class="empty-state">

                        ⚠️

                        <p style="margin-top:10px;">
                            اطلاعات درس قابل دریافت نیست.
                        </p>

                    </div>

                `;

            }

        }
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
