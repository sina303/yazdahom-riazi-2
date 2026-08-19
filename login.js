```javascript
/* =========================================
   LOGIN SYSTEM
   Yazdahom Riazi
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const errorElement = document.getElementById("loginError");

    if (!form || !usernameInput) {
        return;
    }


    /* =========================================
       CHECK EXISTING USER
    ========================================= */

    const existingUser = getUser();

    if (existingUser && existingUser.username) {

        usernameInput.value = existingUser.username;

    }


    /* =========================================
       LOGIN
    ========================================= */

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const username = usernameInput.value.trim();


        /* -----------------------------------------
           VALIDATION
        ----------------------------------------- */

        if (!username) {

            showError("لطفاً نام کاربری را وارد کن.");

            usernameInput.focus();

            return;
        }


        if (username.length < 3) {

            showError(
                "نام کاربری باید حداقل ۳ کاراکتر داشته باشد."
            );

            usernameInput.focus();

            return;
        }


        if (username.length > 30) {

            showError(
                "نام کاربری نمی‌تواند بیشتر از ۳۰ کاراکتر باشد."
            );

            usernameInput.focus();

            return;
        }


        /* -----------------------------------------
           ALLOWED CHARACTERS
        ----------------------------------------- */

        const validUsername =
            /^[a-zA-Z0-9_\u0600-\u06FF]+$/;

        if (!validUsername.test(username)) {

            showError(
                "نام کاربری فقط می‌تواند شامل حروف، اعداد و _ باشد."
            );

            usernameInput.focus();

            return;
        }


        /* -----------------------------------------
           CREATE / UPDATE USER
        ----------------------------------------- */

        try {

            createUser(username);

        } catch (error) {

            console.error(error);

            showError(
                "خطایی هنگام ورود رخ داد. دوباره تلاش کن."
            );

            return;
        }


        /* -----------------------------------------
           REDIRECT
        ----------------------------------------- */

        window.location.href = "index.html";

    });


    /* =========================================
       ERROR
    ========================================= */

    function showError(message) {

        if (!errorElement) {
            return;
        }

        errorElement.textContent = message;

    }

});
```
