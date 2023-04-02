const gameOverModal = document.getElementById('game-over-modal');
const restartGameButton = document.getElementById('restart-game');
const goMenuButton = document.getElementById('go-menu');
const playerNameInput = document.getElementById('player-name');
const finalScoreSpan = document.getElementById('final-score');
const confirmationPanel = document.querySelector('.confirmation-panel');

// Restart event
restartGameButton.addEventListener('click', () => {
  confirmationPanel.style.display = 'flex';
  gameOverModal.classList.remove('active');
  confirmationPanel.classList.add('restart-cmd');
  confirmationPanel.classList.add('end');
});

// Menu event
goMenuButton.addEventListener('click', () => {
  confirmationPanel.style.display = 'flex';
  gameOverModal.classList.remove('active');
  confirmationPanel.classList.add('end');
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