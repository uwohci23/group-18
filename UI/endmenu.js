const gameOverModal = document.getElementById('game-over-modal');
const restartGameButton = document.getElementById('restart-game');
const goMenuButton = document.getElementById('go-menu');
const playerNameInput = document.getElementById('player-name');
const finalScoreSpan = document.getElementById('final-score');

// Restart event
restartGameButton.addEventListener('click', () => {
  location.reload();
});

// Menu event
goMenuButton.addEventListener('click', () => {
  location.href = "../UI/game-select.html";
});

export function openGameOverModal(score) {
  finalScoreSpan.textContent = score;
  gameOverModal.classList.add('active');
  overlay.classList.add('active');
}

export function closeGameOverModal() {
  gameOverModal.classList.remove('active');
  overlay.classList.remove('active');
}