// Get elements
const moodButtons = document.querySelectorAll("#mood-options button");
const saveMoodBtn = document.getElementById("saveMoodBtn");

let selectedMood = null;


moodButtons.forEach(button => {
    button.addEventListener("click", () => {
        
        moodButtons.forEach(btn => btn.classList.remove("selected"));

        
        button.classList.add("selected");
        selectedMood = button.getAttribute("data-mood");
    });
});


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

    
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];

    moodHistory.push(moodEntry);

    localStorage.setItem("moodHistory", JSON.stringify(moodHistory));

    alert("Mood saved successfully 💙");

    // Reset selection
    moodButtons.forEach(btn => btn.classList.remove("selected"));
    selectedMood = null;
});
