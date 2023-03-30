import { stop, start } from "../Minesweeper/timer.js"

const openModalButtons = document.querySelectorAll('[data-modal-target]'); //pause
const closeModalButtons = document.querySelectorAll('[data-modal-close]'); //resume
const restartButton = document.getElementById('restart'); //restart
const menuButton = document.getElementById('menu'); //menu
const overlay = document.getElementById('overlay'); //screen  
console.log(openModalButtons)

// Open pause events
openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget);
    openModal(modal);
  })
})

// Close pause events
overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.pause-modal.active');
  modals.forEach(modal => {
    closeModal(modal);
  })
})
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.pause-modal');
    
    closeModal(modal);
  })
})

// Restart event
restartButton.addEventListener('click', () => {
  location.reload();
})

// Menu event
menuButton.addEventListener('click', () => {
  location.href = "../UI/game-select.html";
})

function openModal(modal) {
  if(!overlay.classList.contains("active")){
    if (modal == null) return;
    stop();
    modal.classList.add('active');
    overlay.classList.add('active');
  }
}

function closeModal(modal) {
  if (modal == null) return;
  start();
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

