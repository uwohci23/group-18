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
  console.log("test");
  const utterance = new SpeechSynthesisUtterance(gameDescription.textContent);
  utterance.onend = () => {
    // Send a message to the parent window when the speech finishes
    window.parent.postMessage({ type: 'speechFinished' }, '*');
  };
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



