function loadMonthlyAnalysis() {
    loadMonthData(0);
}

function loadPreviousMonthAnalysis() {
    loadMonthData(1);
}

let monthlyChartInstance = null;

function loadMonthData(offset) {
    let data;
    try {
        data = JSON.parse(localStorage.getItem("moodHistory")) || [];
    } catch (error) {
        console.error("Error loading mood history:", error);
        data = [];
    }

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

    const moodCount = {
        Happy: 0,
        Neutral: 0,
        Sad: 0,
        Stressed: 0,
        Excited: 0
    };

    monthData.forEach(entry => {
        if(moodCount[entry.mood] !== undefined) {
             moodCount[entry.mood]++;
        }
    });

    document.getElementById("monthlyTotal").textContent = monthData.length;

    drawMonthlyBarChart(moodCount);
    findMonthlyTopMood(moodCount);
}

function drawMonthlyBarChart(moodCount) {
    const canvas = document.getElementById("monthlyBarChart");
    const ctx = canvas.getContext("2d");

    if (monthlyChartInstance) {
        monthlyChartInstance.destroy();
    }

    const moods = ["Happy", "Neutral", "Sad", "Stressed", "Excited"];
    const values = moods.map(mood => moodCount[mood]);
    
    // Ensure moodColors exists from constants.js
    const colorsObj = window.moodColors || { Happy: "#fbbf24", Neutral: "#94a3b8", Sad: "#60a5fa", Stressed: "#ef4444", Excited: "#f43f5e" };
    const colorsArray = moods.map(mood => colorsObj[mood]);

    const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDarkMode ? '#e2e8f0' : '#475569';
    const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

    monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: moods,
            datasets: [{
                label: 'Mood Count',
                data: values,
                backgroundColor: colorsArray,
                borderRadius: 4,
                borderWidth: 0
            }]
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                x: {
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide default legend since we have our custom one
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return context[0].label + ' Mood';
                        },
                        label: function(context) {
                            const val = context.parsed.y;
                            return ' ' + val + (val === 1 ? ' entry' : ' entries');
                        }
                    }
                }
            }
        }
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
