function loadMonthlyAnalysis() {
    loadMonthData(0);
}

function loadPreviousMonthAnalysis() {
    loadMonthData(1);
}

function loadMonthData(offset) {
    const data = JSON.parse(localStorage.getItem("journalEntries")) || [];

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() - offset;

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);

    document.getElementById("monthRange").textContent =
        start.toLocaleString("default", { month: "long", year: "numeric" });

    const monthData = data.filter(entry => {
        const d = new Date(entry.date);
        return d >= start && d <= end;
    });

    const moodCount = {};
    monthData.forEach(entry => {
        moodCount[entry.mood] = (moodCount[entry.mood] || 0) + 1;
    });

    document.getElementById("monthlyTotal").textContent = monthData.length;

    drawMonthlyBarChart(moodCount);
    findMonthlyTopMood(moodCount);
}

function drawMonthlyBarChart(moodCount) {
    const canvas = document.getElementById("monthlyBarChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const moods = ["Happy", "Neutral", "Sad", "Stressed", "Excited"];
    const colors = {
        Happy: "#4ade80",
        Neutral: "#facc15",
        Sad: "#60a5fa",
        Stressed: "#f87171",
        Excited: "#c084fc"
    };

    const maxValue = Math.max(...Object.values(moodCount), 1);
    const barWidth = 50;
    const gap = 25;
    const startX = 40;
    const chartHeight = canvas.height - 60;

    moods.forEach((mood, index) => {
        const value = moodCount[mood] || 0;
        const barHeight = (value / maxValue) * chartHeight;

        const x = startX + index * (barWidth + gap);
        const y = canvas.height - barHeight - 30;

        ctx.fillStyle = colors[mood];
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.fillStyle = "#e5e7eb";
        ctx.textAlign = "center";
        ctx.fillText(value, x + barWidth / 2, y - 5);

        ctx.fillText(mood, x + barWidth / 2, canvas.height - 10);
    });
}

function findMonthlyTopMood(moodCount) {
    let max = 0;
    let topMood = "--";

    for (let mood in moodCount) {
        if (moodCount[mood] > max) {
            max = moodCount[mood];
            topMood = mood;
        }
    }

    document.getElementById("monthlyTopMood").textContent = topMood;
}
