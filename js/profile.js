/* =========================================
   PROFILE PAGE
   YAZDAHOM PLUS
========================================= */

let profileUser = null;


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeProfile();

    }
);


/* =========================================
   INITIALIZE PROFILE
========================================= */

function initializeProfile() {

    /*
     * user.js باید قبل از profile.js
     * در profile.html لود شده باشد.
     */

    if (
        typeof getUser !== "function"
    ) {

        console.error(
            "getUser() پیدا نشد."
        );

        showProfileError();

        return;

    }


    profileUser =
        getUser();


    /*
     * اگر کاربر لاگین نکرده باشد،
     * برگرد به login
     */

    if (!profileUser) {

        window.location.href =
            "login.html";

        return;

    }


    renderProfile();

    setupProfileEvents();

}


/* =========================================
   RENDER PROFILE
========================================= */

function renderProfile() {

    renderBasicInfo();

    renderStats();

    renderLevel();

    renderSubjectProgress();

}


/* =========================================
   BASIC INFO
========================================= */

function renderBasicInfo() {

    const username =
        getUsername();


    /*
     * Username
     */

    setText(
        "profileUsername",
        username
    );


    setText(
        "accountUsername",
        username
    );


    /*
     * Avatar
     */

    const avatar =
        document.getElementById(
            "avatarLetter"
        );


    if (avatar) {

        avatar.textContent =
            username
                ? username
                    .charAt(0)
                    .toUpperCase()
                : "?";

    }


    /*
     * Created date
     */

    const created =
        profileUser.createdAt;


    const createdElement =
        document.getElementById(
            "accountCreated"
        );


    if (createdElement) {

        createdElement.textContent =
            formatDate(
                created
            );

    }

}


/* =========================================
   STATS
========================================= */

function renderStats() {

    const xp =
        getXP();


    const completed =
        getCompletedLessons();


    const level =
        calculateLevel(
            xp
        );


    setText(
        "profileXP",
        xp
    );


    setText(
        "completedLessons",
        completed
    );


    setText(
        "profileLevel",
        level
    );


    setText(
        "levelXP",
        `${xp} XP`
    );


    setText(
        "profileStatus",
        "فعال"
    );


    setText(
        "levelProgressText",
        `سطح ${level}`
    );

}


/* =========================================
   LEVEL
========================================= */

function renderLevel() {

    const xp =
        getXP();


    const levelData =
        getLevelData(
            xp
        );


    const fill =
        document.getElementById(
            "levelBarFill"
        );


    if (fill) {

        fill.style.width =
            `${levelData.percent}%`;

    }


    setText(
        "currentLevelText",
        `سطح ${levelData.level}`
    );


    if (
        levelData.nextXP
    ) {

        const remaining =
            levelData.nextXP -
            xp;


        setText(
            "nextLevelText",
            `${remaining} XP تا سطح بعد`
        );

    } else {

        setText(
            "nextLevelText",
            "بالاترین سطح"
        );

    }

}


/* =========================================
   LEVEL CALCULATION
========================================= */

function calculateLevel(
    xp
) {

    /*
     * Every 100 XP = one level
     */

    return (
        Math.floor(
            Number(xp || 0) / 100
        ) + 1
    );

}


/* =========================================
   LEVEL DATA
========================================= */

function getLevelData(
    xp
) {

    xp =
        Number(xp || 0);


    const level =
        calculateLevel(
            xp
        );


    const currentLevelXP =
        (level - 1) * 100;


    const nextLevelXP =
        level * 100;


    const insideLevel =
        xp -
        currentLevelXP;


    const percent =
        Math.min(
            100,
            Math.max(
                0,
                (insideLevel / 100) * 100
            )
        );


    return {

        level:
            level,

        currentXP:
            currentLevelXP,

        nextXP:
            nextLevelXP,

        percent:
            percent

    };

}


/* =========================================
   SUBJECT PROGRESS
========================================= */

function renderSubjectProgress() {

    const container =
        document.getElementById(
            "subjectProgress"
        );


    if (!container) {
        return;
    }


    /*
     * فعلاً فقط حسابان را نمایش می‌دهیم.
     * بعداً گسسته، هندسه، فیزیک و شیمی
     * به همین سیستم اضافه می‌شوند.
     */

    const completed =
        getCompletedLessons();


    /*
     * تعداد کل درس‌ها را فعلاً
     * از subjects.json می‌گیریم.
     */

    fetch(
        "data/subjects.json"
    )
        .then(
            response => {

                if (!response.ok) {

                    throw new Error(
                        "subjects.json unavailable"
                    );

                }

                return response.json();

            }
        )
        .then(
            data => {

                const subjects =
                    Array.isArray(
                        data.subjects
                    )
                        ? data.subjects
                        : [];


                if (
                    subjects.length === 0
                ) {

                    renderEmptyProgress();

                    return;

                }


                container.innerHTML =
                    "";


                subjects.forEach(
                    subject => {

                        const totalLessons =
                            getSubjectLessonCount(
                                subject
                            );


                        const completedLessons =
                            getCompletedForSubject(
                                subject
                            );


                        const percent =
                            totalLessons > 0
                                ? Math.round(
                                    (
                                        completedLessons /
                                        totalLessons
                                    ) * 100
                                )
                                : 0;


                        const card =
                            createSubjectCard(
                                subject,
                                completedLessons,
                                totalLessons,
                                percent
                            );


                        container.appendChild(
                            card
                        );

                    }
                );

            }
        )
        .catch(
            error => {

                console.error(
                    "Progress error:",
                    error
                );

                renderEmptyProgress();

            }
        );

}


/* =========================================
   SUBJECT LESSON COUNT
========================================= */

function getSubjectLessonCount(
    subject
) {

    let count = 0;


    if (
        !Array.isArray(
            subject.chapters
        )
    ) {

        return count;

    }


    subject.chapters.forEach(
        chapter => {

            if (
                Array.isArray(
                    chapter.lessons
                )
            ) {

                count +=
                    chapter.lessons.length;

            }

        }
    );


    return count;

}


/* =========================================
   COMPLETED SUBJECT LESSONS
========================================= */

function getCompletedForSubject(
    subject
) {

    if (
        !Array.isArray(
            subject.chapters
        )
    ) {

        return 0;

    }


    const completed =
        getCompletedLessonIds();


    let count = 0;


    subject.chapters.forEach(
        chapter => {

            if (
                !Array.isArray(
                    chapter.lessons
                )
            ) {

                return;

            }


            chapter.lessons.forEach(
                lesson => {

                    if (
                        completed.includes(
                            lesson.id
                        )
                    ) {

                        count++;

                    }

                }
            );

        }
    );


    return count;

}


/* =========================================
   SUBJECT CARD
========================================= */

function createSubjectCard(
    subject,
    completed,
    total,
    percent
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "subject-card";


    const title =
        subject.title ||
        subject.name ||
        subject.id ||
        "درس";


    card.innerHTML = `

        <div class="subject-top">

            <strong>
                ${escapeHTML(title)}
            </strong>

            <span>
                ${percent}%
            </span>

        </div>


        <div class="subject-progress-bar">

            <div
                class="subject-progress-fill"
                style="width: ${percent}%"
            ></div>

        </div>


        <div class="subject-bottom">

            <span>
                ${completed} از ${total} درس
            </span>

            <span>
                ${percent === 100
                    ? "تکمیل شده"
                    : "در حال یادگیری"}
            </span>

        </div>

    `;


    return card;

}


/* =========================================
   EMPTY PROGRESS
========================================= */

function renderEmptyProgress() {

    const container =
        document.getElementById(
            "subjectProgress"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="loading-state">

            اطلاعات پیشرفت فعلاً در دسترس نیست.

        </div>

    `;

}


/* =========================================
   GET USERNAME
========================================= */

function getUsername() {

    if (!profileUser) {

        return "کاربر";

    }


    return (
        profileUser.username ||
        profileUser.name ||
        "کاربر"
    );

}


/* =========================================
   GET XP
========================================= */

function getXP() {

    if (!profileUser) {
        return 0;
    }


    return Number(
        profileUser.xp || 0
    );

}


/* =========================================
   GET COMPLETED LESSONS
========================================= */

function getCompletedLessons() {

    return getCompletedLessonIds().length;

}


/* =========================================
   GET COMPLETED IDS
========================================= */

function getCompletedLessonIds() {

    if (
        !profileUser ||
        !profileUser.progress
    ) {

        return [];

    }


    if (
        !Array.isArray(
            profileUser
                .progress
                .completedLessons
        )
    ) {

        return [];

    }


    return profileUser
        .progress
        .completedLessons;

}


/* =========================================
   LOGOUT
========================================= */

function setupProfileEvents() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        () => {

            /*
             * استفاده از logoutUser
             * اگر در user.js وجود داشته باشد.
             */

            if (
                typeof logoutUser ===
                "function"
            ) {

                logoutUser();

            } else {

                /*
                 * fallback
                 */

                localStorage.removeItem(
                    "yazdahom_current_user"
                );

            }


            window.location.href =
                "login.html";

        }
    );

}


/* =========================================
   ERROR
========================================= */

function showProfileError() {

    setText(
        "profileUsername",
        "خطا"
    );


    setText(
        "profileStatus",
        "خطا"
    );

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
   DATE
========================================= */

function formatDate(
    value
) {

    if (!value) {

        return "نامشخص";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "نامشخص";

    }


    return date.toLocaleDateString(
        "fa-IR"
    );

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
