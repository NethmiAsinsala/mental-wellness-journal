


// Get elements
let audioBase64 = null;

const journalText = document.getElementById("journalText");
const saveJournalBtn = document.getElementById("saveJournalBtn");

// Save journal entry
saveJournalBtn.addEventListener("click", () => {
    let text = journalText.innerHTML.trim();
    const hasMedia = text.includes('<img') || text.includes('<audio') || audioBase64;

    if (text.replace(/<[^>]*>?/gm, '').trim() === "" && !hasMedia) {
        showToast("Please write something before saving ✍️");
        return;
    }

    if (audioBase64) {
        text += `<br><audio controls src="${audioBase64}"></audio>`;
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

    // Clear contenteditable
    journalText.innerHTML = "";
    journalText.setAttribute("data-placeholder", "Write your thoughts here...");
    
    // Clear any audio
    if (typeof discardAudio === "function") {
        discardAudio();
    }
    
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
            <p>${entry.text}</p>
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


// --- RICH TEXT & IMAGE INSERTION ---
function formatDoc(cmd, value=null) {
    document.execCommand(cmd, false, value);
    journalText.focus();
}

const imageUpload = document.getElementById("imageUpload");
if (imageUpload) {
    imageUpload.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                // Insert the image into the editor
                formatDoc("insertImage", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
}


// --- GUIDED PROMPTS ---
const prompts = [
    "What is one thing you accomplished today?",
    "What made you smile today?",
    "What is something you're looking forward to?",
    "Who made a positive impact on your day today?",
    "Write about a challenge you faced and how you handled it.",
    "What are three things you're grateful for right now?",
    "If you could describe today in one word, what would it be and why?"
];
const shufflePromptBtn = document.getElementById("shufflePromptBtn");

if (shufflePromptBtn) {
    shufflePromptBtn.addEventListener("click", () => {
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        journalText.setAttribute("data-placeholder", randomPrompt);
        if (journalText.innerHTML.trim() === "") {
            journalText.focus(); // prompt user to type
        }
    });
}


// --- AUDIO RECORDING (VOICE MEMOS) ---
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

const startRecordBtn = document.getElementById("recordAudioBtn");
const audioContainer = document.getElementById("audioContainer");
const audioPlayback = document.getElementById("audioPlayback");
const discardAudioBtn = document.getElementById("discardAudioBtn");

if (startRecordBtn) {
    startRecordBtn.addEventListener("click", async () => {
        if (isRecording) {
            // Stop recording
            mediaRecorder.stop();
            startRecordBtn.textContent = "🎤 Record";
            startRecordBtn.style.backgroundColor = "";
            startRecordBtn.style.color = "";
            isRecording = false;
        } else {
            // Start recording
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = e => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayback.src = audioUrl;
                    audioContainer.style.display = "flex";

                    // Convert to base64 to save in localStorage
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        audioBase64 = reader.result;
                    };
                };

                mediaRecorder.start();
                startRecordBtn.textContent = "⏹ Stop";
                startRecordBtn.style.backgroundColor = "#ef4444"; // red meaning recording
                startRecordBtn.style.color = "white";
                isRecording = true;

            } catch (err) {
                alert("Microphone access denied or not available. " + err);
            }
        }
    });
}

function discardAudio() {
    audioBase64 = null;
    audioPlayback.src = "";
    if (audioContainer) {
        audioContainer.style.display = "none";
    }
}

if (discardAudioBtn) {
    discardAudioBtn.addEventListener("click", discardAudio);
}


