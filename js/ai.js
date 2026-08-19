/* =========================================
   AI ASSISTANT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupAI();
});


/* =========================================
   CONFIG
========================================= */

const AI_BACKEND_URL =
    "https://yazdahom-riazi-production.up.railway.app";


/* =========================================
   STATE
========================================= */

let selectedAIImage = null;


/* =========================================
   SETUP
========================================= */

function setupAI() {

    const sendButton =
        document.getElementById(
            "aiSendButton"
        );

    const imageInput =
        document.getElementById(
            "aiImageInput"
        );

    const removeImageButton =
        document.getElementById(
            "removeAiImage"
        );


    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendAIQuestion
        );

    }


    if (imageInput) {

        imageInput.addEventListener(
            "change",
            handleAIImage
        );

    }


    if (removeImageButton) {

        removeImageButton.addEventListener(
            "click",
            removeAIImage
        );

    }

}


/* =========================================
   SEND QUESTION
========================================= */

async function sendAIQuestion() {

    const questionInput =
        document.getElementById(
            "aiQuestion"
        );

    const sendButton =
        document.getElementById(
            "aiSendButton"
        );

    const responseBox =
        document.getElementById(
            "aiResponse"
        );

    const responseContent =
        document.getElementById(
            "aiResponseContent"
        );


    if (!questionInput) {
        return;
    }


    const question =
        questionInput.value.trim();


    /* -----------------------------------------
       Validate
    ----------------------------------------- */

    if (!question && !selectedAIImage) {

        showAIResponse(
            "لطفاً سؤال خودت را بنویس یا یک تصویر ارسال کن.",
            true
        );

        return;
    }


    /* -----------------------------------------
       Loading
    ----------------------------------------- */

    if (sendButton) {

        sendButton.disabled = true;

        sendButton.textContent =
            "در حال فکر کردن...";

    }


    if (responseBox) {

        responseBox.classList.remove(
            "hidden"
        );

    }


    if (responseContent) {

        responseContent.textContent =
            "در حال بررسی سؤال...";

    }


    try {

        /* -------------------------------------
           Build request
        ------------------------------------- */

        const formData =
            new FormData();


        if (question) {

            formData.append(
                "question",
                question
            );

        }


        if (selectedAIImage) {

            formData.append(
                "image",
                selectedAIImage
            );

        }


        /* -------------------------------------
           Send to Railway
        ------------------------------------- */

        const response =
            await fetch(
                `${AI_BACKEND_URL}/api/ai`,
                {
                    method: "POST",
                    body: formData
                }
            );


        /* -------------------------------------
           Read response
        ------------------------------------- */

        let data;

        try {

            data =
                await response.json();

        } catch {

            throw new Error(
                "پاسخ نامعتبر از سرور دریافت شد."
            );

        }


        /* -------------------------------------
           HTTP error
        ------------------------------------- */

        if (!response.ok) {

            throw new Error(
                data.message ||
                data.error ||
                "خطایی در ارتباط با سرور رخ داد."
            );

        }


        /* -------------------------------------
           Extract AI answer
        ------------------------------------- */

        const answer =
            data.answer ||
            data.response ||
            data.message ||
            data.text;


        if (!answer) {

            throw new Error(
                "پاسخ هوش مصنوعی خالی است."
            );

        }


        /* -------------------------------------
           Show answer
        ------------------------------------- */

        showAIResponse(
            answer,
            false
        );


    } catch (error) {

        console.error(
            "AI Error:",
            error
        );


        showAIResponse(
            getAIErrorMessage(error),
            true
        );


    } finally {

        if (sendButton) {

            sendButton.disabled = false;

            sendButton.textContent =
                "ارسال سؤال →";

        }

    }

}


/* =========================================
   SHOW RESPONSE
========================================= */

function showAIResponse(
    message,
    isError = false
) {

    const responseBox =
        document.getElementById(
            "aiResponse"
        );

    const responseContent =
        document.getElementById(
            "aiResponseContent"
        );


    if (!responseBox || !responseContent) {
        return;
    }


    responseBox.classList.remove(
        "hidden"
    );


    responseContent.textContent =
        message;


    if (isError) {

        responseContent.style.color =
            "#e05252";

    } else {

        responseContent.style.color =
            "";

    }

}


/* =========================================
   IMAGE SELECT
========================================= */

function handleAIImage(event) {

    const file =
        event.target.files &&
        event.target.files[0];


    if (!file) {
        return;
    }


    /* -----------------------------------------
       Validate image
    ----------------------------------------- */

    if (!file.type.startsWith("image/")) {

        alert(
            "لطفاً یک فایل تصویری انتخاب کن."
        );

        event.target.value = "";

        return;
    }


    /* -----------------------------------------
       Size limit
    ----------------------------------------- */

    const maxSize =
        10 * 1024 * 1024;


    if (file.size > maxSize) {

        alert(
            "حجم تصویر نباید بیشتر از ۱۰ مگابایت باشد."
        );

        event.target.value = "";

        return;
    }


    selectedAIImage =
        file;


    showAIImagePreview(
        file
    );

}


/* =========================================
   IMAGE PREVIEW
========================================= */

function showAIImagePreview(
    file
) {

    const preview =
        document.getElementById(
            "aiImagePreview"
        );

    const image =
        document.getElementById(
            "aiPreviewImage"
        );


    if (!preview || !image) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = () => {

        image.src =
            reader.result;

        preview.classList.remove(
            "hidden"
        );

    };


    reader.readAsDataURL(
        file
    );

}


/* =========================================
   REMOVE IMAGE
========================================= */

function removeAIImage() {

    selectedAIImage =
        null;


    const input =
        document.getElementById(
            "aiImageInput"
        );

    const preview =
        document.getElementById(
            "aiImagePreview"
        );

    const image =
        document.getElementById(
            "aiPreviewImage"
        );


    if (input) {

        input.value = "";

    }


    if (image) {

        image.src = "";

    }


    if (preview) {

        preview.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   ERROR MESSAGES
========================================= */

function getAIErrorMessage(
    error
) {

    const message =
        error?.message || "";


    if (
        message.includes(
            "Failed to fetch"
        )
    ) {

        return `
ارتباط با سرور هوش مصنوعی برقرار نشد.

ممکن است بک‌اند Railway خاموش باشد
یا آدرس API تغییر کرده باشد.
        `.trim();

    }


    if (
        message.includes(
            "NetworkError"
        )
    ) {

        return `
خطای شبکه رخ داد.
اتصال اینترنت و وضعیت سرور را بررسی کن.
        `.trim();

    }


    return (
        message ||
        "یک خطای ناشناخته در هوش مصنوعی رخ داد."
    );

}
