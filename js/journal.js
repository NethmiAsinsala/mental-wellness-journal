


// Get elements
const journalText = document.getElementById("journalText");
const saveJournalBtn = document.getElementById("saveJournalBtn");

// Save journal entry
saveJournalBtn.addEventListener("click", () => {
    const text = journalText.value.trim();

    if (text === "") {
        showToast("Please write something before saving ✍️");
        return;
    }

    // Get today's date
    const today = new Date().toLocaleDateString();

    // Get latest mood (optional)
    let moodHistory;
    try {
        moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    } catch (error) {
        console.error("Error loading mood history:", error);
        moodHistory = [];
    }
    const lastMood = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1].mood : "Not set";

    const journalEntry = {
        date: today,
        mood: lastMood,
        text: text
    };

    // Get existing journal entries
    let journalEntries;
    try {
        journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    } catch (error) {
        console.error("Error loading journal entries:", error);
        journalEntries = [];
    }

    journalEntries.push(journalEntry);

    // Save back to localStorage
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));

    showToast("Journal entry saved 💙");

    // Clear textarea
    journalText.value = "";
    loadHistory();
});
const historyList = document.getElementById("historyList");

// Load history when page loads
function loadHistory() {
    historyList.innerHTML = "";

    let journalEntries;
    try {
        journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];
    } catch (error) {
        console.error("Error loading journal entries:", error);
        journalEntries = [];
    }

    if (journalEntries.length === 0) {
        historyList.innerHTML = "<p>No entries yet 🌱</p>";
        return;
    }

    journalEntries.forEach((entry, index) => {
    const item = document.createElement("div");
    item.classList.add("history-item");

    item.innerHTML = `
        <div>
            <strong>${entry.date}</strong> 
            ${(window.moodEmojis && window.moodEmojis[entry.mood]) || ""}
            <p>${entry.text.substring(0, 60)}...</p>
        </div>
        <button class="delete-btn">❌</button>
    `;

    // Delete button logic
    item.querySelector(".delete-btn").addEventListener("click", () => {
        journalEntries.splice(index, 1);
        localStorage.setItem("journalEntries", JSON.stringify(journalEntries));
        loadWeeklyAnalysis();
        loadMonthlyAnalysis();
        loadHistory();
    });

    historyList.appendChild(item);
});

}

// Call function on load
loadHistory();

