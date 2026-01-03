const navItems = document.querySelectorAll(".sidebar li");
const pages = document.querySelectorAll(".page");

navItems.forEach(item => {
    item.addEventListener("click", () => {
    navItems.forEach(i => i.classList.remove("active"));
    pages.forEach(p => p.classList.remove("active"));

    item.classList.add("active");
    const pageId = item.getAttribute("data-page");
    document.getElementById(pageId).classList.add("active");

    if (pageId === "weekly") {
        loadWeeklyAnalysis();
    }
    if (pageId === "monthly") {
    loadMonthlyAnalysis();
}
});
});

