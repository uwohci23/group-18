const timerElement = document.querySelector('.timer');
const pauseButton = document.getElementById('pause-button');
let time = 0;
let interval = null;

// Listeners
//pauseButton.addEventListener('click', stop);

// Update timer 
function timer() {
  time++;

  // Formatting
  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - (hours * 3600)) / 60);
  let seconds = time % 60;
  if (seconds < 10) seconds = '0' + seconds;
  if (minutes < 10) minutes = '0' + minutes;
  if (hours < 10) hours = '0' + hours;

  // Set element
  timerElement.innerText = `${minutes}:${seconds}`;
}

export function start() {
  if (interval) {
    return;
  }
  
  interval = setInterval(timer, 1000);
}

export function stop() {
  clearInterval(interval);
  interval = null;
}