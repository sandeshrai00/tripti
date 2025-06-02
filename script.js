// Version Check
(async function checkForUpdates() {
    const currentVersion = "1.0";
    const versionUrl = "https://raw.githubusercontent.com/ivysone/Will-you-be-my-Valentine-/main/version.json";

    try {
        const response = await fetch(versionUrl);
        if (!response.ok) {
            console.warn("Could not fetch version information.");
            return;
        }
        const data = await response.json();
        const latestVersion = data.version;
        const updateMessage = data.updateMessage;

        if (currentVersion !== latestVersion) {
            alert(updateMessage);
        } else {
            console.log("You are using the latest version.");
        }
    } catch (error) {
        console.error("Error checking for updates:", error);
    }
})();

// Valentine Logic
const messages = [
    "Are you sure?",
    "Really sure??",
    "Are you positive?",
    "Pookie please...",
    "Just think about it!",
    "If you say no, I will be really sad...",
    "I will be very sad...",
    "I will be very very very sad...",
    "Ok fine, I will stop asking...",
    "Just kidding, say yes please! ❤️"
];

let messageIndex = 0;

function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    // Save music state before navigating
    const music = document.getElementById('valentine-music');
    if (music) {
        localStorage.setItem('musicTime', music.currentTime);
        localStorage.setItem('musicPlaying', !music.paused);
        localStorage.setItem('musicMuted', music.muted);
    }
    window.location.href = "yes_page.html";
}

// Music Controls
document.addEventListener('DOMContentLoaded', function() {
    const music = document.getElementById('valentine-music');
    const playBtn = document.getElementById('play-btn');
    const muteBtn = document.getElementById('mute-btn');

    if (music && playBtn && muteBtn) {
        // Try to auto-play on page load
        const tryAutoPlay = () => {
            music.play()
                .then(() => {
                    playBtn.textContent = '❚❚ Pause';
                    localStorage.setItem('musicPlaying', 'true');
                })
                .catch(error => {
                    console.log("Auto-play prevented:", error);
                    playBtn.textContent = '♫ Play Music';
                });
        };

        // Load saved state
        const savedTime = localStorage.getItem('musicTime');
        const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
        const wasMuted = localStorage.getItem('musicMuted') === 'true';

        if (savedTime) music.currentTime = parseFloat(savedTime);
        music.muted = wasMuted;

        if (wasPlaying) {
            tryAutoPlay();
        }

        // Update button states
        playBtn.textContent = music.paused ? '♫ Play Music' : '❚❚ Pause';
        muteBtn.textContent = music.muted ? '🔇' : '🔊';

        // Play/Pause functionality
        playBtn.addEventListener('click', function() {
            if (music.paused) {
                music.play()
                    .then(() => {
                        playBtn.textContent = '❚❚ Pause';
                        localStorage.setItem('musicPlaying', 'true');
                    })
                    .catch(error => {
                        console.log("Playback failed:", error);
                        playBtn.textContent = '♫ Click to Play';
                    });
            } else {
                music.pause();
                playBtn.textContent = '♫ Play Music';
                localStorage.setItem('musicPlaying', 'false');
            }
        });

        // Mute/Unmute functionality
        muteBtn.addEventListener('click', function() {
            music.muted = !music.muted;
            muteBtn.textContent = music.muted ? '🔇' : '🔊';
            localStorage.setItem('musicMuted', music.muted);
        });

        // Save playback position regularly
        setInterval(() => {
            localStorage.setItem('musicTime', music.currentTime);
        }, 1000);
    }
});