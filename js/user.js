/* =========================================
   USER SYSTEM
   YAZDAHOM PLUS
========================================= */


/*
 * نام کلیدهای LocalStorage
 */

const CURRENT_USER_KEY =
    "yazdahom_current_user";

const USERS_KEY =
    "yazdahom_users";


/* =========================================
   GET ALL USERS
========================================= */

function getAllUsers() {

    try {

        const users =
            localStorage.getItem(
                USERS_KEY
            );


        if (!users) {

            return {};

        }


        const parsed =
            JSON.parse(users);


        if (
            typeof parsed !== "object" ||
            parsed === null
        ) {

            return {};

        }


        return parsed;

    } catch (error) {

        console.error(
            "Error reading users:",
            error
        );

        return {};

    }

}


/* =========================================
   SAVE ALL USERS
========================================= */

function saveAllUsers(
    users
) {

    try {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

        return true;

    } catch (error) {

        console.error(
            "Error saving users:",
            error
        );

        return false;

    }

}


/* =========================================
   CREATE USER
========================================= */

function createUser(
    username
) {

    username =
        String(
            username || ""
        ).trim();


    if (!username) {

        return {
            success: false,
            message:
                "نام کاربری نمی‌تواند خالی باشد."
        };

    }


    if (
        username.length < 3
    ) {

        return {
            success: false,
            message:
                "نام کاربری باید حداقل ۳ کاراکتر باشد."
        };

    }


    if (
        username.length > 30
    ) {

        return {
            success: false,
            message:
                "نام کاربری نباید بیشتر از ۳۰ کاراکتر باشد."
        };

    }


    const users =
        getAllUsers();


    /*
     * نام کاربری را برای مقایسه
     * به حروف کوچک تبدیل می‌کنیم.
     */

    const normalizedUsername =
        username.toLowerCase();


    /*
     * جلوگیری از ساخت دو حساب
     * با نام یکسان
     */

    for (
        const key in users
    ) {

        if (
            key.toLowerCase() ===
            normalizedUsername
        ) {

            /*
             * همان کاربر را وارد می‌کنیم
             */

            setCurrentUser(
                users[key]
            );


            return {
                success: true,
                existing: true,
                user:
                    users[key]
            };

        }

    }


    /*
     * ساخت کاربر جدید
     */

    const now =
        new Date().toISOString();


    const user = {

        id:
            generateUserId(),

        username:
            username,

        xp:
            0,

        progress: {

            completedLessons: []

        },

        createdAt:
            now,

        lastLogin:
            now

    };


    users[username] =
        user;


    const saved =
        saveAllUsers(
            users
        );


    if (!saved) {

        return {
            success: false,
            message:
                "ذخیره اطلاعات کاربر انجام نشد."
        };

    }


    setCurrentUser(
        user
    );


    return {

        success: true,

        existing: false,

        user:
            user

    };

}


/* =========================================
   GET CURRENT USER
========================================= */

function getUser() {

    try {

        const user =
            localStorage.getItem(
                CURRENT_USER_KEY
            );


        if (!user) {

            return null;

        }


        const parsed =
            JSON.parse(user);


        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            return null;

        }


        return parsed;

    } catch (error) {

        console.error(
            "Error reading current user:",
            error
        );

        return null;

    }

}


/* =========================================
   SET CURRENT USER
========================================= */

function setCurrentUser(
    user
) {

    if (!user) {

        return false;

    }


    try {

        /*
         * زمان آخرین ورود
         */

        user.lastLogin =
            new Date().toISOString();


        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(user)
        );


        /*
         * همزمان نسخه اصلی کاربر
         * را هم آپدیت می‌کنیم.
         */

        const users =
            getAllUsers();


        if (user.username) {

            users[user.username] =
                user;

            saveAllUsers(
                users
            );

        }


        return true;

    } catch (error) {

        console.error(
            "Error setting current user:",
            error
        );

        return false;

    }

}


/* =========================================
   UPDATE CURRENT USER
========================================= */

function updateCurrentUser(
    updates
) {

    const currentUser =
        getUser();


    if (!currentUser) {

        return null;

    }


    const updatedUser = {

        ...currentUser,

        ...updates

    };


    /*
     * Progress نباید از بین برود
     */

    if (
        !updatedUser.progress
    ) {

        updatedUser.progress = {

            completedLessons: []

        };

    }


    if (
        !Array.isArray(
            updatedUser
                .progress
                .completedLessons
        )
    ) {

        updatedUser.progress.completedLessons =
            [];

    }


    setCurrentUser(
        updatedUser
    );


    return updatedUser;

}


/* =========================================
   ADD XP
========================================= */

function addXP(
    amount
) {

    const currentUser =
        getUser();


    if (!currentUser) {

        return null;

    }


    amount =
        Number(
            amount
        );


    if (
        !Number.isFinite(
            amount
        )
    ) {

        return currentUser;

    }


    if (
        amount <= 0
    ) {

        return currentUser;

    }


    const oldXP =
        Number(
            currentUser.xp || 0
        );


    const newXP =
        oldXP +
        amount;


    currentUser.xp =
        newXP;


    setCurrentUser(
        currentUser
    );


    return currentUser;

}


/* =========================================
   GET XP
========================================= */

function getUserXP() {

    const user =
        getUser();


    if (!user) {

        return 0;

    }


    return Number(
        user.xp || 0
    );

}


/* =========================================
   COMPLETE LESSON
========================================= */

function completeLesson(
    lessonId,
    xpReward = 20
) {

    const currentUser =
        getUser();


    if (!currentUser) {

        return {

            success: false,

            message:
                "کاربری وارد نشده است."

        };

    }


    if (!lessonId) {

        return {

            success: false,

            message:
                "شناسه درس مشخص نیست."

        };

    }


    /*
     * اطمینان از وجود progress
     */

    if (
        !currentUser.progress
    ) {

        currentUser.progress = {

            completedLessons: []

        };

    }


    if (
        !Array.isArray(
            currentUser
                .progress
                .completedLessons
        )
    ) {

        currentUser
            .progress
            .completedLessons = [];

    }


    const completed =
        currentUser
            .progress
            .completedLessons;


    /*
     * اگر قبلاً کامل شده،
     * دوباره XP نده.
     */

    if (
        completed.includes(
            lessonId
        )
    ) {

        return {

            success: true,

            alreadyCompleted:
                true,

            user:
                currentUser

        };

    }


    /*
     * ثبت درس
     */

    completed.push(
        lessonId
    );


    /*
     * XP
     */

    xpReward =
        Number(
            xpReward
        );


    if (
        !Number.isFinite(
            xpReward
        ) ||
        xpReward < 0
    ) {

        xpReward = 20;

    }


    currentUser.xp =
        Number(
            currentUser.xp || 0
        ) +
        xpReward;


    /*
     * ذخیره
     */

    setCurrentUser(
        currentUser
    );


    return {

        success: true,

        alreadyCompleted:
            false,

        xpAdded:
            xpReward,

        user:
            currentUser

    };

}


/* =========================================
   IS LESSON COMPLETED
========================================= */

function isLessonCompleted(
    lessonId
) {

    const user =
        getUser();


    if (
        !user ||
        !user.progress ||
        !Array.isArray(
            user.progress
                .completedLessons
        )
    ) {

        return false;

    }


    return user
        .progress
        .completedLessons
        .includes(
            lessonId
        );

}


/* =========================================
   GET COMPLETED LESSONS
========================================= */

function getCompletedLessonIds() {

    const user =
        getUser();


    if (
        !user ||
        !user.progress ||
        !Array.isArray(
            user.progress
                .completedLessons
        )
    ) {

        return [];

    }


    return [
        ...user
            .progress
            .completedLessons
    ];

}


/* =========================================
   GET COMPLETED COUNT
========================================= */

function getCompletedLessonCount() {

    return getCompletedLessonIds()
        .length;

}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem(
        CURRENT_USER_KEY
    );

}


/* =========================================
   IS LOGGED IN
========================================= */

function isLoggedIn() {

    return (
        getUser() !== null
    );

}


/* =========================================
   USER ID
========================================= */

function generateUserId() {

    return (
        "user_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );

}


/* =========================================
   LEVEL
========================================= */

function getUserLevel() {

    const xp =
        getUserXP();


    return (
        Math.floor(
            xp / 100
        ) + 1
    );

}


/* =========================================
   LEVEL PROGRESS
========================================= */

function getLevelProgress() {

    const xp =
        getUserXP();


    const level =
        getUserLevel();


    const currentLevelXP =
        (level - 1) * 100;


    const insideLevelXP =
        xp -
        currentLevelXP;


    return Math.min(
        100,
        Math.max(
            0,
            insideLevelXP
        )
    );

}


/* =========================================
   UPDATE USERNAME
========================================= */

function updateUsername(
    newUsername
) {

    const user =
        getUser();


    if (!user) {

        return {

            success: false,

            message:
                "کاربری وارد نشده است."

        };

    }


    newUsername =
        String(
            newUsername || ""
        ).trim();


    if (
        newUsername.length < 3
    ) {

        return {

            success: false,

            message:
                "نام کاربری باید حداقل ۳ کاراکتر باشد."

        };

    }


    const users =
        getAllUsers();


    /*
     * جلوگیری از تکراری بودن
     */

    for (
        const key in users
    ) {

        if (
            key.toLowerCase() ===
            newUsername.toLowerCase() &&
            key !== user.username
        ) {

            return {

                success: false,

                message:
                    "این نام کاربری قبلاً استفاده شده است."

            };

        }

    }


    /*
     * حذف کلید قدیمی
     */

    if (
        user.username &&
        users[user.username]
    ) {

        delete users[
            user.username
        ];

    }


    user.username =
        newUsername;


    users[newUsername] =
        user;


    saveAllUsers(
        users
    );


    localStorage.setItem(
        CURRENT_USER_KEY,
        JSON.stringify(user)
    );


    return {

        success: true,

        user:
            user

    };

}


/* =========================================
   AUTO SYNC
========================================= */

function syncCurrentUser() {

    const currentUser =
        getUser();


    if (!currentUser) {

        return null;

    }


    const users =
        getAllUsers();


    if (
        currentUser.username &&
        users[currentUser.username]
    ) {

        const storedUser =
            users[
                currentUser.username
            ];


        /*
         * نسخه ذخیره‌شده را
         * روی current user اعمال کن.
         */

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(
                storedUser
            )
        );


        return storedUser;

    }


    return currentUser;

}
