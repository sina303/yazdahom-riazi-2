/* =========================================
THEME LOADER + AUTH CHECK + MOBILE MENU
========================================= */
(function() {
  /* =========================================
  چک رمز — اول از همه
  ========================================= */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  /* اگه توی lock.html هستیم، فقط تم رو لود کن و کاری به منو نداشته باش */
  if (currentPage === "lock.html") {
    const theme = localStorage.getItem("y11_theme") || "green";
    document.documentElement.setAttribute("data-theme", theme);
    return;
  }

  /* اگه رمز وارد نشده، بفرست به lock */
  const isAuth = localStorage.getItem("axis_auth") === "true";
  if (!isAuth) {
    window.location.replace("lock.html");
    return;
  }

  /* =========================================
  تم
  ========================================= */
  const theme = localStorage.getItem("y11_theme") || "green";
  document.documentElement.setAttribute("data-theme", theme);

  /* =========================================
  MOBILE MENU — فقط اگه هدر داشته باشیم
  ========================================= */
  function setupMobileMenu() {
    const headers = document.querySelectorAll(
      ".site-header, .hesaban-header, .chapter-header, .lesson-header, .profile-header, .formulas-header, .gpa-header, .about-header, .settings-header"
    );

    headers.forEach((header) => {
      const nav = header.querySelector("nav");
      if (!nav) return;

      /* اگه قبلاً دکمه اضافه شده، رد کن */
      if (header.querySelector(".mobile-menu-btn")) return;

      /* دکمه‌ی همبرگری بساز */
      const btn = document.createElement("button");
      btn.className = "mobile-menu-btn";
      btn.innerHTML = "☰";
      btn.setAttribute("aria-label", "منو");

      btn.addEventListener("click", () => {
        nav.classList.toggle("open");
        btn.innerHTML = nav.classList.contains("open") ? "✕" : "☰";
      });

      /* دکمه رو قبل از nav اضافه کن */
      header.insertBefore(btn, nav);

      /* کلیک روی لینک‌ها، منو رو ببنده */
      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("open");
          btn.innerHTML = "☰";
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMobileMenu);
  } else {
    setupMobileMenu();
  }
})();
