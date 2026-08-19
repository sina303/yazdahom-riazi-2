"use strict";

/* =========================================
   LESSON PAGE
   Yazdahom Riazi
========================================= */


/* =========================================
   USER ACCESS
========================================= */

function checkLessonAccess() {
    if (typeof getUser !== "function") {
        console.warn("getUser() پیدا نشد.");
        return true;
    }

    const user = getUser();

    const isLoginPage =
        window.location.pathname.endsWith("login.html");

    if (!user || !user.username) {
        if (!isLoginPage) {
            window.location.href = "login.html";
            return false;
        }
    }

    return true;
}


/* =========================================
   GET LESSON ID
========================================= */

function getLessonIdFromURL() {
    const params =
        new URLSearchParams(window.location.search);

    return params.get("lesson");
}


/* =========================================
   LOAD DATA
========================================= */

async function loadLesson() {

    const lessonContainer =
        document.getElementById("lessonContainer");

    if (!lessonContainer) {
        return;
    }

    try {

        const lessonId =
            getLessonIdFromURL();

        if (!lessonId) {
            throw new Error(
                "Lesson ID not found"
            );
        }


        const response =
            await fetch("data/subjects.json");


        if (!response.ok) {
            throw new Error(
                "Could not load subjects.json"
            );
        }


        const data =
            await response.json();


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
                "Hesaban not found"
            );
        }


        let foundLesson = null;
        let foundChapter = null;


        for (
            const chapter
            of hesaban.chapters || []
        ) {

            const lesson =
                (chapter.lessons || [])
                    .find(
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
            throw new Error(
                "Lesson not found"
            );
        }


        renderLesson(
            foundLesson,
            foundChapter
        );


    } catch (error) {

        console.error(
            "Lesson loading error:",
            error
        );


        lessonContainer.innerHTML = `
            <div class="loading">
                خطا در بارگذاری درس
            </div>
        `;
    }
}


/* =========================================
   RENDER LESSON
========================================= */

function renderLesson(
    lesson,
    chapter
) {

    const lessonContainer =
        document.getElementById(
            "lessonContainer"
        );


    if (!lessonContainer) {
        return;
    }


    const bookQuestions =
        Array.isArray(
            lesson.bookQuestions
        )
            ? lesson.bookQuestions
            : [];


    const customQuestions =
        Array.isArray(
            lesson.customQuestions
        )
            ? lesson.customQuestions
            : [];


    const oldQuestions =
        Array.isArray(
            lesson.questions
        )
            ? lesson.questions
            : [];


    lessonContainer.innerHTML = `

        <div class="lesson-hero">

            <div class="lesson-label">
                فصل ${chapter.number}
                • درس ${lesson.number}
            </div>


            <h1>
                ${escapeHTML(
                    lesson.title
                )}
            </h1>


            <p class="lesson-hero-description">
                ${escapeHTML(
                    lesson.description || ""
                )}
            </p>


            <div class="lesson-meta">

                <div class="lesson-meta-item">
                    صفحه:
                    <strong>
                        ${lesson.page || "-"}
                    </strong>
                </div>


                <div class="lesson-meta-item">
                    سؤالات کتاب:
                    <strong>
                        ${bookQuestions.length}
                    </strong>
                </div>


                <div class="lesson-meta-item">
                    تمرین‌های یازدهم‌پلاس:
                    <strong>
                        ${customQuestions.length}
                    </strong>
                </div>

            </div>

        </div>


        <div class="lesson-content">

            <div class="content-types">

                <button
                    class="content-type active"
                    type="button"
                    data-section="book"
                >

                    <div class="content-type-icon">
                        📖
                    </div>

                    <div class="content-type-text">

                        <span>
                            بخش اول
                        </span>

                        <h3>
                            سؤالات کتاب
                        </h3>

                        <p>
                            تمرین‌ها و سؤالات مرتبط
                            با کتاب درسی
                        </p>

                    </div>

                    <div class="content-type-arrow">
                        ←
                    </div>

                </button>


                <button
                    class="content-type"
                    type="button"
                    data-section="custom"
                >

                    <div class="content-type-icon">
                        ✏️
                    </div>

                    <div class="content-type-text">

                        <span>
                            بخش دوم
                        </span>

                        <h3>
                            تمرین‌های یازدهم‌پلاس
                        </h3>

                        <p>
                            سؤالات تألیفی و تمرین‌های
                            بیشتر
                        </p>

                    </div>

                    <div class="content-type-arrow">
                        ←
                    </div>

                </button>


                <button
                    class="content-type"
                    type="button"
                    data-section="exam"
                >

                    <div class="content-type-icon">
                        📝
                    </div>

                    <div class="content-type-text">

                        <span>
                            بخش سوم
                        </span>

                        <h3>
                            آزمون
                        </h3>

                        <p>
                            آزمون مخصوص این درس
                        </p>

                    </div>

                    <div class="content-type-arrow">
                        ←
                    </div>

                </button>

            </div>


            <section
                id="bookSection"
                class="lesson-section"
            >

                <div class="section-header">

                    <div>

                        <span class="section-header-label">
                            QUESTIONS
                        </span>

                        <h2>
                            سؤالات کتاب
                        </h2>

                        <p>
                            سؤالات مربوط به این درس
                        </p>

                    </div>


                    <div class="section-badge">
                        ${bookQuestions.length}
                        سؤال
                    </div>

                </div>


                <div
                    id="bookQuestions"
                    class="questions-list"
                >
                </div>

            </section>


            <section
                id="customSection"
                class="lesson-section hidden"
            >

                <div class="section-header">

                    <div>

                        <span class="section-header-label">
                            YAZDAHOM+
                        </span>

                        <h2>
                            تمرین‌های یازدهم‌پلاس
                        </h2>

                        <p>
                            سؤالات تألیفی برای تمرین بیشتر
                        </p>

                    </div>


                    <div class="section-badge">
                        ${customQuestions.length}
                        سؤال
                    </div>

                </div>


                <div
                    id="customQuestions"
                    class="questions-list"
                >
                </div>

            </section>


            <section
                id="oldQuestionsSection"
                class="lesson-section hidden"
            >

                <div class="section-header">

                    <div>

                        <span class="section-header-label">
                            QUESTIONS
                        </span>

                        <h2>
                            سؤالات
                        </h2>

                        <p>
                            سؤالات این درس
                        </p>

                    </div>


                    <div class="section-badge">
                        ${oldQuestions.length}
                        سؤال
                    </div>

                </div>


                <div
                    id="oldQuestions"
                    class="questions-list"
                >
                </div>

            </section>


            <section
                id="examSection"
                class="lesson-section hidden"
            >

                <div class="section-header">

                    <div>

                        <span class="section-header-label">
                            EXAM
                        </span>

                        <h2>
                            آزمون درس
                        </h2>

                        <p>
                            آزمون این بخش بعداً فعال می‌شود
                        </p>

                    </div>

                </div>


                <div class="exam-placeholder">

                    <div class="exam-placeholder-icon">
                        📝
                    </div>

                    <h3>
                        آزمون آماده نیست
                    </h3>

                    <p>
                        سیستم آزمون در مرحله بعدی
                        به این صفحه اضافه خواهد شد.
                    </p>

                </div>

            </section>


            <div class="lesson-back">

                <a
                    href="javascript:history.back()"
                >
                    → بازگشت
                </a>

            </div>


            <section
                id="aiAssistant"
                class="ai-assistant"
            >

                <div class="ai-header">

                    <div class="ai-header-icon">
                        🤖
                    </div>


                    <div class="ai-header-text">

                        <span>
                            AI ASSISTANT
                        </span>

                        <h2>
                            دستیار هوشمند
                        </h2>

                        <p>
                            سؤالت را بپرس یا تصویر سؤال
                            را برای حل ارسال کن.
                        </p>

                    </div>

                </div>


                <div class="ai-input-area">

                    <textarea
                        id="aiQuestion"
                        placeholder="سؤالت را اینجا بنویس..."
                    ></textarea>


                    <div class="ai-actions">

                        <label
                            class="ai-upload-button"
                            for="aiImageInput"
                        >
                            📷 ارسال تصویر
                        </label>


                        <input
                            id="aiImageInput"
                            type="file"
                            accept="image/*"
                            hidden
                        />


                        <button
                            id="aiSendButton"
                            class="ai-send-button"
                            type="button"
                        >
                            ارسال سؤال
                        </button>

                    </div>


                    <div
                        id="aiImagePreview"
                        class="ai-image-preview hidden"
                    >
                    </div>

                </div>


                <div
                    id="aiResponse"
                    class="ai-response hidden"
                >

                    <div class="ai-response-header">
                        پاسخ دستیار
                    </div>

                    <div
                        id="aiResponseContent"
                        class="ai-response-content"
                    >
                    </div>

                </div>

            </section>

        </div>
    `;


    renderQuestions(
        bookQuestions,
        "bookQuestions"
    );


    renderQuestions(
        customQuestions,
        "customQuestions"
    );


    renderQuestions(
        oldQuestions,
        "oldQuestions"
    );


    setupSectionButtons();


    setupAI();
}


/* =========================================
   RENDER QUESTIONS
========================================= */

function renderQuestions(
    questions,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(questions) ||
        questions.length === 0
    ) {

        container.innerHTML = `
            <div class="loading">
                هنوز سؤالی برای این بخش
                اضافه نشده است.
            </div>
        `;

        return;
    }


    questions.forEach(
        (question, index) => {

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
                "";


            const answer =
                question.answer ||
                question.solution ||
                "";


            const difficulty =
                question.difficulty ||
                "";


            const source =
                question.source ||
                "";


            let imageHTML = "";


            if (question.image) {

                imageHTML = `
                    <div class="question-image">

                        <img
                            src="${escapeAttribute(
                                question.image
                            )}"
                            alt="تصویر سؤال"
                        >

                    </div>
                `;
            }


            card.innerHTML = `

                <div class="question-top">

                    <span class="question-number">
                        سؤال ${index + 1}
                    </span>


                    ${
                        difficulty
                            ? `
                                <span class="question-difficulty">
                                    ${escapeHTML(
                                        difficulty
                                    )}
                                </span>
                            `
                            : ""
                    }

                </div>


                <div class="question-text math-content">
                    ${formatMath(
                        questionText
                    )}
                </div>


                ${imageHTML}


                ${
                    source
                        ? `
                            <div class="question-source">
                                منبع:
                                ${escapeHTML(
                                    source
                                )}
                            </div>
                        `
                        : ""
                }


                ${
                    answer
                        ? `
                            <button
                                type="button"
                                class="solution-button"
                                onclick="toggleAnswer(this)"
                            >
                                نمایش پاسخ
                            </button>


                            <div
                                class="answer hidden"
                            >

                                <div class="answer-title">
                                    پاسخ
                                </div>

                                <p class="solution math-content">
                                    ${formatMath(
                                        answer
                                    )}
                                </p>

                            </div>
                        `
                        : ""
                }

            `;


            container.appendChild(card);
        }
    );
}


/* =========================================
   TOGGLE ANSWER
========================================= */

function toggleAnswer(button) {

    const answer =
        button.nextElementSibling;


    if (!answer) {
        return;
    }


    const isHidden =
        answer.classList.contains(
            "hidden"
        );


    if (isHidden) {

        answer.classList.remove(
            "hidden"
        );

        button.textContent =
            "بستن پاسخ";

    } else {

        answer.classList.add(
            "hidden"
        );

        button.textContent =
            "نمایش پاسخ";
    }
}


/* =========================================
   SECTION BUTTONS
========================================= */

function setupSectionButtons() {

    const buttons =
        document.querySelectorAll(
            ".content-type"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    const section =
                        button.dataset.section;


                    hideAllLessonSections();


                    if (
                        section === "book"
                    ) {

                        showSection(
                            "bookSection"
                        );

                    }


                    if (
                        section === "custom"
                    ) {

                        showSection(
                            "customSection"
                        );

                    }


                    if (
                        section === "exam"
                    ) {

                        showSection(
                            "examSection"
                        );
                    }

                }
            );
        }
    );
}


/* =========================================
   HIDE SECTIONS
========================================= */

function hideAllLessonSections() {

    const sections =
        document.querySelectorAll(
            ".lesson-section"
        );


    sections.forEach(
        section => {

            section.classList.add(
                "hidden"
            );

        }
    );
}


/* =========================================
   SHOW SECTION
========================================= */

function showSection(id) {

    const section =
        document.getElementById(id);


    if (!section) {
        return;
    }


    section.classList.remove(
        "hidden"
    );
}


/* =========================================
   AI
========================================= */

function setupAI() {

    const sendButton =
        document.getElementById(
            "aiSendButton"
        );


    const imageInput =
        document.getElementById(
            "aiImageInput"
        );


    if (imageInput) {

        imageInput.addEventListener(
            "change",
            handleAIImage
        );
    }


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendAIQuestion
        );
    }
}


/* =========================================
   AI IMAGE
========================================= */

function handleAIImage(event) {

    const file =
        event.target.files[0];


    const preview =
        document.getElementById(
            "aiImagePreview"
        );


    if (!file || !preview) {
        return;
    }


    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        alert(
            "لطفاً یک فایل تصویری انتخاب کن."
        );

        return;
    }


    const reader =
        new FileReader();


    reader.onload = function () {

        preview.innerHTML = `

            <img
                src="${reader.result}"
                alt="تصویر سؤال"
            >

            <button
                type="button"
                id="removeAIImage"
            >
                حذف تصویر
            </button>

        `;


        preview.classList.remove(
            "hidden"
        );


        const removeButton =
            document.getElementById(
                "removeAIImage"
            );


        if (removeButton) {

            removeButton.addEventListener(
                "click",
                removeAIImage
            );
        }

    };


    reader.readAsDataURL(file);
}


/* =========================================
   REMOVE AI IMAGE
========================================= */

function removeAIImage() {

    const input =
        document.getElementById(
            "aiImageInput"
        );


    const preview =
        document.getElementById(
            "aiImagePreview"
        );


    if (input) {
        input.value = "";
    }


    if (preview) {

        preview.innerHTML = "";

        preview.classList.add(
            "hidden"
        );
    }
}


/* =========================================
   SEND AI QUESTION
========================================= */

async function sendAIQuestion() {

    const textarea =
        document.getElementById(
            "aiQuestion"
        );


    const responseBox =
        document.getElementById(
            "aiResponse"
        );


    const responseContent =
        document.getElementById(
            "aiResponseContent"
        );


    const imageInput =
        document.getElementById(
            "aiImageInput"
        );


    if (
        !textarea ||
        !responseBox ||
        !responseContent
    ) {
        return;
    }


    const question =
        textarea.value.trim();


    const imageFile =
        imageInput &&
        imageInput.files
            ? imageInput.files[0]
            : null;


    if (!question && !imageFile) {

        alert(
            "اول سؤال یا تصویر سؤال را وارد کن."
        );

        return;
    }


    responseBox.classList.remove(
        "hidden"
    );


    responseContent.innerHTML = `
        <div class="ai-thinking">
            در حال بررسی سؤال...
        </div>
    `;


    try {

        const formData =
            new FormData();


        formData.append(
            "question",
            question
        );


        if (imageFile) {

            formData.append(
                "image",
                imageFile
            );
        }


        /*
         * آدرس Backend
         * در صورت تغییر Railway
         * فقط این آدرس را عوض می‌کنیم.
         */

        const API_URL =
            "https://yazdahom-riazi-production.up.railway.app/api/ai";


        const response =
            await fetch(
                API_URL,
                {
                    method: "POST",
                    body: formData
                }
            );


        if (!response.ok) {

            throw new Error(
                "AI request failed"
            );
        }


        const data =
            await response.json();


        const answer =
            data.answer ||
            data.response ||
            data.message;


        if (!answer) {

            throw new Error(
                "Empty AI response"
            );
        }


        responseContent.innerHTML =
            formatMath(
                answer
            );


    } catch (error) {

        console.error(
            "AI Error:",
            error
        );


        responseContent.innerHTML = `
            <div class="ai-image-status"
                 style="
                    color: var(--red);
                    border-color: rgba(224,82,82,0.2);
                    background: rgba(224,82,82,0.05);
                 ">
                خطا در ارتباط با دستیار هوشمند.
                لطفاً دوباره امتحان کن.
            </div>
        `;
    }
}


/* =========================================
   BASIC MATH FORMAT
========================================= */

function formatMath(text) {

    if (!text) {
        return "";
    }


    let result =
        escapeHTML(
            String(text)
        );


    /*
     * تبدیل خطوط جدید
     */

    result =
        result.replace(
            /\n/g,
            "<br>"
        );


    /*
     * تبدیل $$...$$
     */

    result =
        result.replace(
            /\$\$(.*?)\$\$/gs,
            '<div class="math-display">$1</div>'
        );


    /*
     * تبدیل $...$
     */

    result =
        result.replace(
            /\$(.*?)\$/gs,
            '<span class="math-inline">$1</span>'
        );


    return result;
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


/* =========================================
   ESCAPE ATTRIBUTE
========================================= */

function escapeAttribute(value) {

    return escapeHTML(value);
}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const access =
            checkLessonAccess();


        if (!access) {
            return;
        }


        if (
            typeof updateUserInfo ===
            "function"
        ) {

            updateUserInfo();
        }


        loadLesson();

    }
);
