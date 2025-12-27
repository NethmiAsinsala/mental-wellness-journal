// Get elements
const moodButtons = document.querySelectorAll("#mood-options button");
const saveMoodBtn = document.getElementById("saveMoodBtn");

let selectedMood = null;

// Handle mood selection
moodButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Remove previous selection
        moodButtons.forEach(btn => btn.classList.remove("selected"));

        // Select current
        button.classList.add("selected");
        selectedMood = button.getAttribute("data-mood");
    });
});

// Save mood to localStorage
saveMoodBtn.addEventListener("click", () => {
    if (!selectedMood) {
        alert("Please select a mood first 😊");
        return;
    }

    const today = new Date().toLocaleDateString();

    const moodEntry = {
        date: today,
        mood: selectedMood
    };

    // Get existing moods or empty array
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

    moodHistory.push(moodEntry);

    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

    alert("Mood saved successfully 💙");

    // Reset selection
    moodButtons.forEach(btn => btn.classList.remove("selected"));
    selectedMood = null;
});
