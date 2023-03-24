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
    position_cell.textContent = i;
    const name_cell = document.createElement("td");
    name_cell.textContent = element.name;
    const score_cell = document.createElement("td");
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

snake_top_scores = {
  easy_scores: [
    {name: "Michael", score: 8},
    {name: "Jason", score: 4}],
  medium_scores: [
    {name: "Michael", score: 8},
    {name: "Jerry", score: 5}],
  hard_scores: [
    {name: "Michael", score: 8},
    {name: "John", score: 4}]
}

localStorage.setItem('Snake top scores', JSON.stringify(snake_top_scores));


