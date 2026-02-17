document.addEventListener("DOMContentLoaded", loadYearlyAnalysis);

let yearlyChartInstance = null;

function drawLineChart(data) {
    const canvas = document.getElementById("yearlyLineChart");
    const ctx = canvas.getContext("2d");

    if (yearlyChartInstance) {
        yearlyChartInstance.destroy();
    }

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const isDarkMode = document.body.getAttribute('data-theme') === 'dark';
    const textColor = isDarkMode ? '#e2e8f0' : '#475569';
    const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

    yearlyChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Average Mood Score',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 3,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#6366f1',
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        color: textColor,
                        callback: function(value) {
                            const moodLabels = {
                                1: 'Sad (1)',
                                2: 'Stressed (2)',
                                3: 'Neutral (3)',
                                4: 'Excited (4)',
                                5: 'Happy (5)'
                            };
                            return moodLabels[value] || value;
                        }
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
                    display: false // Hide default legend
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return context[0].label + ' Mood Average';
                        },
                        label: function(context) {
                            const val = parseFloat(context.parsed.y).toFixed(1);
                            if (val == 0) return ' No data';
                            let moodName = 'Neutral';
                            if(val >= 4.5) moodName = 'Happy';
                            else if(val >= 3.5) moodName = 'Excited';
                            else if(val >= 2.5) moodName = 'Neutral';
                            else if(val >= 1.5) moodName = 'Stressed';
                            else moodName = 'Sad';
                            
                            return ` Score: ${val} (~${moodName})`;
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

    document.getElementById("yearlyTopMood").textContent = topMood;
}


function loadYearlyAnalysis() {
    let data;
    try {
        data = JSON.parse(localStorage.getItem("moodHistory")) || [];
    } catch (error) {
        console.error("Error loading mood history:", error);
        data = [];
    }
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
