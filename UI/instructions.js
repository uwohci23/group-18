const instructionsModal = document.getElementById('instructions-modal');
const openButton = document.getElementById('instructions-open');
const closeButton = document.getElementById('instructions-close');
const speechButton = document.getElementById('instructions-speech');
const gameDescription = document.getElementById('instructions-desc');

// Open event
openButton.addEventListener('click', () => {
  openInstructionsModal();
});

// Close event
closeButton.addEventListener('click', () => {
  closeInstructionsModal();
});

// Speech event
speechButton.addEventListener('click', e => {
  e.preventDefault();
  const utterance = new SpeechSynthesisUtterance(gameDescription.textContent);
  speechSynthesis.speak(utterance);
});

export function openInstructionsModal() {
  instructionsModal.classList.add('active');
  overlay.classList.add('active');
}

export function closeInstructionsModal() {
  instructionsModal.classList.remove('active');
  overlay.classList.remove('active');
}