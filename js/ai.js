/* =========================================
   AI ASSISTANT
   Yazdahom Plus
========================================= */


/*
 * IMPORTANT
 *
 * آدرس بک‌اند Railway پروژه
 *
 * اگر بعداً آدرس Backend عوض شد،
 * فقط همین مقدار را تغییر بده.
 */

const AI_API_URL =
    "https://yazdahom-riazi-production.up.railway.app/api/ai";


let selectedAIImage = null;


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeAI();

    }
);


/* =========================================
   INITIALIZE AI
========================================= */

function initializeAI() {

    const openButton =
        document.getElementById(
            "openAIButton"
        );


    const closeButton =
        document.getElementById(
            "closeAIButton"
        );


    const modal =
        document.getElementById(
            "aiModal"
        );


    const overlay =
        document.querySelector(
            ".ai-modal-overlay"
        );


    const form =
        document.getElementById(
            "aiForm"
        );


    const imageInput =
        document.getElementById(
            "aiImage"
        );


    /* -----------------------------
       Open
    ----------------------------- */

    if (openButton) {

        openButton.addEventListener(
            "click",
            openAIModal
        );

    }


    /* -----------------------------
       Close
    ----------------------------- */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeAIModal
        );

    }


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeAIModal
        );

    }


    /* -----------------------------
       Submit
    ----------------------------- */

    if (form) {

        form.addEventListener(
            "submit",
            handleAISubmit
        );

    }


    /* -----------------------------
       Image
    ----------------------------- */

    if (imageInput) {

        imageInput.addEventListener(
            "change",
            handleImageSelect
        );

    }


    /* -----------------------------
       ESC
    ----------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeAIModal();

            }

        }
    );

}


/* =========================================
   OPEN AI
========================================= */

function openAIModal() {

    const modal =
        document.getElementById(
            "aiModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    const question =
        document.getElementById(
            "aiQuestion"
        );


    if (question) {

        setTimeout(
            () => question.focus(),
            100
        );

    }


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE AI
========================================= */

function closeAIModal() {

    const modal =
        document.getElementById(
            "aiModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "open"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";


    /*
     * Don't delete the answer.
     * User can reopen the AI modal
     * and see the previous response.
     */

}


/* =========================================
   IMAGE SELECT
========================================= */

function handleImageSelect(
    event
) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {

        selectedAIImage = null;

        return;

    }


    /* -----------------------------
       Validate type
    ----------------------------- */

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        showAIResult(
            "فایل انتخاب‌شده تصویر نیست.",
            true
        );


        event.target.value =
            "";


        selectedAIImage = null;

        return;

    }


    /* -----------------------------
       Validate size
    ----------------------------- */

    const maxSize =
        10 * 1024 * 1024;


    if (
        file.size > maxSize
    ) {

        showAIResult(
            "حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد.",
            true
        );


        event.target.value =
            "";


        selectedAIImage = null;

        return;

    }


    selectedAIImage =
        file;


    showAIResult(
        `تصویر «${file.name}» آماده ارسال است.`,
        false
    );

}


/* =========================================
   SUBMIT
========================================= */

async function handleAISubmit(
    event
) {

    event.preventDefault();


    const questionInput =
        document.getElementById(
            "aiQuestion"
        );


    const submitButton =
        document.getElementById(
            "aiSubmitButton"
        );


    if (!questionInput) {
        return;
    }


    const question =
        questionInput.value.trim();


    /*
     * At least one input
     */

    if (
        !question &&
        !selectedAIImage
    ) {

        showAIResult(
            "اول سؤال خودت را بنویس یا یک عکس از سؤال انتخاب کن.",
            true
        );

        return;

    }


    /* -----------------------------
       Loading
    ----------------------------- */

    setAILoading(
        true
    );


    showAIResult(
        "در حال بررسی سؤال...",
        false
    );


    try {

        /*
         * Convert image to Base64
         */

        let imageBase64 =
            null;


        if (selectedAIImage) {

            imageBase64 =
                await fileToBase64(
                    selectedAIImage
                );

        }


        /*
         * Build request
         */

        const payload = {

            question:
                question,

            image:
                imageBase64

        };


        /*
         * Send to Railway
         */

        const response =
            await fetch(
                AI_API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            payload
                        )

                }
            );


        /*
         * Read response
         */

        let result = null;


        try {

            result =
                await response.json();

        } catch {

            throw new Error(
                "پاسخ نامعتبر از سرور دریافت شد."
            );

        }


        /*
         * HTTP error
         */

        if (!response.ok) {

            throw new Error(
                result?.message ||
                result?.error ||
                `خطای سرور (${response.status})`
            );

        }


        /*
         * Backend success
         */

        const answer =
            extractAIAnswer(
                result
            );


        if (!answer) {

            throw new Error(
                "سرور پاسخ خالی برگرداند."
            );

        }


        showAIResult(
            answer,
            false
        );


    } catch (error) {

        console.error(
            "AI request error:",
            error
        );


        showAIResult(
            getFriendlyAIError(
                error
            ),
            true
        );


    } finally {

        setAILoading(
            false
        );

    }

}


/* =========================================
   FILE → BASE64
========================================= */

function fileToBase64(
    file
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "خواندن تصویر انجام نشد."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* =========================================
   EXTRACT ANSWER
========================================= */

function extractAIAnswer(
    result
) {

    if (!result) {
        return "";
    }


    /*
     * Support several possible
     * backend response formats.
     */


    if (
        typeof result === "string"
    ) {

        return result;

    }


    if (
        typeof result.answer ===
        "string"
    ) {

        return result.answer;

    }


    if (
        typeof result.response ===
        "string"
    ) {

        return result.response;

    }


    if (
        typeof result.message ===
        "string" &&
        result.success !== false
    ) {

        return result.message;

    }


    if (
        result.data &&
        typeof result.data.answer ===
        "string"
    ) {

        return result.data.answer;

    }


    if (
        result.data &&
        typeof result.data.response ===
        "string"
    ) {

        return result.data.response;

    }


    return "";

}


/* =========================================
   AI RESULT
========================================= */

function showAIResult(
    message,
    isError = false
) {

    const result =
        document.getElementById(
            "aiResult"
        );


    if (!result) {
        return;
    }


    result.textContent =
        message || "";


    result.classList.add(
        "visible"
    );


    if (isError) {

        result.classList.add(
            "error"
        );

    } else {

        result.classList.remove(
            "error"
        );

    }

}


/* =========================================
   LOADING
========================================= */

function setAILoading(
    loading
) {

    const button =
        document.getElementById(
            "aiSubmitButton"
        );


    if (!button) {
        return;
    }


    button.disabled =
        loading;


    if (loading) {

        button.innerHTML =
            `
                در حال بررسی...
                <span>⌛</span>
            `;

    } else {

        button.innerHTML =
            `
                ارسال سؤال
                <span>→</span>
            `;

    }

}


/* =========================================
   FRIENDLY ERRORS
========================================= */

function getFriendlyAIError(
    error
) {

    const message =
        error?.message ||
        "";


    if (
        message.includes(
            "Failed to fetch"
        )
    ) {

        return `
اتصال به سرور AI برقرار نشد.

ممکن است:
• Railway موقتاً در دسترس نباشد
• آدرس Backend تغییر کرده باشد
• یا مشکل CORS وجود داشته باشد.

وضعیت Backend را بررسی کن.
        `.trim();

    }


    if (
        message.includes(
            "401"
        )
    ) {

        return `
دسترسی به سرویس AI تأیید نشد.

تنظیمات API در Backend را بررسی کن.
        `.trim();

    }


    if (
        message.includes(
            "429"
        )
    ) {

        return `
محدودیت استفاده از سرویس AI پر شده است.

کمی بعد دوباره امتحان کن.
        `.trim();

    }


    if (
        message.includes(
            "500"
        )
    ) {

        return `
داخل Backend خطایی رخ داده است.

لگ‌های Railway را بررسی کن.
        `.trim();

    }


    return (
        message ||
        "در ارتباط با دستیار هوشمند مشکلی رخ داد."
    );

}
