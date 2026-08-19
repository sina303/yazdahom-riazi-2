/* =========================================
   YAZDAHOM RIAZI
   MAIN SCRIPT
========================================= */


/* =========================================
   CONFIG
========================================= */

const DATA_URL = "data/subjects.json";


/* =========================================
   DOM
========================================= */

const subjectsGrid = document.getElementById("subjectsGrid");


/* =========================================
   LOAD DATA
========================================= */

async function loadSubjects() {

    if (!subjectsGrid) {
        return;
    }

    try {

        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error(
                `Failed to load subjects.json: ${response.status}`
            );
        }

        const data = await response.json();

        if (
            !data ||
            !Array.isArray(data.subjects)
        ) {
            throw new Error(
                "Invalid subjects.json structure"
            );
        }

        renderSubjects(data.subjects);

    } catch (error) {

        console.error(
            "Subjects loading error:",
            error
        );

        showSubjectsError();
    }
}


/* =========================================
   RENDER SUBJECTS
========================================= */

function renderSubjects(subjects) {

    subjectsGrid.innerHTML = "";

    subjects.forEach((subject) => {

        const card =
            document.createElement("article");

        card.className = "subject-card";

        const hasContent =
            Array.isArray(subject.chapters) &&
            subject.chapters.length > 0;

        card.innerHTML = `

            <div class="subject-icon">
                ${subject.icon || "📚"}
            </div>

            <h3>
                ${escapeHTML(subject.name)}
            </h3>

            <p>
                ${escapeHTML(subject.description)}
            </p>

            <span class="subject-status">
                ${
                    hasContent
                        ? "شروع یادگیری →"
                        : "به‌زودی"
                }
            </span>

        `;


        /* ---------------------------------
           CLICK
        --------------------------------- */

        if (hasContent) {

            card.addEventListener(
                "click",
                () => {
                    openSubject(subject.id);
                }
            );

        } else {

            card.classList.add(
                "subject-disabled"
            );

        }


        subjectsGrid.appendChild(card);

    });
}


/* =========================================
   OPEN SUBJECT
========================================= */

function openSubject(subjectId) {

    if (!subjectId) {
        return;
    }

    switch (subjectId) {

        case "hesaban":

            window.location.href =
                "hesaban.html";

            break;


        default:

            console.warn(
                "Subject page not available:",
                subjectId
            );

            break;
    }
}


/* =========================================
   SCROLL TO SUBJECTS
========================================= */

function scrollToSubjects() {

    const subjects =
        document.getElementById("subjects");

    if (!subjects) {
        return;
    }

    subjects.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================
   ERROR
========================================= */

function showSubjectsError() {

    subjectsGrid.innerHTML = `

        <div class="subjects-error">

            <h3>
                خطا در بارگذاری درس‌ها
            </h3>

            <p>
                اطلاعات درس‌ها دریافت نشد.
                لطفاً صفحه را دوباره بارگذاری کنید.
            </p>

            <button
                type="button"
                onclick="loadSubjects()"
            >
                تلاش دوباره
            </button>

        </div>

    `;
}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSubjects();

    }
);
