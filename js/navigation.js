const navItems = document.querySelectorAll(".sidebar li");
const pages = document.querySelectorAll(".page");

navItems.forEach(item => {
    item.addEventListener("click", () => {

        // Remove active states
        navItems.forEach(i => i.classList.remove("active"));
        pages.forEach(p => p.classList.remove("active"));

        // Activate selected
        item.classList.add("active");
        const pageId = item.getAttribute("data-page");
        document.getElementById(pageId).classList.add("active");
    });
});
