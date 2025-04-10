document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  // Get reference to balloon container from HTML
  const balloonContainer = document.querySelector('.balloon-container');
  // Ensure the balloon container is hidden on page load
  if (balloonContainer) {
    balloonContainer.style.display = "none";
  }

  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let audio = new Audio('./TV Girl - Lovers Rock.mp3');
  
  // Variable to hold the endless confetti interval ID for resetting purposes
  let confettiIntervalId = null;
  
  // Balloon drop trigger flag
  let balloonTriggered = false;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;
    return average > 50; // Adjust threshold as needed
  }

  // NEW: Function to trigger the balloon drop animation.
  // This will show the balloon container and start each balloon’s drop animation.
  function triggerBalloonDrop() {
    if (balloonContainer) {
      // Make the container visible
      balloonContainer.style.display = "block";
      // For each balloon, set the animation-play-state to running
      const balloons = balloonContainer.querySelectorAll('.balloon');
      balloons.forEach(function(balloon) {
        balloon.style.animationPlayState = 'running';
      });
    }
  }

  function blowOutCandles() {
    let blownOut = 0;
    // Only check for blowing if there are candles and at least one is not blown out
    if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;
          }
        });
      }
      if (blownOut > 0) {
        updateCandleCount();
      }
      // When all candles are blown out, trigger the balloon drop along with confetti and audio.
      if (candles.every((candle) => candle.classList.contains("out"))) {
        if (!balloonTriggered) {
          triggerBalloonDrop();
          balloonTriggered = true;
        }
        setTimeout(function() {
          triggerConfetti();
          confettiIntervalId = setInterval(function() {
            confetti({
              particleCount: 200,
              spread: 90,
              origin: { y: 0 }
            });
          }, 1000);
          audio.play();
        }, 200);
      }
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }

  // Reset function: removes all candle elements, clears endless confetti, and hides the balloon container.
  function resetCake() {
    candles.forEach(function(candle) {
      if (cake.contains(candle)) {
        cake.removeChild(candle);
      }
    });
    candles = [];
    updateCandleCount();
    
    if (confettiIntervalId !== null) {
      clearInterval(confettiIntervalId);
      confettiIntervalId = null;
    }
    
    balloonTriggered = false;
    if (balloonContainer) {
      // Hide the balloon container and pause animations
      balloonContainer.style.display = "none";
      const balloons = balloonContainer.querySelectorAll('.balloon');
      balloons.forEach(function(balloon) {
         balloon.style.animationPlayState = 'paused';
      });
    }
  }

  // Modal functionality for the letter display
  const resetButton = document.getElementById("resetButton");
  const showLetterButton = document.getElementById("showLetterButton");
  const letterModal = document.getElementById("letterModal");
  const closeModal = document.getElementById("closeModal");

  resetButton.addEventListener("click", resetCake);
  showLetterButton.addEventListener("click", function() {
    letterModal.style.display = "block";
  });
  closeModal.addEventListener("click", function() {
    letterModal.style.display = "none";
  });
  window.addEventListener("click", function(event) {
    if (event.target == letterModal) {
      letterModal.style.display = "none";
    }
  });
});

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function endlessConfetti() {
  setInterval(function() {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0 }
    });
  }, 1000);
}


document.addEventListener("DOMContentLoaded", function () {
  // Existing code...

  // Open the gallery modal
  const showVideosBtn = document.getElementById("showVideosBtn");
  const galleryModal = document.getElementById("galleryModal");
  const closeGallery = document.getElementById("closeGallery");

  showVideosBtn.addEventListener("click", function () {
    galleryModal.style.display = "flex";
  });

  // Close the modal when the close button is clicked
  closeGallery.addEventListener("click", function () {
    galleryModal.style.display = "none";
  });

  // Optional: Close the modal if user clicks outside of content
  window.addEventListener("click", function (event) {
    if (event.target === galleryModal) {
      galleryModal.style.display = "none";
    }
  });

  // Existing code...
});
