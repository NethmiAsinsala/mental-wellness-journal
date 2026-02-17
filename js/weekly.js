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

let weeklyChartInstance = null;

function loadWeekData(offset) {
    let data;
    try {
        data = JSON.parse(localStorage.getItem("moodHistory")) || [];
    } catch (error) {
        console.error("Error loading mood history:", error);
        data = [];
    }
    const { sunday, saturday } = getWeekRange(offset);

    document.getElementById("weekRange").textContent =
        `Week: ${sunday.toDateString()} - ${saturday.toDateString()}`;

    const weekData = data.filter(entry => {
        const date = new Date(entry.date);
        return date >= sunday && date <= saturday;
    });

    const moodCount = {
        Happy: 0,
        Excited: 0,
        Neutral: 0,
        Sad: 0,
        Stressed: 0
    };

    weekData.forEach(entry => {
        if(moodCount[entry.mood] !== undefined) {
             moodCount[entry.mood]++;
        }
    });

    drawPieChart(moodCount);
    findTopMood(moodCount);
}

function drawPieChart(moodCount) {
    const canvas = document.getElementById("weeklyPieChart");
    const ctx = canvas.getContext("2d");

    if (weeklyChartInstance) {
        weeklyChartInstance.destroy();
    }

    const labels = Object.keys(moodCount).filter(mood => moodCount[mood] > 0);
    const data = labels.map(mood => moodCount[mood]);
    
    // Ensure moodColors exists from constants.js
    const colors = window.moodColors || { Happy: "#fbbf24", Neutral: "#94a3b8", Sad: "#60a5fa", Stressed: "#ef4444", Excited: "#f43f5e" };
    const backgroundColors = labels.map(mood => colors[mood]);

    if (data.length === 0) {
        // Draw empty state
        weeklyChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No Data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e2e8f0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
        return;
    }

    weeklyChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: false // Using custom HTML legend instead
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed + (context.parsed === 1 ? ' entry' : ' entries');
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
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

    const emojis = window.moodEmojis || {};
    const emoji = emojis[topMood] || "";
    document.getElementById("topMood").textContent = topMood === "--" ? "--" : `${emoji} ${topMood}`;
}
