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
function openCapsule(capsule) {
    const name = prompt("Enter your name");
    const pass = prompt("Enter password");

    if (name === capsule.name && pass === capsule.password) {
        showToast("Capsule Opened 🎉");
        alert(`🎯 Your Target:\n\n${capsule.target}`);
    } else {
        showToast("Access Denied ❌");
    }
}
