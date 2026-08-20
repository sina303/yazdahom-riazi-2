/* =========================================
   USER SYSTEM
   Yazdahom Plus
========================================= */

const USER_STORAGE_KEY = "yazdahom_user";


/* =========================================
   DEFAULT USER
========================================= */

const DEFAULT_USER = {
    username: "",
    xp: 0,
    level: 1,
    createdAt: null
};


/* =========================================
   GET USER
========================================= */

function getUser() {

    try {

        const savedUser =
            localStorage.getItem(
                USER_STORAGE_KEY
            );


        if (!savedUser) {

            return {
                ...DEFAULT_USER
            };

        }


        const user =
            JSON.parse(savedUser);


        return {
            ...DEFAULT_USER,
            ...user
        };


    } catch (error) {

        console.error(
            "Could not read user:",
            error
        );


        return {
            ...DEFAULT_USER
        };

    }

}


/* =========================================
   SAVE USER
========================================= */

function saveUser(user) {

    try {

        localStorage.setItem(
            USER_STORAGE_KEY,
            JSON.stringify(user)
        );


        return true;

    } catch (error) {

        console.error(
            "Could not save user:",
            error
        );


        return false;

    }

}


/* =========================================
   CREATE USER
========================================= */

function createUser(username) {

    const cleanUsername =
        String(username || "").trim();


    if (!cleanUsername) {

        return false;

    }


    const user = {

        username: cleanUsername,

        xp: 0,

        level: 1,

        createdAt:
            new Date().toISOString()

    };


    return saveUser(user);

}


/* =========================================
   UPDATE USER
========================================= */

function updateUser(changes) {

    const currentUser =
        getUser();


    const updatedUser = {

        ...currentUser,

        ...changes

    };


    saveUser(updatedUser);


    return updatedUser;

}


/* =========================================
   ADD XP
========================================= */

function addXP(amount) {

    const xpAmount =
        Number(amount);


    if (
        !Number.isFinite(xpAmount) ||
        xpAmount <= 0
    ) {

        return getUser();

    }


    const user =
        getUser();


    const newXP =
        user.xp + xpAmount;


    const newLevel =
        getLevel(newXP);


    return updateUser({

        xp: newXP,

        level: newLevel

    });

}


/* =========================================
   GET LEVEL
========================================= */

function getLevel(xp) {

    const value =
        Math.max(
            0,
            Number(xp) || 0
        );


    /*
        هر 100 XP یک Level
        فعلاً سیستم ساده است.
    */

    return Math.floor(
        value / 100
    ) + 1;

}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem(
        USER_STORAGE_KEY
    );


    window.location.href =
        "login.html";

}


/* =========================================
   IS LOGGED IN
========================================= */

function isLoggedIn() {

    const user =
        getUser();


    return Boolean(
        user.username &&
        user.username.trim()
    );

}


/* =========================================
   CHECK USER ACCESS
========================================= */

function checkUserAccess() {

    const isLoginPage =
        window.location.pathname
            .toLowerCase()
            .endsWith("login.html");


    /*
        Login page برای کاربر
        بدون ورود آزاد است.
    */

    if (isLoginPage) {

        return true;

    }


    /*
        سایر صفحات نیاز به Login دارند.
    */

    if (!isLoggedIn()) {

        window.location.href =
            "login.html";


        return false;

    }


    return true;

}


/* =========================================
   UPDATE HEADER
========================================= */

function updateUserInfo() {

    const user =
        getUser();


    const usernameElement =
        document.getElementById(
            "headerUsername"
        );


    const xpElement =
        document.getElementById(
            "headerXP"
        );


    const levelElement =
        document.getElementById(
            "headerLevel"
        );


    if (usernameElement) {

        usernameElement.textContent =
            user.username || "کاربر";

    }


    if (xpElement) {

        xpElement.textContent =
            user.xp;

    }


    if (levelElement) {

        levelElement.textContent =
            user.level;

    }

}


/* =========================================
   AUTO ACCESS CHECK
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkUserAccess();

        updateUserInfo();

    }
);
