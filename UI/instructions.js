const instructionsModal = document.getElementById('instructions-modal');
const openButton = document.getElementById('instructions-open');
const closeButton = document.getElementById('instructions-close');

// Open event
openButton.addEventListener('click', () => {
  openInstructionsModal();
});

// Close event
closeButton.addEventListener('click', () => {
  closeInstructionsModal();
});

export function openInstructionsModal(score) {
  instructionsModal.classList.add('active');
  overlay.classList.add('active');
}

export function closeInstructionsModal() {
  instructionsModal.classList.remove('active');
  overlay.classList.remove('active');
}