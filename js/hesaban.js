```javascript
/* =========================================
   HESABAN
   Load Chapters + Progress
========================================= */


/* =========================================
   LOAD DATA
========================================= */

async function loadHesaban() {

    const chaptersGrid =
        document.getElementById("chaptersGrid");

    if (!chaptersGrid) {
        return;
    }


    try {

        const response =
            await fetch("data/subjects.json");


        if (!response.ok) {

            throw new Error(
                "Could not load subjects.json"
            );

        }


        const data =
            await response.json();


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


        renderChapters(
            hesaban.chapters
        );


        updateHesabanOverview(
            hesaban.chapters
        );


    } catch (error) {

        console.error(
            "Hesaban loading error:",
            error
        );


        chaptersGrid.innerHTML = `

            <div class="loading">

                خطا در بارگذاری فصل‌ها

                <br>

                <small>
                    ${error.message}
                </small>

            </div>

        `;

    }

}


/* =========================================
   RENDER CHAPTERS
========================================= */

function renderChapters(chapters) {

    const chaptersGrid =
        document.getElementById(
            "chaptersGrid"
        );


    if (!chaptersGrid) {
        return;
    }


    chaptersGrid.innerHTML = "";


    if (
        !Array.isArray(chapters) ||
        chapters.length === 0
    ) {

        chaptersGrid.innerHTML = `

            <div class="loading">

                هنوز فصلی اضافه نشده است.

            </div>

        `;

        return;

    }


    const user =
        typeof getUser === "function"
            ? getUser()
            : null;


    chapters.forEach(chapter => {

        const card =
            document.createElement("article");


        card.className =
            "chapter-card";


        let progress =
            Number(chapter.progress) || 0;


        /*
            اگر سیستم کاربر بعداً
            پیشرفت اختصاصی داشته باشد،
            از آن استفاده می‌کنیم.
        */

        if (
            user &&
            user.progress &&
            user.progress.hesaban &&
            user.progress.hesaban.chapters &&
            user.progress.hesaban.chapters[
                chapter.id
            ]
        ) {

            const chapterData =
                user.progress
                    .hesaban
                    .chapters[
                        chapter.id
                    ];


            if (
                typeof chapterData.progress ===
                "number"
            ) {

                progress =
                    chapterData.progress;

            }

        }


        progress =
            Math.max(
                0,
                Math.min(
                    100,
                    progress
                )
            );


        card.innerHTML = `

            <div class="chapter-number">

                ${String(
                    chapter.number
                ).padStart(2, "0")}

            </div>


            <div class="chapter-content">

                <h3>
                    ${escapeHTML(
                        chapter.title
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        chapter.description
                    )}
                </p>


                <div class="chapter-progress">

                    <span>
                        پیشرفت ${progress}%
                    </span>


                    <div>

                        <i
                            style="
                                width: ${progress}%;
                            "
                        ></i>

                    </div>

                </div>

            </div>


            <button
                type="button"
                class="chapter-button"
                data-chapter-id="${chapter.id}"
            >
                ورود →
            </button>

        `;


        const button =
            card.querySelector(
                ".chapter-button"
            );


        button.addEventListener(
            "click",
            () => {

                openChapter(
                    chapter.id
                );

            }
        );


        chaptersGrid.appendChild(card);

    });

}


/* =========================================
   OPEN CHAPTER
========================================= */

function openChapter(chapterId) {

    if (!chapterId) {
        return;
    }


    window.location.href =
        "chapter.html?chapter=" +
        encodeURIComponent(
            chapterId
        );

}


/* =========================================
   OVERVIEW
========================================= */

function updateHesabanOverview(
    chapters
) {

    const chapterCount =
        document.getElementById(
            "chapterCount"
        );


    const completedLessons =
        document.getElementById(
            "completedLessons"
        );


    const overallProgress =
        document.getElementById(
            "overallProgress"
        );


    if (!Array.isArray(chapters)) {
        return;
    }


    if (chapterCount) {

        chapterCount.textContent =
            chapters.length;

    }


    let totalLessons = 0;

    let completedCount = 0;


    const user =
        typeof getUser === "function"
            ? getUser()
            : null;


    chapters.forEach(chapter => {

        const lessons =
            Array.isArray(
                chapter.lessons
            )
                ? chapter.lessons
                : [];


        totalLessons +=
            lessons.length;


        if (
            user &&
            user.progress &&
            user.progress.hesaban &&
            user.progress.hesaban.chapters &&
            user.progress.hesaban.chapters[
                chapter.id
            ]
        ) {

            const chapterData =
                user.progress
                    .hesaban
                    .chapters[
                        chapter.id
                    ];


            const lessonProgress =
                chapterData.lessons || {};


            lessons.forEach(
                lesson => {

                    if (
                        lessonProgress[
                            lesson.id
                        ]
                    ) {

                        completedCount++;

                    }

                }
            );

        }

    });


    if (completedLessons) {

        completedLessons.textContent =
            completedCount;

    }


    const progress =
        totalLessons === 0
            ? 0
            : Math.round(
                (
                    completedCount /
                    totalLessons
                ) * 100
            );


    if (overallProgress) {

        overallProgress.textContent =
            progress + "%";

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

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
   HEADER USER
========================================= */

function updateHesabanHeader() {

    const user =
        typeof getUser === "function"
            ? getUser()
            : null;


    if (!user) {
        return;
    }


    const username =
        document.getElementById(
            "headerUsername"
        );


    const xp =
        document.getElementById(
            "headerXP"
        );


    if (username) {

        username.textContent =
            user.username ||
            "کاربر";

    }


    if (xp) {

        xp.textContent =
            user.xp || 0;

    }

}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateHesabanHeader();

        loadHesaban();

    }
);
```
