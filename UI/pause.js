import { stop, start } from "../Minesweeper/timer.js"


const openModalButtons = document.querySelectorAll('[data-modal-target]'); //pause
const closeModalButtons = document.querySelectorAll('[data-modal-close]'); //resume
const restartButton = document.getElementById('restart'); //restart
const menuButton = document.getElementById('menu'); //menu
const overlay = document.getElementById('overlay'); //screen  
const confirmationPanel = document.querySelector('.confirmation-panel');
const confirmBtn = document.querySelector('.confirm-btn');
const cancelBtn = document.querySelector('.cancel-btn');

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
  confirmationPanel.style.display = 'flex';
  document.querySelector(".pause-modal").classList.remove('active');
  confirmationPanel.classList.add('restart-cmd');
})

// Menu event
menuButton.addEventListener('click', () => {
  confirmationPanel.style.display = 'flex';
  document.querySelector(".pause-modal").classList.remove('active');
})

confirmBtn.addEventListener('click', function() {
  // Code to confirm goes here
  if(confirmationPanel.classList.contains('restart-cmd')) {
      location.reload();
      confirmationPanel.classList.remove('restart-cmd');
  }else{
      location.href = "../UI/game-select.html";
  }
  // Hide the confirmation panel
  confirmationPanel.style.display = 'none';
});

// Add event listener to cancel button
cancelBtn.addEventListener('click', function() {
  // Code to cancel goes here
  confirmationPanel.classList.remove('restart-cmd');
  if(confirmationPanel.classList.contains('end'))
      document.querySelector(".game-over-modal").classList.add('active');
  else
      document.querySelector(".pause-modal").classList.add('active');
  // Hide the confirmation panel
  confirmationPanel.style.display = 'none';
});

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

