document.addEventListener("DOMContentLoaded", loadYearlyAnalysis);
function drawLineChart(data) {
    const canvas = document.getElementById("yearlyLineChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 50;
    const maxY = 5;
    const stepX = (canvas.width - padding * 2) / 11;
    const stepY = (canvas.height - padding * 2) / maxY;

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // X labels
    ctx.font = "12px sans-serif";
    months.forEach((month, i) => {
        const x = padding + stepX * i;
        ctx.fillText(month, x - 10, canvas.height - 20);
    });

    // Line
    ctx.beginPath();
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 3;

    data.forEach((value, i) => {
        const x = padding + stepX * i;
        const y = canvas.height - padding - value * stepY;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        // Dot
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#6366f1";
        ctx.fill();
    });

    ctx.stroke();
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

    document.getElementById("yearlyTopMood").textContent = topMood;
}


function loadYearlyAnalysis() {
    const data = JSON.parse(localStorage.getItem("journalEntries")) || [];
    const currentYear = new Date().getFullYear();

    // 12 months (0–11)
    const monthlyTotals = Array(12).fill(0);
    const monthlyCounts = Array(12).fill(0);
    const moodFrequency = {};

    data.forEach(entry => {
        const entryDate = new Date(entry.date);

        if (entryDate.getFullYear() === currentYear) {
            const month = entryDate.getMonth();
            const score = getMoodScore(entry.mood);

            monthlyTotals[month] += score;
            monthlyCounts[month]++;

            moodFrequency[entry.mood] =
                (moodFrequency[entry.mood] || 0) + 1;
        }
    });

    // Average mood per month
    const monthlyAverages = monthlyTotals.map((total, i) =>
        monthlyCounts[i] ? (total / monthlyCounts[i]).toFixed(2) : 0
    );

    drawLineChart(monthlyAverages);
    findTopMood(moodFrequency);
}

function getMoodScore(mood) {
    const scores = {
        Happy: 5,
        Excited: 4,
        Neutral: 3,
        Stressed: 2,
        Sad: 1
    };
    return scores[mood] || 3;
}
