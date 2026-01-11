// Capsule Logic

const saveCapsuleBtn = document.getElementById("saveCapsuleBtn");
const capsuleHistory = document.getElementById("capsuleHistory");

saveCapsuleBtn.addEventListener("click", () => {
    const messageInput = document.getElementById("capsuleMessage");
    const dateInput = document.getElementById("capsuleDate");
    const nameInput = document.getElementById("capsuleName");
    const passwordInput = document.getElementById("capsulePassword");

    const target = messageInput.value;
    const date = dateInput.value;
    const name = nameInput.value;
    const password = passwordInput.value;

    if (!target || !date || !name || !password) {
        showToast("Fill all fields ❗");
        return;
    }

    const capsules = JSON.parse(localStorage.getItem("timeCapsules")) || [];

    capsules.push({
        id: Date.now(),
        target,
        unlockDate: date,
        name,
        password
    });

    localStorage.setItem("timeCapsules", JSON.stringify(capsules));
    showToast("Time Capsule Saved ⏳");

    // Auto reset form
    messageInput.value = "";
    dateInput.value = "";
    nameInput.value = "";
    passwordInput.value = "";

    loadCapsules();
});
function loadCapsules() {
    capsuleHistory.innerHTML = "";

    const capsules = JSON.parse(localStorage.getItem("timeCapsules")) || [];

    capsules.forEach(capsule => {
        const div = document.createElement("div");
        div.className = "capsule-item";

        div.innerHTML = `
            <strong>🔒 Locked Target</strong>
            <div class="capsule-date">${capsule.unlockDate}</div>
        `;

        div.onclick = () => openCapsule(capsule);
        capsuleHistory.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", loadCapsules);

// Modal Elements
const capsuleModal = document.getElementById("capsuleModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalActionBtn = document.getElementById("modalActionBtn");

const unlockInputs = document.getElementById("unlockInputs");
const unlockName = document.getElementById("unlockName");
const unlockPassword = document.getElementById("unlockPassword");

const capsuleMessageContent = document.getElementById("capsuleMessageContent");

let currentCapsule = null;

// Close Modal Logic
closeModal.onclick = () => {
    capsuleModal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target == capsuleModal) {
        capsuleModal.style.display = "none";
    }
};

function openCapsule(capsule) {
    currentCapsule = capsule;
    
    // Reset Modal State
    modalTitle.innerText = "Unlock Capsule 🔒";
    unlockInputs.style.display = "block";
    capsuleMessageContent.style.display = "none";
    modalActionBtn.innerText = "Unlock";
    
    // Clear inputs
    unlockName.value = "";
    unlockPassword.value = "";

    capsuleModal.style.display = "flex";
}

modalActionBtn.onclick = () => {
    if (!currentCapsule) return;

    if (modalActionBtn.innerText === "Close") {
         capsuleModal.style.display = "none";
         return;
    }

    const name = unlockName.value;
    const pass = unlockPassword.value;

    if (name === currentCapsule.name && pass === currentCapsule.password) {
        showToast("Capsule Opened 🎉");
        
        // Show Content
        modalTitle.innerText = "🎯 Your Target";
        unlockInputs.style.display = "none";
        capsuleMessageContent.style.display = "block";
        capsuleMessageContent.innerText = currentCapsule.target;
        
        modalActionBtn.innerText = "Close";
    } else {
        showToast("Access Denied ❌");
        unlockPassword.value = ""; // Clear password for retry
    }
}
