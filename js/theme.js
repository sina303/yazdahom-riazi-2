/* =========================================
THEME + AUTH + MOBILE MENU + MEMORIAL
========================================= */
(async function() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  /* توی lock.html فقط تم */
  if (currentPage === "lock.html") {
    const theme = localStorage.getItem("y11_theme") || "green";
    document.documentElement.setAttribute("data-theme", theme);
    return;
  }

  /* چک احراز هویت — اول Supabase */
  let isAuth = false;

  if (typeof supabaseClient !== 'undefined' && supabaseClient) {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        isAuth = true;
        console.log("✅ Supabase user:", user.email);
      }
    } catch (e) {
      console.log("⚠️ Supabase auth failed:", e.message);
    }
  }

  /* اگه Supabase نبود، از localStorage چک کن */
  if (!isAuth) {
    isAuth = localStorage.getItem("axis_auth") === "true";
  }

  /* اگه رمز وارد نشده، بفرست به lock */
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
  MOBILE MENU
  ========================================= */
  function setupMobileMenu() {
    const headers = document.querySelectorAll(
      ".site-header, .hesaban-header, .chapter-header, .lesson-header, .profile-header, .formulas-header, .gpa-header, .about-header, .settings-header"
    );

    headers.forEach((header) => {
      const nav = header.querySelector("nav");
      if (!nav) return;
      if (header.querySelector(".mobile-menu-btn")) return;

      const btn = document.createElement("button");
      btn.className = "mobile-menu-btn";
      btn.innerHTML = "☰";
      btn.setAttribute("aria-label", "منو");

      btn.addEventListener("click", () => {
        nav.classList.toggle("open");
        btn.innerHTML = nav.classList.contains("open") ? "✕" : "☰";
      });

      header.insertBefore(btn, nav);

      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          nav.classList.remove("open");
          btn.innerHTML = "☰";
        });
      });
    });
  }

  /* =========================================
  MEMORIAL — Easter Egg با شمع
  ========================================= */
  function setupMemorialStar() {
    if (document.getElementById("memorialStar")) return;

    /* ستاره‌ی کوچیک (دکمه‌ی باز کردن) */
    const star = document.createElement("div");
    star.className = "memorial-star";
    star.id = "memorialStar";
    star.setAttribute("aria-label", "یادبود");
    star.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2 L14.09 8.26 L20.5 8.74 L15.54 12.97 L17.34 19.5 L12 15.77 L6.66 19.5 L8.46 12.97 L3.5 8.74 L9.91 8.26 Z"/>
      </svg>
    `;
    document.body.appendChild(star);

    /* مودال — با شمع */
    const modal = document.createElement("div");
    modal.className = "memorial-modal";
    modal.id = "memorialModal";
    modal.innerHTML = `
      <div class="memorial-stars" id="memorialStars"></div>
      <div class="memorial-glow"></div>
      <div class="memorial-content">
        <div class="memorial-candle">
          <div class="candle-flame"></div>
          <div class="candle-halo"></div>
          <div class="candle-wick"></div>
          <div class="candle-body"></div>
        </div>
        <h1 class="memorial-title">جاویدنامان</h1>
        <p class="memorial-text">اینجا اسمی گفته نمی‌شه.</p>
        <p class="memorial-text">فقط سکوت می‌کنیم.</p>
        <p class="memorial-text">برای آن‌ها که رفتند،</p>
        <p class="memorial-text">تا ما بمانیم.</p>
        <button class="memorial-close" onclick="closeMemorial()">بازگشت</button>
      </div>
    `;
    document.body.appendChild(modal);

    star.addEventListener("click", openMemorial);
  }

  function createMemorialStars() {
    const container = document.getElementById("memorialStars");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 40; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = (Math.random() * 4) + "s";
      s.style.animationDuration = (3 + Math.random() * 4) + "s";
      const size = 1 + Math.random() * 1.5;
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.opacity = (0.3 + Math.random() * 0.5);
      container.appendChild(s);
    }
  }

  function openMemorial() {
    const modal = document.getElementById("memorialModal");
    if (!modal) return;
    createMemorialStars();
    modal.classList.remove("closing");
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMemorial() {
    const modal = document.getElementById("memorialModal");
    if (!modal) return;
    modal.classList.add("closing");
    setTimeout(() => {
      modal.classList.remove("open", "closing");
      document.body.style.overflow = "";
    }, 700);
  }

  window.openMemorial = openMemorial;
  window.closeMemorial = closeMemorial;

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("memorialModal");
      if (modal && modal.classList.contains("open")) closeMemorial();
    }
  });

  /* =========================================
  START
  ========================================= */
  function init() {
    setupMobileMenu();
    setupMemorialStar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
