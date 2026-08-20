/* =========================================
   LOGIN SYSTEM
   YAZDAHOM PLUS
========================================= */


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeLogin();

    }
);


/* =========================================
   INITIALIZE LOGIN
========================================= */

function initializeLogin() {

    /*
     * اگر قبلاً وارد شده،
     * مستقیم وارد سایت شود.
     */

    if (
        typeof isLoggedIn === "function" &&
        isLoggedIn()
    ) {

        const currentUser =
            getUser();

        /*
         * فقط اگر login page هستیم
         * redirect کن.
         */

        if (
            currentUser &&
            !window.location.pathname.endsWith(
                "login.html"
            )
        ) {

            return;

        }

    }


    const form =
        document.getElementById(
            "loginForm"
        );


    if (!form) {

        console.error(
            "loginForm پیدا نشد."
        );

        return;

    }


    form.addEventListener(
        "submit",
        handleLogin
    );


    setupUsernameInput();

}


/* =========================================
   USERNAME INPUT
========================================= */

function setupUsernameInput() {

    const input =
        document.getElementById(
            "username"
        );


    if (!input) {
        return;
    }


    /*
     * حذف فاصله اضافی
     */

    input.addEventListener(
        "input",
        () => {

            input.value =
                input.value.replace(
                    /\s+/g,
                    " "
                );

        }
    );


    /*
     * Enter
     */

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                const form =
                    input.closest(
                        "form"
                    );


                if (form) {

                    form.requestSubmit();

                }

            }

        }
    );

}


/* =========================================
   HANDLE LOGIN
========================================= */

function handleLogin(
    event
) {

    event.preventDefault();


    const input =
        document.getElementById(
            "username"
        );


    const button =
        document.getElementById(
            "loginButton"
        );


    if (!input) {
        return;
    }


    const username =
        input.value.trim();


    /*
     * Validate
     */

    const validation =
        validateUsername(
            username
        );


    if (!validation.valid) {

        showLoginMessage(
            validation.message,
            true
        );

        input.focus();

        return;

    }


    /*
     * Loading
     */

    setLoginLoading(
        button,
        true
    );


    hideLoginMessage();


    /*
     * کمی تأخیر برای UX بهتر
     */

    setTimeout(
        () => {

            try {

                const result =
                    createUser(
                        username
                    );


                if (
                    !result ||
                    !result.success
                ) {

                    showLoginMessage(
                        result?.message ||
                        "ورود انجام نشد.",
                        true
                    );


                    setLoginLoading(
                        button,
                        false
                    );


                    return;

                }


                /*
                 * موفق
                 */

                showLoginMessage(
                    result.existing
                        ? `خوش برگشتی ${result.user.username}`
                        : `حساب ${result.user.username} ساخته شد`,
                    false
                );


                /*
                 * ورود به صفحه اصلی
                 */

                setTimeout(
                    () => {

                        window.location.href =
                            "index.html";

                    },
                    500
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showLoginMessage(
                    "خطایی هنگام ورود رخ داد. دوباره امتحان کن.",
                    true
                );


                setLoginLoading(
                    button,
                    false
                );

            }

        },
        250
    );

}


/* =========================================
   VALIDATE USERNAME
========================================= */

function validateUsername(
    username
) {

    if (!username) {

        return {

            valid: false,

            message:
                "نام کاربری را وارد کن."

        };

    }


    if (
        username.length < 3
    ) {

        return {

            valid: false,

            message:
                "نام کاربری باید حداقل ۳ کاراکتر باشد."

        };

    }


    if (
        username.length > 30
    ) {

        return {

            valid: false,

            message:
                "نام کاربری نباید بیشتر از ۳۰ کاراکتر باشد."

        };

    }


    /*
     * کاراکترهای غیرمجاز
     *
     * فارسی، انگلیسی، عدد، _ و -
     * مجاز هستند.
     */

    const validPattern =
        /^[\u0600-\u06FFa-zA-Z0-9_-]+(?: [\u0600-\u06FFa-zA-Z0-9_-]+)*$/;


    if (
        !validPattern.test(
            username
        )
    ) {

        return {

            valid: false,

            message:
                "نام کاربری فقط می‌تواند شامل حروف، عدد، فاصله، _ و - باشد."

        };

    }


    return {

        valid: true,

        message: ""

    };

}


/* =========================================
   LOGIN LOADING
========================================= */

function setLoginLoading(
    button,
    loading
) {

    if (!button) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        button.dataset.originalText =
            button.innerHTML;


        button.innerHTML =
            `
                در حال ورود...
                <span class="login-spinner"></span>
            `;

    } else {

        button.innerHTML =
            button.dataset.originalText ||
            "ورود";

    }

}


/* =========================================
   SHOW MESSAGE
========================================= */

function showLoginMessage(
    message,
    isError = false
) {

    /*
     * اول دنبال loginMessage می‌گردیم.
     */

    let messageElement =
        document.getElementById(
            "loginMessage"
        );


    /*
     * اگر نبود، ممکن است در HTML
     * اسم message استفاده شده باشد.
     */

    if (!messageElement) {

        messageElement =
            document.getElementById(
                "message"
            );

    }


    if (!messageElement) {

        console.warn(
            "loginMessage پیدا نشد:",
            message
        );

        return;

    }


    messageElement.textContent =
        message;


    messageElement.classList.add(
        "visible"
    );


    if (isError) {

        messageElement.classList.add(
            "error"
        );


        messageElement.classList.remove(
            "success"
        );

    } else {

        messageElement.classList.add(
            "success"
        );


        messageElement.classList.remove(
            "error"
        );

    }

}


/* =========================================
   HIDE MESSAGE
========================================= */

function hideLoginMessage() {

    const messageElement =
        document.getElementById(
            "loginMessage"
        ) ||
        document.getElementById(
            "message"
        );


    if (!messageElement) {
        return;
    }


    messageElement.classList.remove(
        "visible"
    );


    messageElement.classList.remove(
        "error"
    );


    messageElement.classList.remove(
        "success"
    );

}


/* =========================================
   REDIRECT IF LOGGED IN
========================================= */

function redirectIfLoggedIn() {

    if (
        typeof isLoggedIn !==
        "function"
    ) {

        return false;

    }


    if (
        !isLoggedIn()
    ) {

        return false;

    }


    window.location.href =
        "index.html";


    return true;

}
