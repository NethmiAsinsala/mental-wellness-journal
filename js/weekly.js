function loadWeeklyAnalysis() {
    const data = JSON.parse(localStorage.getItem("journalEntries")) || [];

    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(today.getDate() - 6);

    const weeklyData = data.filter(entry =>
        new Date(entry.date) >= last7Days
    );

    const moodCount = {};

    weeklyData.forEach(entry => {
        moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });

    drawPieChart(moodCount);
    findTopMood(moodCount);
}

function drawPieChart(moodCount) {
    const canvas = document.getElementById("weeklyPieChart");
    const ctx = canvas.getContext("2d");

    const total = Object.values(moodCount).reduce((a, b) => a + b, 0);

    const colors = {
        Happy: "#4ade80",
        Neutral: "#facc15",
        Sad: "#60a5fa",
        Stressed: "#f87171",
        Excited: "#c084fc"
    };

    let startAngle = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let mood in moodCount) {
        const sliceAngle = (moodCount[mood] / total) * 2 * Math.PI;

        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.arc(150, 150, 120, startAngle, startAngle + sliceAngle);
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

document.addEventListener("DOMContentLoaded", loadWeeklyAnalysis);
