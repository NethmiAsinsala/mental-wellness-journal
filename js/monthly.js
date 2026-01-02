function loadMonthlyAnalysis() {
    const data = JSON.parse(localStorage.getItem("journalEntries")) || [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyData = data.filter(entry => {
        const d = new Date(entry.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    document.getElementById("monthlyTotal").textContent = monthlyData.length;

    const moodCount = {
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Stressed: 0,
        Excited: 0
    };

    monthlyData.forEach(entry => {
        if (moodCount[entry.mood] !== undefined) {
            moodCount[entry.mood]++;
        }
    });

    drawMonthlyBarChart(moodCount);
    findMonthlyTopMood(moodCount);
}

function drawMonthlyBarChart(moodCount) {
    const canvas = document.getElementById("monthlyBarChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const moods = Object.keys(moodCount);
    const values = Object.values(moodCount);
    const maxValue = Math.max(...values, 1);

    const barWidth = 50;
    const gap = 20;
    const startX = 30;
    const baseY = canvas.height - 40;

    const colors = {
        Happy: "#4ade80",
        Neutral: "#facc15",
        Sad: "#60a5fa",
        Stressed: "#f87171",
        Excited: "#c084fc"
    };

    moods.forEach((mood, index) => {
        const barHeight = (moodCount[mood] / maxValue) * 140;
        const x = startX + index * (barWidth + gap);
        const y = baseY - barHeight;

        // Draw bar
        ctx.fillStyle = colors[mood];
        ctx.fillRect(x, y, barWidth, barHeight);

        // Value text
        ctx.fillStyle = "#e5e7eb";
        ctx.font = "12px Arial";
        ctx.fillText(moodCount[mood], x + 18, y - 5);

        // Label
        ctx.fillText(mood, x - 5, baseY + 15);
    });
}

function findMonthlyTopMood(moodCount) {
    let topMood = "--";
    let max = 0;

    for (let mood in moodCount) {
        if (moodCount[mood] > max) {
            max = moodCount[mood];
            topMood = mood;
        }
    }

    document.getElementById("monthlyTopMood").textContent = topMood;
}

document.addEventListener("DOMContentLoaded", loadMonthlyAnalysis);
