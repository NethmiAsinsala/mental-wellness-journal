document.addEventListener("DOMContentLoaded", loadWeeklyAnalysis);

function getWeekRange(offset = 0) {
    const today = new Date();

    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay() - offset * 7);
    sunday.setHours(0, 0, 0, 0);

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    return { sunday, saturday };
}

function loadWeeklyAnalysis() {
    loadWeekData(0);
}

function loadPreviousWeekAnalysis() {
    loadWeekData(1);
}

function loadWeekData(offset) {
    const data = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const { sunday, saturday } = getWeekRange(offset);

    document.getElementById("weekRange").textContent =
        `Week: ${sunday.toDateString()} - ${saturday.toDateString()}`;

    const weekData = data.filter(entry => {
        const date = new Date(entry.date);
        return date >= sunday && date <= saturday;
    });

    const moodCount = {};
    weekData.forEach(entry => {
        moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });

    drawPieChart(moodCount);
    findTopMood(moodCount);
}

function drawPieChart(moodCount) {
    const canvas = document.getElementById("weeklyPieChart");
    const ctx = canvas.getContext("2d");

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX - 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = Object.values(moodCount).reduce((a, b) => a + b, 0);

    if (total === 0) {
        ctx.fillStyle = "#94a3b8";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("No data available", centerX, centerY);
        return;
    }

    const colors = {
        Happy: "#4ade80",
        Neutral: "#facc15",
        Sad: "#60a5fa",
        Stressed: "#f87171",
        Excited: "#c084fc"
    };

    let startAngle = 0;

    for (let mood in moodCount) {
        const sliceAngle = (moodCount[mood] / total) * Math.PI * 2;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.fillStyle = colors[mood] || "#94a3b8";
        ctx.fill();

        startAngle += sliceAngle;
    }
}

function findTopMood(moodCount) {
    let max = 0;
    let topMood = "--";

    for (let mood in moodCount) {
        if (moodCount[mood] > max) {
            max = moodCount[mood];
            topMood = mood;
        }
    }

    document.getElementById("topMood").textContent = topMood;
}
