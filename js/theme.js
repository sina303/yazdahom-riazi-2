/* =========================================
THEME LOADER + AUTH CHECK
========================================= */
(function() {
  const theme = localStorage.getItem("y11_theme") || "green";
  document.documentElement.setAttribute("data-theme", theme);

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (currentPage === "lock.html") return;

  const isAuth = localStorage.getItem("axis_auth") === "true";
  if (!isAuth) {
    window.location.replace("lock.html");
  }
})();
