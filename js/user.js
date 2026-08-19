```javascript
/* =========================================
   USER SYSTEM
   Yazdahom Riazi
========================================= */

const DEFAULT_USER = {
    username: "",
    xp: 0,
    level: 1,

    stats: {
        questionsSolved: 0,
        correctAnswers: 0,
        lessonsCompleted: 0
    },

    progress: {
        hesaban: {
            chapters: {}
        }
    }
};


/* =========================================
   GET USER
========================================= */

function getUser() {

    const savedUser = localStorage.getItem("yazdahom_user");

    if (!savedUser) {
        return createDefaultUser();
    }

    try {

        const user = JSON.parse(savedUser);

        return {
            ...DEFAULT_USER,
            ...user,

            stats: {
                ...DEFAULT_USER.stats,
                ...(user.stats || {})
            },

            progress: {
                ...DEFAULT_USER.progress,
                ...(user.progress || {})
            }
        };

    } catch (error) {

        console.error("Error reading user:", error);

        return createDefaultUser();
    }
}


/* =========================================
   DEFAULT USER
========================================= */

function createDefaultUser() {

    return {
        username: "",
        xp: 0,
        level: 1,

        stats: {
            questionsSolved: 0,
            correctAnswers: 0,
            lessonsCompleted: 0
        },

        progress: {
            hesaban: {
                chapters: {}
            }
        }
    };
}


/* =========================================
   SAVE USER
========================================= */

function saveUser(user) {

    localStorage.setItem(
        "yazdahom_user",
        JSON.stringify(user)
    );

}


/* =========================================
   CREATE USER
========================================= */

function createUser(username) {

    const oldUser = getUser();

    const user = {
        ...oldUser,
        username: username.trim()
    };

    saveUser(user);

    return user;
}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem("yazdahom_user");

    window.location.href = "login.html";
}


/* =========================================
   LOGIN CHECK
========================================= */

function isLoggedIn() {

    const user = getUser();

    return Boolean(user.username);
}


/* =========================================
   XP
========================================= */

function addXP(amount) {

    const user = getUser();

    const xpAmount = Number(amount);

    if (
        !Number.isFinite(xpAmount) ||
        xpAmount <= 0
    ) {
        return user;
    }

    user.xp += xpAmount;

    user.level = getLevel(user.xp);

    saveUser(user);

    return user;
}


/* =========================================
   LEVEL
========================================= */

function getLevel(xp) {

    const value = Number(xp) || 0;

    return Math.floor(value / 100) + 1;
}


/* =========================================
   NEXT LEVEL XP
========================================= */

function getNextLevelXP(xp) {

    const level = getLevel(xp);

    return level * 100;
}


/* =========================================
   CURRENT LEVEL XP
========================================= */

function getCurrentLevelXP(xp) {

    const level = getLevel(xp);

    const previousLevelXP =
        (level - 1) * 100;

    return Math.max(
        0,
        xp - previousLevelXP
    );
}


/* =========================================
   LEVEL PROGRESS
========================================= */

function getLevelProgress(xp) {

    const currentXP =
        getCurrentLevelXP(xp);

    return Math.min(
        100,
        Math.round(
            (currentXP / 100) * 100
        )
    );
}


/* =========================================
   QUESTION RESULT
========================================= */

function addQuestionResult(isCorrect) {

    const user = getUser();

    user.stats.questionsSolved++;

    if (isCorrect) {
        user.stats.correctAnswers++;
    }

    saveUser(user);

    return user;
}


/* =========================================
   LESSON COMPLETED
========================================= */

function completeLesson(
    subjectId,
    chapterId,
    lessonId
) {

    const user = getUser();

    if (!user.progress[subjectId]) {

        user.progress[subjectId] = {
            chapters: {}
        };
    }


    if (
        !user.progress[subjectId]
            .chapters[chapterId]
    ) {

        user.progress[subjectId]
            .chapters[chapterId] = {
                lessons: {}
            };
    }


    if (
        !user.progress[subjectId]
            .chapters[chapterId]
            .lessons
    ) {

        user.progress[subjectId]
            .chapters[chapterId]
            .lessons = {};
    }


    const lessons =
        user.progress[subjectId]
            .chapters[chapterId]
            .lessons;


    if (!lessons[lessonId]) {

        lessons[lessonId] = true;

        user.stats.lessonsCompleted++;

    }


    saveUser(user);

    return user;
}


/* =========================================
   CHECK LESSON
========================================= */

function isLessonCompleted(
    subjectId,
    chapterId,
    lessonId
) {

    const user = getUser();

    return Boolean(
        user.progress?.[subjectId]
            ?.chapters?.[chapterId]
            ?.lessons?.[lessonId]
    );
}


/* =========================================
   ACCURACY
========================================= */

function getAccuracy() {

    const user = getUser();

    const solved =
        Number(user.stats.questionsSolved) || 0;

    const correct =
        Number(user.stats.correctAnswers) || 0;


    if (solved === 0) {
        return 0;
    }


    return Math.round(
        (correct / solved) * 100
    );
}
```
