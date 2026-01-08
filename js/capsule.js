document.getElementById("saveCapsuleBtn").addEventListener("click", () => {

    const capsule = {
        message: document.getElementById("capsuleMessage").value,
        date: document.getElementById("capsuleDate").value,
        name: document.getElementById("capsuleName").value,
        password: document.getElementById("capsulePassword").value
    };

    if (!capsule.message || !capsule.date || !capsule.password) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("timeCapsule", JSON.stringify(capsule));
    alert("⏳ Time Capsule Saved Successfully!");
});
document.getElementById("saveCapsuleBtn").addEventListener("click", () => {

    const capsule = {
        message: document.getElementById("capsuleMessage").value,
        date: document.getElementById("capsuleDate").value,
        name: document.getElementById("capsuleName").value,
        password: document.getElementById("capsulePassword").value
    };

    if (!capsule.message || !capsule.date || !capsule.password) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("timeCapsule", JSON.stringify(capsule));
    alert("⏳ Time Capsule Saved Successfully!");
});
