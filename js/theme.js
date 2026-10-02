/* =========================================
THEME LOADER
این فایل توی همه‌ی صفحه‌ها لود می‌شه
و تم ذخیره‌شده رو اعمال می‌کنه
========================================= */
(function() {
  const theme = localStorage.getItem("y11_theme") || "green";
  document.documentElement.setAttribute("data-theme", theme);
})();
