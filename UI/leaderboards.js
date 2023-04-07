// Open the specified tab content and mark the button as active
function updateGameSelection() {
    //Put active class on the new selection
    var i, game_options, difficulty, game;
    game_options = document.getElementsByClassName("game-select");
    for (i = 0; i < game_options.length; i++) {
      game_options[i].classList.remove("active");
    }
    event.currentTarget.classList.add("active");

    //Change Game Label 
    var pageName = document.querySelector(".game-select.active").textContent;
    document.querySelector(".tabcontent h2").textContent = pageName;

    //Update leaderboard
    game = document.querySelector(".game-select.active").textContent;
    difficulty = document.querySelector(".difficulty-select.active").textContent;
    updateLeaderboard(game, difficulty);
}

function updateDifficultySelection() {
  //Put active class on the new selection
  var i, difficulty_options, difficulty, game;
  difficulty_options = document.getElementsByClassName("difficulty-select");
  for (i = 0; i < difficulty_options.length; i++) {
    difficulty_options[i].classList.remove("active");
  }
  event.currentTarget.classList.add("active");

  //Update leaderboard
  game = document.querySelector(".game-select.active").textContent;
  difficulty = document.querySelector(".difficulty-select.active").textContent;
  updateLeaderboard(game, difficulty);
}

function updateLeaderboard(game, difficulty){
  var table = document.querySelector("tbody");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }

  top_scores = JSON.parse(localStorage.getItem(`${game} top scores`));
  if(!top_scores) return;
  top_scores = top_scores[`${difficulty.toLowerCase()}_scores`];

  top_scores.forEach((element, i) => {
    const new_row = document.createElement("tr");
    
    const position_cell = document.createElement("td");
    position_cell.textContent = i+1;
    const name_cell = document.createElement("td");
    name_cell.textContent = element.name;
    const score_cell = document.createElement("td");

    if(game == "Minesweeper"){
    const minutes = Math.floor(element.score / 60);
    const seconds = element.score % 60;
    const paddedSeconds = seconds.toString().padStart(2, '0');
    score_cell.textContent = `${minutes}:${paddedSeconds}`;
    }else
      score_cell.textContent = element.score;
    
    
    new_row.appendChild(position_cell);
    new_row.appendChild(name_cell);
    new_row.appendChild(score_cell);

    table.appendChild(new_row);
  });


}

window.addEventListener("load", () => {
  updateLeaderboard("Snake", "Easy");
});

function preventNavigation(event) {
  if (window.self !== window.top) { // Check if the current window is inside an iframe
    event.preventDefault(); // Prevent the link from navigating
  }
}

// Add a click event listener to the "Game Menus" link
document.querySelector('.back-button').addEventListener('click', function(event) {
  preventNavigation(event); // Prevent the link from navigating
});

