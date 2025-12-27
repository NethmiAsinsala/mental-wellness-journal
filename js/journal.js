// Get elements
const journalText = document.getElementById("journalText");
const saveJournalBtn = document.getElementById("saveJournalBtn");

// Save journal entry
saveJournalBtn.addEventListener("click", () => {
    const text = journalText.value.trim();

    if (text === "") {
        alert("Please write something before saving ✍️");
        return;
    }

    // Get today's date
    const today = new Date().toLocaleDateString();

    // Get latest mood (optional)
    const moodHistory = JSON.parse(localStorage.getItem("moodHistory")) || [];
    const lastMood = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1].mood : "Not set";

    const journalEntry = {
        date: today,
        mood: lastMood,
        text: text
    };

    // Get existing journal entries
    const journalEntries = JSON.parse(localStorage.getItem("journalEntries")) || [];

    journalEntries.push(journalEntry);

    // Save back to localStorage
    localStorage.setItem("journalEntries", JSON.stringify(journalEntries));

    alert("Journal entry saved 💙");

    // Clear textarea
    journalText.value = "";
});
