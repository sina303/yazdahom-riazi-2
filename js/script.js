/* =========================================
   AXIS — HOME
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadUserStats();

        setupSmoothScroll();

    }
);


/* =========================================
   USER XP
========================================= */

function loadUserStats() {

    const xpElement =
        document.getElementById(
            "xpValue"
        );


    if (!xpElement) {

        return;

    }


    let xp = 0;


    /*
     * اول سیستم جدید AXIS
     */

    try {

        const progress =
            JSON.parse(
                localStorage.getItem(
                    "axis_progress"
                )
            );


        if (
            progress &&
            typeof progress.xp ===
            "number"
        ) {

            xp =
                progress.xp;

        }

    } catch {

        xp = 0;

    }


    xpElement.textContent =
        toPersianNumber(
            xp
        );

}


/* =========================================
   SMOOTH SCROLL
========================================= */

function setupSmoothScroll() {

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const id =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !id ||
                            id === "#"
                        ) {

                            return;

                        }


                        const target =
                            document.querySelector(
                                id
                            );


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        target.scrollIntoView(
                            {
                                behavior:
                                    "smooth",
                                block:
                                    "start"
                            }
                        );

                    }
                );

            }
        );

}


/* =========================================
   PERSIAN NUMBERS
========================================= */

function toPersianNumber(
    value
) {

    return String(
        value
    ).replace(
        /\d/g,
        digit =>
            "۰۱۲۳۴۵۶۷۸۹"[digit]
    );

}
