/* =========================================
   HESABAN PAGE
   YAZDAHOM PLUS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadHesaban();

    }
);


/* =========================================
   LOAD HESABAN
========================================= */

async function loadHesaban() {

    try {

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


        /*
         * اول متن خام را می‌گیریم.
         */

        const rawText =
            await response.text();


        /*
         * اگر فایل به اشتباه با
         * ```json یا ``` ذخیره شده باشد،
         * قبل از JSON.parse حذفش می‌کنیم.
         */

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
                "RAW SUBJECTS JSON:",
                rawText
            );

            throw new Error(
                "ساختار subjects.json معتبر نیست."
            );

        }


        /*
         * پیدا کردن حسابان
         */

        if (
            !Array.isArray(
                data.subjects
            )
        ) {

            throw new Error(
                "آرایه subjects در subjects.json پیدا نشد."
            );

        }


        const hesaban =
            data.subjects.find(
                subject =>
                    subject.id ===
                    "hesaban"
            );


        if (!hesaban) {

            throw new Error(
                "درس حسابان در subjects.json پیدا نشد."
            );

        }


        console.log(
            "Hesaban loaded:",
            hesaban
        );


        renderHesaban(
            hesaban
        );


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


    /*
     * حذف ```json از ابتدا
     */

    result =
        result.replace(
            /^```json\s*/i,
            ""
        );


    /*
     * حذف ``` از انتها
     */

    result =
        result.replace(
            /\s*```$/i,
            ""
        );


    return result.trim();

}


/* =========================================
   RENDER HESABAN
========================================= */

function renderHesaban(
    subject
) {

    /*
     * اطلاعات اصلی
     */

    setText(
        "subjectTitle",
        subject.title ||
        "حسابان"
    );


    setText(
        "subjectDescription",
        subject.description ||
        "آموزش حسابان یازدهم"
    );


    /*
     * Chapters
     */

    const container =
        document.getElementById(
            "chapters"
        ) ||
        document.getElementById(
            "chaptersContainer"
        );


    if (!container) {

        console.warn(
            "chapters container پیدا نشد."
        );

        return;

    }


    container.innerHTML =
        "";


    const chapters =
        Array.isArray(
            subject.chapters
        )
            ? subject.chapters
            : [];


    if (
        chapters.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                هنوز فصلی برای حسابان اضافه نشده است.

            </div>

        `;

        return;

    }


    chapters.forEach(
        (chapter, index) => {

            const card =
                createChapterCard(
                    chapter,
                    index
                );


            container.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CREATE CHAPTER
========================================= */

function createChapterCard(
    chapter,
    index
) {

    const card =
        document.createElement(
            "a"
        );


    card.className =
        "chapter-card";


    /*
     * chapter.html
     */

    card.href =
        `chapter.html?id=${encodeURIComponent(
            chapter.id
        )}`;


    const lessonCount =
        Array.isArray(
            chapter.lessons
        )
            ? chapter.lessons.length
            : 0;


    card.innerHTML = `

        <div class="chapter-number">

            ${index + 1}

        </div>


        <div class="chapter-content">

            <h3>

                ${escapeHTML(
                    chapter.title ||
                    `فصل ${index + 1}`
                )}

            </h3>


            <p>

                ${escapeHTML(
                    chapter.description ||
                    "مباحث این فصل"
                )}

            </p>


            <span>

                ${lessonCount}
                درس

            </span>

        </div>


        <div class="chapter-arrow">

            ←

        </div>

    `;


    return card;

}


/* =========================================
   ERROR
========================================= */

function showHesabanError(
    message
) {

    const container =
        document.getElementById(
            "chapters"
        ) ||
        document.getElementById(
            "chaptersContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <div class="error-state">

            <h3>
                خطا در بارگذاری حسابان
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
