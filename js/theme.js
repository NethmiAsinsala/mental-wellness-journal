document.addEventListener("DOMContentLoaded", () => {
    const themeSelect = document.getElementById("themeSelect");
    
    // Check local storage for saved theme
    const savedTheme = localStorage.getItem("appTheme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    if(themeSelect) {
        themeSelect.value = savedTheme;

        themeSelect.addEventListener("change", (e) => {
            const newTheme = e.target.value;
            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("appTheme", newTheme);
            
            // Re-render charts so their grids and text update to match new theme
            if (typeof loadWeeklyAnalysis === "function") loadWeeklyAnalysis();
            if (typeof loadMonthlyAnalysis === "function") loadMonthlyAnalysis();
            if (typeof loadYearlyAnalysis === "function") loadYearlyAnalysis();
        });
    }
});