const startBreatheBtn = document.getElementById('startBreatheBtn');
const breathCircle = document.getElementById('breathCircle');
const breathText = document.getElementById('breathText');

let breathingInterval;
let isBreathing = false;

const totalTime = 8000; // 8 seconds per cycle
const breatheTime = 4000; // 4 seconds in & out

function breathAnimation() {
    // Breathe In
    breathText.innerText = 'Breathe In...';
    breathCircle.classList.add('breathe-in');
    breathCircle.classList.remove('breathe-out');

    setTimeout(() => {
        // Breathe Out
        breathText.innerText = 'Breathe Out...';
        breathCircle.classList.remove('breathe-in');
        breathCircle.classList.add('breathe-out');
    }, breatheTime);
}

if (startBreatheBtn) {
    startBreatheBtn.addEventListener('click', () => {
        if (!isBreathing) {
            isBreathing = true;
            startBreatheBtn.innerText = 'Stop Exercise';
            startBreatheBtn.style.backgroundColor = '#ef4444'; // Red to stop
            
            breathAnimation();
            breathingInterval = setInterval(breathAnimation, totalTime);
        } else {
            isBreathing = false;
            startBreatheBtn.innerText = 'Start Exercise';
            startBreatheBtn.style.backgroundColor = ''; // Reset
            
            clearInterval(breathingInterval);
            
            breathText.innerText = 'Start';
            breathCircle.classList.remove('breathe-in', 'breathe-out');
        }
    });
}
