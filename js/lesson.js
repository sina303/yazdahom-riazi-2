
/* =========================================
   AXIS — LESSON PAGE
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadLesson();
});


/* =========================================
   LOAD LESSON
========================================= */

async function loadLesson() {

    try {

        const lessonId = getLessonId();

        if (!lessonId) {
            throw new Error("شناسه درس پیدا نشد.");
        }


        const response = await fetch(
            "data/subjects.json",
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }


        const rawText = await response.text();

        const cleanedJSON = cleanJSON(rawText);

        let data;


        try {

            data = JSON.parse(cleanedJSON);

        } catch (error) {

            console.error("JSON Parse Error:", error);

            throw new Error(
                "فایل subjects.json ساختار صحیحی ندارد."
            );

        }


        const result =
            findLesson(
                data,
                lessonId
            );


        if (!result) {

            throw new Error(
                "درس مورد نظر پیدا نشد."
            );

        }


        renderLesson(
            result.lesson,
            result.chapter
        );


        setupCompleteButton(
            result.lesson
        );


        setupNextLesson(
            result.chapter,
            result.lesson
        );


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
   GET LESSON ID
========================================= */

function getLessonId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


/* =========================================
   FIND LESSON
========================================= */

function findLesson(
    data,
    lessonId
) {

    let subjects = [];


    if (Array.isArray(data.subjects)) {

        subjects =
            data.subjects;

    } else if (Array.isArray(data)) {

        subjects =
            data;

    }


    for (const subject of subjects) {

        const chapters =
            Array.isArray(
                subject.chapters
            )
                ? subject.chapters
                : [];


        for (const chapter of chapters) {

            const lessons =
                Array.isArray(
                    chapter.lessons
                )
                    ? chapter.lessons
                    : [];


            const lesson =
                lessons.find(
                    item =>
                        String(item.id) ===
                        String(lessonId)
                );


            if (lesson) {

                return {
                    lesson,
                    chapter,
                    subject
                };

            }

        }

    }


    return null;

}


/* =========================================
   RENDER LESSON
========================================= */

function renderLesson(
    lesson,
    chapter
) {

    const title =
        lesson.title ||
        "درس";


    const description =
        lesson.description ||
        "";


    setText(
        "lessonTitle",
        title
    );


    setText(
        "lessonDescription",
        description
    );


    setText(
        "breadcrumbChapter",
        chapter.title || "فصل"
    );


    setText(
        "breadcrumbLesson",
        title
    );


    /*
     * محتوای اصلی
     */

    const content =
        document.getElementById(
            "lessonContent"
        );


    if (!content) {

        return;

    }


    content.innerHTML =
        "";


    /*
     * اگر content آرایه باشد
     */

    if (
        Array.isArray(
            lesson.content
        )
    ) {

        lesson.content.forEach(
            block => {

                content.appendChild(
                    createContentBlock(
                        block
                    )
                );

            }
        );

    }

    /*
     * اگر content متن باشد
     */

    else if (
        typeof lesson.content ===
        "string"
    ) {

        const block =
            document.createElement(
                "div"
            );


        block.className =
            "content-block";


        block.innerHTML =
            formatText(
                lesson.content
            );


        content.appendChild(
            block
        );

    }

    /*
     * اگر content وجود نداشته باشد
     */

    else {

        content.innerHTML = `

            <div class="content-block">

                <h2>
                    محتوای درس
                </h2>

                <p>
                    محتوای این درس هنوز اضافه نشده است.
                </p>

            </div>

        `;

    }


    /*
     * وضعیت درس
     */

    updateLessonStatus(
        lesson.id
    );

}


/* =========================================
   CREATE CONTENT BLOCK
========================================= */

function createContentBlock(
    block
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "content-block";


    if (typeof block === "string") {

        element.innerHTML =
            formatText(
                block
            );

        return element;

    }


    const type =
        block.type ||
        "text";


    switch (type) {

        case "heading":

            element.innerHTML = `

                <h2>
                    ${escapeHTML(
                        block.title ||
                        ""
                    )}
                </h2>

                ${
                    block.text
                        ? `<p>${formatText(
                            block.text
                        )}</p>`
                        : ""
                }

            `;

            break;


        case "text":

            element.innerHTML = `

                ${
                    block.title
                        ? `<h2>${escapeHTML(
                            block.title
                        )}</h2>`
                        : ""
                }

                <p>
                    ${formatText(
                        block.text ||
                        block.content ||
                        ""
                    )}
                </p>

            `;

            break;


        case "formula":

            element.innerHTML = `

                ${
                    block.title
                        ? `<h3>${escapeHTML(
                            block.title
                        )}</h3>`
                        : ""
                }

                <div class="formula-box">

                    ${escapeHTML(
                        block.formula ||
                        block.text ||
                        ""
                    )}

                </div>

            `;

            break;


        case "note":

            element.innerHTML = `

                <div class="lesson-note">

                    ${
                        block.title
                            ? `<strong>${escapeHTML(
                                block.title
                            )}</strong>`
                            : ""
                    }

                    <p>
                        ${formatText(
                            block.text ||
                            block.content ||
                            ""
                        )}
                    </p>

                </div>

            `;

            break;


        case "example":

            element.innerHTML = `

                <div class="example-box">

                    <div class="example-title">

                        ${
                            escapeHTML(
                                block.title ||
                                "مثال"
                            )
                        }

                    </div>

                    <p>
                        ${formatText(
                            block.text ||
                            block.content ||
                            ""
                        )}
                    </p>

                </div>

            `;

            break;


        case "question":

            element.innerHTML = `

                <div class="question-box">

                    <span class="question-number">

                        تمرین

                    </span>

                    <h3>
                        ${formatText(
                            block.question ||
                            block.text ||
                            ""
                        )}
                    </h3>

                    ${
                        block.answer
                            ? `
                                <div class="question-answer">

                                    ${formatText(
                                        block.answer
                                    )}

                                </div>
                            `
                            : ""
                    }

                </div>

            `;

            break;


        default:

            element.innerHTML = `

                <p>
                    ${formatText(
                        block.text ||
                        block.content ||
                        ""
                    )}
                </p>

            `;

    }


    return element;

}


/* =========================================
   COMPLETE BUTTON
========================================= */

function setupCompleteButton(
    lesson
) {

    const button =
        document.getElementById(
            "completeLesson"
        );


    if (!button) {

        return;

    }


    const completed =
        isLessonCompleted(
            lesson.id
        );


    updateCompleteButton(
        button,
        completed
    );


    button.addEventListener(
        "click",
        () => {

            const nowCompleted =
                !isLessonCompleted(
                    lesson.id
                );


            saveLessonProgress(
                lesson.id,
                nowCompleted
            );


            updateCompleteButton(
                button,
                nowCompleted
            );


            updateLessonStatus(
                lesson.id
            );

        }
    );

}


/* =========================================
   SAVE PROGRESS
========================================= */

function saveLessonProgress(
    lessonId,
    completed
) {

    let progress = {
        completedLessons: []
    };


    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "axis_progress"
                )
            );


        if (
            saved &&
            Array.isArray(
                saved.completedLessons
            )
        ) {

            progress =
                saved;

        }

    } catch {

        progress = {
            completedLessons: []
        };

    }


    const list =
        progress.completedLessons;


    const index =
        list.indexOf(
            lessonId
        );


    if (
        completed &&
        index === -1
    ) {

        list.push(
            lessonId
        );

    }


    if (
        !completed &&
        index !== -1
    ) {

        list.splice(
            index,
            1
        );

    }


    localStorage.setItem(
        "axis_progress",
        JSON.stringify(
            progress
        )
    );

}


/* =========================================
   BUTTON STATE
========================================= */

function updateCompleteButton(
    button,
    completed
) {

    if (completed) {

        button.textContent =
            "✓ یاد گرفتم";

        button.classList.add(
            "completed"
        );

    } else {

        button.textContent =
            "یاد گرفتم";

        button.classList.remove(
            "completed"
        );

    }

}


/* =========================================
   LESSON STATUS
========================================= */

function updateLessonStatus(
    lessonId
) {

    const status =
        document.getElementById(
            "lessonStatus"
        );


    if (!status) {

        return;

    }


    if (
        isLessonCompleted(
            lessonId
        )
    ) {

        status.textContent =
            "کامل شده";

    } else {

        status.textContent =
            "در حال یادگیری";

    }

}


/* =========================================
   NEXT LESSON
========================================= */

function setupNextLesson(
    chapter,
    currentLesson
) {

    const container =
        document.getElementById(
            "nextLessonContainer"
        );


    if (!container) {

        return;

    }


    const lessons =
        Array.isArray(
            chapter.lessons
        )
            ? chapter.lessons
            : [];


    const currentIndex =
        lessons.findIndex(
            lesson =>
                String(
                    lesson.id
                ) ===
                String(
                    currentLesson.id
                )
        );


    const nextLesson =
        lessons[
            currentIndex + 1
        ];


    if (!nextLesson) {

        container.innerHTML = "";

        return;

    }


    container.innerHTML = `

        <a
            href="lesson.html?id=${encodeURIComponent(
                nextLesson.id
            )}"
            class="next-lesson-card"
        >

            <div>

                <small>
                    درس بعدی
                </small>

                <strong>
                    ${escapeHTML(
                        nextLesson.title ||
                        "درس بعدی"
                    )}
                </strong>

            </div>

            <div class="next-lesson-arrow">
                ←
            </div>

        </a>

    `;

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
   TEXT FORMATTER
========================================= */

function formatText(
    text
) {

    if (
        text === undefined ||
        text === null
    ) {

        return "";

    }


    let value =
        escapeHTML(
            String(text)
        );


    /*
     * خط جدید
     */

    value =
        value.replace(
            /\n/g,
            "<br>"
        );


    return value;

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


    result =
        result.replace(
            /^\uFEFF/,
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

function showLessonError(
    message
) {

    const content =
        document.getElementById(
            "lessonContent"
        );


    if (!content) {

        return;

    }


    content.innerHTML = `

        <div class="content-block">

            <h2>
                خطا در بارگذاری درس
            </h2>

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
