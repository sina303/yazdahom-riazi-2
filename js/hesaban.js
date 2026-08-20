
/* =========================================
   AXIS — HESABAN PAGE
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

    const chaptersContainer =
        document.getElementById("chapters");


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


        const rawText =
            await response.text();


        const cleanedJSON =
            cleanJSON(
                rawText
            );


        let data;


        try {

            data =
                JSON.parse(
                    cleanedJSON
                );

        } catch (error) {

            console.error(
                "JSON Parse Error:",
                error
            );

            console.error(
                "JSON received:",
                rawText
            );

            throw new Error(
                "فایل subjects.json ساختار صحیحی ندارد."
            );

        }


        /*
         * پیدا کردن حسابان
         */

        const hesaban =
            findHesaban(
                data
            );


        if (!hesaban) {

            throw new Error(
                "درس حسابان در subjects.json پیدا نشد."
            );

        }


        /*
         * اطلاعات حسابان
         */

        renderSubjectInfo(
            hesaban
        );


        /*
         * فصل‌ها
         */

        renderChapters(
            hesaban.chapters || []
        );


        console.log(
            "AXIS Hesaban loaded successfully."
        );


    } catch (error) {

        console.error(
            "Hesaban error:",
            error
        );


        showError(
            chaptersContainer,
            error.message
        );

    }

}


/* =========================================
   FIND HESABAN
========================================= */

function findHesaban(data) {

    /*
     * حالت اصلی پروژه
     */

    if (
        Array.isArray(
            data.subjects
        )
    ) {

        return data.subjects.find(
            subject =>
                subject.id === "hesaban" ||
                subject.slug === "hesaban" ||
                subject.title === "حسابان"
        );

    }


    /*
     * اگر خود JSON آرایه باشد
     */

    if (
        Array.isArray(data)
    ) {

        return data.find(
            subject =>
                subject.id === "hesaban" ||
                subject.slug === "hesaban" ||
                subject.title === "حسابان"
        );

    }


    /*
     * اگر subjects مستقیماً object باشد
     */

    if (
        data.subjects &&
        typeof data.subjects === "object"
    ) {

        if (
            data.subjects.hesaban
        ) {

            return data.subjects.hesaban;

        }

    }


    return null;

}


/* =========================================
   RENDER SUBJECT INFO
========================================= */

function renderSubjectInfo(
    subject
) {

    const title =
        document.getElementById(
            "subjectTitle"
        );


    const description =
        document.getElementById(
            "subjectDescription"
        );


    if (title) {

        title.textContent =
            subject.title ||
            "حسابان";

    }


    if (description) {

        description.textContent =
            subject.description ||
            "آموزش حسابان یازدهم رشته ریاضی";

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
            "chapters"
        );


    const count =
        document.getElementById(
            "chapterCount"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (!Array.isArray(chapters)) {

        chapters = [];

    }


    if (count) {

        count.textContent =
            `${toPersianNumber(
                chapters.length
            )} فصل`;

    }


    if (chapters.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                هنوز فصلی برای حسابان اضافه نشده است.

            </div>

        `;

        return;

    }


    chapters.forEach(
        (
            chapter,
            index
        ) => {

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
   CREATE CHAPTER CARD
========================================= */

function createChapterCard(
    chapter,
    index
) {

    const link =
        document.createElement(
            "a"
        );


    link.className =
        "chapter-card";


    /*
     * رفتن به chapter.html
     */

    const chapterId =
        chapter.id ||
        chapter.slug ||
        index + 1;


    link.href =
        `chapter.html?id=${encodeURIComponent(
            chapterId
        )}`;


    const number =
        chapter.number !== undefined
            ? chapter.number
            : index + 1;


    const title =
        chapter.title ||
        `فصل ${index + 1}`;


    const description =
        chapter.description ||
        "درس‌های این فصل";


    const lessonCount =
        Array.isArray(
            chapter.lessons
        )
            ? chapter.lessons.length
            : 0;


    link.innerHTML = `

        <div class="chapter-number">

            ${toPersianNumber(
                String(number).padStart(
                    2,
                    "0"
                )
            )}

        </div>


        <div class="chapter-content">

            <h3>
                ${escapeHTML(
                    title
                )}
            </h3>

            <p>
                ${escapeHTML(
                    description
                )}
            </p>

            <span>
                ${toPersianNumber(
                    lessonCount
                )} درس
            </span>

        </div>


        <div class="chapter-arrow">
            ←
        </div>

    `;


    return link;

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
     * حذف ```json
     */

    result =
        result.replace(
            /^```json\s*/i,
            ""
        );


    /*
     * حذف ``` انتهای فایل
     */

    result =
        result.replace(
            /\s*```$/i,
            ""
        );


    /*
     * حذف BOM احتمالی
     */

    result =
        result.replace(
            /^\uFEFF/,
            ""
        );


    return result.trim();

}


/* =========================================
   ERROR
========================================= */

function showError(
    container,
    message
) {

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


/* =========================================
   PERSIAN NUMBERS
========================================= */

function toPersianNumber(
    value
) {

    return String(
        value
    ).replace(
        /\d/g,
        digit =>
            "۰۱۲۳۴۵۶۷۸۹"[digit]
    );

}
