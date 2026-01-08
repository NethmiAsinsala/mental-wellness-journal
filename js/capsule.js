// Capsule Logic

const saveCapsuleBtn = document.getElementById("saveCapsuleBtn");
const capsuleHistory = document.getElementById("capsuleHistory");

saveCapsuleBtn.addEventListener("click", () => {
    const target = document.getElementById("capsuleMessage").value;
    const date = document.getElementById("capsuleDate").value;
    const name = document.getElementById("capsuleName").value;
    const password = document.getElementById("capsulePassword").value;

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
