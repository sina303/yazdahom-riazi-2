/* =========================================
THEME LOADER + AUTH CHECK
========================================= */
(function() {
  /* تم */
  const theme = localStorage.getItem("y11_theme") || "green";
  document.documentElement.setAttribute("data-theme", theme);

  /* چک رمز — اگه صفحه، صفحه‌ی lock هست، کاری نکن */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (currentPage === "lock.html") return;

  /* اگه رمز وارد نشده، بفرست به lock */
  const isAuth = localStorage.getItem("axis_auth") === "true";
  if (!isAuth) {
    window.location.replace("lock.html");
  }
})();
