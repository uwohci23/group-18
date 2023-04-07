// Navbar
const sections = document.querySelectorAll('section');
const navlist = document.querySelectorAll('nav .nav-container ul li');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  })
  
  navlist.forEach(li => {
    li.classList.remove('active');
    if (li.classList.contains(current)) {
      li.classList.add('active');
    }
  })
})

// Animations
let options = {
  threshold: 0,
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('show', entry.isIntersecting);
  });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// HTML Loading
function loadHtml(id, filename) {
  let xhttp;
  let element = document.getElementById(id);
  let file = filename;

  if (file) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          element.innerHTML = this.responseText;
          initEventListeners(filename); // Call the initEventListeners function after loading the content
        }
        if (this.status == 404) {
          element.innerHTML = "<h1>PAGE NOT FOUND</h1>";
        }
      }
    }
    xhttp.open("GET", `${file}`, true);
    xhttp.send();
    return;
  }
}

function initEventListeners(filename) {
  if(filename == "principle1.html")
    document.getElementById("first-iframe-overlay").addEventListener("click", showPopup);
}

function showPopup(event) {

  const popupMessage = document.getElementById("popup-message");


  // Show the pop-up message
  popupMessage.style.display = "block";

  // Hide the pop-up message after 3 seconds
  setTimeout(() => {
    popupMessage.style.display = "none";
  }, 2500);
}

// Listen for the "openLeaderboards" message
window.addEventListener('message', function(event) {
  if (event.data === 'openLeaderboards') {
    highlightButton("principle2.html"); // Highlight the "Leaderboard" button
  }
});

// Listen for the "openLeaderboards" message
window.addEventListener('message', function(event) {
  if (event.data === 'openGameMenus') {
    highlightButton("principle3.html"); // Highlight the "Game Menus" button
  }
});

// Listen for the "openGame" message
window.addEventListener('message', function(event) {
  if (event.data === 'openGame') {
    highlightButton("principle5.html"); // Highlight the "Game Menus" button
  }
});

function highlightButton(filename) {
  const buttons = document.querySelectorAll('.btn-group button');
  let targetButton;
  buttons.forEach(button => {
    if (button.getAttribute('onclick').includes(filename)) {
      targetButton = button;
    }
  });

  let flashCount = 0;
  const maxFlashes = 6; // Number of times the button will flash (even number to revert to the original color)
  const intervalDuration = 175; // Duration between each flash in milliseconds

  const interval = setInterval(() => {
    targetButton.classList.toggle('flashing');
    flashCount++;

    if (flashCount >= maxFlashes) {
      clearInterval(interval);
    }
  }, intervalDuration);
}

// Parent window code
window.addEventListener('message', e => {
  if (e.data.type === 'speechFinished') {
    console.log('Speech finished in iframe');
  }
});

// Principle Buttons
var buttons = document.querySelectorAll('.principle-button');
buttons.forEach(function(button) {
  button.addEventListener('click', function() {
    toggleClass(buttons, this);
  });
});
function toggleClass(buttons, buttonToActivate) {
  buttons.forEach(function(btn) {
    btn.classList.remove('active');
  });
  buttonToActivate.classList.add('active');
}

// Heuristic Select Handling
function handleSelect(selectedValue) {
  switch (selectedValue) {
    case "heuristic1":
      loadHtml("heuristic-content", "Heuristics/heuristic1.html");
      break;
    case "heuristic2":
      loadHtml("heuristic-content", "Heuristics/heuristic2.html");
      break;
    case "heuristic3":
      loadHtml("heuristic-content", "Heuristics/heuristic3.html");
      break;
    case "heuristic4":
      loadHtml("heuristic-content", "Heuristics/heuristic4.html");
      break;
    case "heuristic5":
      loadHtml("heuristic-content", "Heuristics/heuristic5.html");
      break;
    case "heuristic6":
      loadHtml("heuristic-content", "Heuristics/heuristic6.html");
      break;
    case "heuristic7":
      loadHtml("heuristic-content", "Heuristics/heuristic7.html");
      break;
    case "heuristic8":
      loadHtml("heuristic-content", "Heuristics/heuristic8.html");
      break;
    case "heuristic9":
      loadHtml("heuristic-content", "Heuristics/heuristic9.html");
      break;
    case "heuristic10":
      loadHtml("heuristic-content", "Heuristics/heuristic10.html");
      break;
  }
}

// Initial Loading
function initialLoad() {
  loadHtml("design-principle", "Principles/principle1.html");
  loadHtml("heuristic-content", "Heuristics/heuristic1.html");
}

