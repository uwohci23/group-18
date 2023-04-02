const settingsModal = document.getElementById('settings-modal');
const openButton = document.getElementById('settings-open');
const closeButton = document.getElementById('settings-close');

// Open event
openButton.addEventListener('click', () => {
  opensettingsModal();
});

// Close event
closeButton.addEventListener('click', () => {
  closesettingsModal();
});

export function opensettingsModal() {
  settingsModal.classList.add('active');
  //overlay.classList.add('active');
}

export function closesettingsModal() {
  settingsModal.classList.remove('active');
  //overlay.classList.remove('active');
}


  const useDefaultsToggle = document.getElementById('useDefaults');
  const resetDefaultsToggle = document.getElementById('resetDefaults');
  
const blockColorInputs2 = document.querySelectorAll('input[type="color"]');

// Update other color inputs when the "Use Defaults" toggle is changed
useDefaultsToggle.addEventListener('change', () => {
  
  localStorage.setItem('useDefaults', useDefaultsToggle.checked);
  
  if (useDefaultsToggle.checked) {
    blockColorInputs2.forEach(input => {
      input.value = input.defaultValue; // Reset the input to its default value
    });
  }
});

resetDefaultsToggle.addEventListener('change', () => {
  
    localStorage.setItem('resetDefaults', resetDefaultsToggle.checked);
});

// Update the "Use Defaults" toggle when any block color input is changed
blockColorInputs2.forEach(input => {
  input.addEventListener('change', () => {

    useDefaultsToggle.checked = false; // Uncheck the "Use Defaults" toggle
    localStorage.setItem('useDefaults', useDefaultsToggle.checked);
  });
});

const form = document.getElementById("colorForm");

const notification = document.getElementById("notification");


// Listen for form submit event
form.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get color inputs and their values
  const backgroundColor = document.querySelector('#background-color-input').value;
  const gameScreenColor = document.querySelector('#game-screen-color-input').value;
  const I_BlockColor = document.querySelector('#I_Block').value;
  const O_BlockColor = document.querySelector('#O_Block').value;
  const T_BlockColor = document.querySelector('#T_Block').value;
  const S_BlockColor = document.querySelector('#S_Block').value;
  const Z_BlockColor = document.querySelector('#Z_Block').value;
  const J_BlockColor = document.querySelector('#J_Block').value;
  const L_BlockColor = document.querySelector('#L_Block').value;

  // Create variables and an object with the color values
  const background = backgroundColor
  const gameScreen = gameScreenColor
  const colors = {
    I: I_BlockColor,
    O: O_BlockColor,
    T: T_BlockColor,
    S: S_BlockColor,
    Z: Z_BlockColor,
    J: J_BlockColor,
    L: L_BlockColor
  };

  // Convert object to string and save to local storage
  const colorsString = JSON.stringify(colors);
  localStorage.setItem('blockColors', colorsString);
  const backgroundString = JSON.stringify(background);
  localStorage.setItem('backgroundColor', backgroundString);
  const gameScreenString = JSON.stringify(gameScreen);
  localStorage.setItem('gameScreenColor', gameScreenString);

  notification.style.display = "block";
  setTimeout(function() {
    notification.style.display = "none";
  }, 2000);

});

