const themeToggle = document.getElementById("themeToggle");
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    body.classList.add("light");
    themeToggle.textContent = "☀️";
}

// Toggle theme
themeToggle.addEventListener("click", () => {
    body.classList.toggle("light");

    if (body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "🌙";
    }
});
