const gift = document.getElementById("gift");
const giftScene = document.getElementById("giftScene");
const tapHint = document.getElementById("tapHint");
const surprise = document.getElementById("surprise");
const confettiLayer = document.getElementById("confettiLayer");
const music = document.getElementById("surpriseMusic");
const musicButton = document.getElementById("musicButton");
const replayButton = document.getElementById("replayButton");
let opened = false;
let confettiTimer = null;

const confettiColors = ["#ff4f91", "#ffd86f", "#a56bff", "#70d6c2", "#ff9f68", "#ffffff", "#e9a7ff"];
const confettiShapes = ["", "round", "heart"];

function launchConfetti(amount = 150) {
  confettiLayer.innerHTML = "";
  clearTimeout(confettiTimer);
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    const shape = confettiShapes[Math.floor(Math.random() * confettiShapes.length)];
    piece.className = `confetti ${shape}`;
    const size = shape === "heart" ? 12 + Math.random() * 13 : 5 + Math.random() * 8;
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--size", `${size}px`);
    piece.style.setProperty("--color", confettiColors[Math.floor(Math.random() * confettiColors.length)]);
    piece.style.setProperty("--duration", `${3.2 + Math.random() * 4.5}s`);
    piece.style.setProperty("--delay", `${Math.random() * 1.1}s`);
    piece.style.setProperty("--drift", `${-100 + Math.random() * 200}px`);
    piece.style.setProperty("--spin", `${Math.random() * 1200 - 600}deg`);
    if (shape === "heart") piece.textContent = "♥";
    confettiLayer.appendChild(piece);
  }
  confettiTimer = setTimeout(() => { confettiLayer.innerHTML = ""; }, 9500);
}

async function startMusic() {
  musicButton.hidden = false;
  try {
    await music.play();
    musicButton.textContent = "♫ música ligada";
    musicButton.setAttribute("aria-label", "Pausar música");
  } catch (_) {
    musicButton.textContent = "♫ tocar música";
    musicButton.setAttribute("aria-label", "Tocar música");
    showToast("Adicione o arquivo da música na pasta assets para tocar.");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 3000);
}

function openGift() {
  if (opened) return;
  opened = true;
  gift.classList.add("opening");
  tapHint.hidden = true;
  launchConfetti(190);

  // O navegador permite iniciar áudio após a interação da pessoa.
  startMusic();

  setTimeout(() => {
    giftScene.hidden = true;
    surprise.hidden = false;
    launchConfetti(130);
  }, 600);
}

gift.addEventListener("click", openGift);
gift.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openGift();
  }
});

musicButton.addEventListener("click", async () => {
  if (music.paused) {
    await startMusic();
  } else {
    music.pause();
    musicButton.textContent = "♫ tocar música";
    musicButton.setAttribute("aria-label", "Tocar música");
  }
});

replayButton.addEventListener("click", () => {
  surprise.hidden = true;
  giftScene.hidden = false;
  gift.classList.remove("opening");
  // Recria a animação da caixa e reinicia o presente.
  void gift.offsetWidth;
  opened = false;
  tapHint.hidden = false;
  confettiLayer.innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

music.addEventListener("error", () => {
  if (opened) showToast("A caixa abriu! Falta adicionar o arquivo da música.");
});
