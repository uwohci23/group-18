// https://tetris.fandom.com/wiki/Tetris_Guideline

// get a random integer between the range of [min,max]
// @see https://stackoverflow.com/a/1527820/2124254

/*Notes

*/
paused = true;
score = 0;
const scoreElement = document.getElementById('score');
randoms = 0
clear = true;
holding = false;
switched = false;
clear2 = true;
let start = 0;
const highScoreDisplay = document.getElementById('HighestScore');

document.addEventListener('DOMContentLoaded', () => {
  console.log(colors);
  const defaults = localStorage.getItem("useDefaults");
  console.log(defaults);
  if(defaults == "false")
  {
    const blockColors = JSON.parse(localStorage.getItem("blockColors"));
    if(blockColors)
    {    
      console.log(blockColors)
      for (const blockType in blockColors) 
      {
        console.log(blockType)
        console.log(blockColors[blockType])
        changeBlockColor(blockType, blockColors[blockType])
      }
    }

    const backgroundColor = JSON.parse(localStorage.getItem("backgroundColor"));
    const gameScreenColor = JSON.parse(localStorage.getItem("gameScreenColor"));
    console.log(backgroundColor)

    if(backgroundColor)
    {
      console.log("hi")
      changeBackgroundColor("body", backgroundColor) 
      changeBackgroundColor("gameScreen", backgroundColor)
    }

    if(gameScreenColor)
    {
      changeBackgroundColor("hold", gameScreenColor)
      changeBackgroundColor("game", gameScreenColor)
      changeBackgroundColor("next", gameScreenColor)
    }    

  }
  const highScoreString = localStorage.getItem(HIGH_SCORES);
  const highScores = JSON.parse(highScoreString) 

  var highestScore = 0;
  if(highScores)
  {
    var highScoresMedium = highScores["medium_scores"];
    highestScore = highScoresMedium[0]?.score ?? 0;
  }  


  highScoreDisplay.textContent = `Highest Score: ${highestScore}`;

  console.log(colors)
  tetromino = getNextTetromino();
});

updateScore(score);

function getRandomInt2(min, max) {
    // Make sure that intergers are gotten
    min = Math.ceil(min);
    max = Math.floor(max);
  
    //returning random integer within a range
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getRandomInt(min, max) {
    const randomBytes = new Uint32Array(1);
    window.crypto.getRandomValues(randomBytes);
    const range = max - min + 1;
    const randomNumber = randomBytes[0] % range + min;
    return randomNumber;
  }
  
  // generate a new tetromino sequence
  // @see https://tetris.fandom.com/wiki/Random_Generator
  function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      console.log("shape is " + name);
      tetrominoSequence.push(name);
    }
  }

  function genSequence(lastElement) {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    while (sequence.length) {
      const rand = getRandomInt(0, sequence.length - 1);
      const name = sequence.splice(rand, 1)[0];
      console.log("shape is " + name);
      tetrominoSequence.push(name);
    }
    tetrominoSequence.push(lastElement)
  }
  
  // Generate sequence always gave a unique 7 (every sequence had the same 7 shapes, but different order)
  //This give a totally random sequence
  // Now with this it is completely random the next block that shows up
  function generateRandomSequence(lastElement) {
    const choices = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    // console.log("here before loop");
    tetrominoSequence.pop
    while (tetrominoSequence.length < 5) {
      // console.log("here in loop");
      const rand = getRandomInt(0, choices.length - 1);
      const name = choices[rand];
      // console.log("Random Number: " + rand);
      console.log("shape is " + name);
      tetrominoSequence.push(name);
    }
    tetrominoSequence.push(lastElement)
  }


  // get the next tetromino in the sequence
  function getNextTetromino() {
    console.log("Getting next tetrimino");
    if (tetrominoSequence.length === 1 || tetrominoSequence.length === 0) {
      randoms++;
      if (randoms%2==0)
      {
        generateRandomSequence(tetrominoSequence[0]);
      }
        
      else
      {
        if(start == 0)
        {
            generateSequence();
            start++;
        }
        else
        {
            genSequence(tetrominoSequence[0]);
        }
      }
    }
  
    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];
    // console.log("name: " + name)
    // console.log("tetrominos[name]: " + tetrominos[name].length)
    getNext();
    
  
    // I and O start centered, all others start in left-middle
    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);
    //console.log("col: " + col);
  
    // I starts on row 21 (-1), all others start on row 22 (-2)
    const row = name === 'I' ? -1 : -2;
  
    return {
      name: name,      // name of the piece (L, O, etc.)
      matrix: matrix,  // the current rotation matrix
      row: row,        // current row (starts offscreen)
      col: col         // current col
    };
  }

  function getNext()
  {
    next = tetrominoSequence[tetrominoSequence.length-1];
    const nextcol = Math.ceil(nextPieceField[0].length / 2) - Math.ceil(tetrominos[next].length / 2);
    const nextTetrimino = {name: next, matrix: tetrominos[next], row: 2, col: (nextcol)};
    // console.log("Next Shape: " + nextTetrimino.name);

    // console.log("Next col: " + nextcol);

    displayNext(nextTetrimino);

  }


  // rotate an NxN matrix 90deg
  // @see https://codereview.stackexchange.com/a/186834
  function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
      row.map((val, j) => matrix[N - j][i])
    );
  
    return result;
  }
  
  // check to see if the new matrix/row/col is valid
  function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] && (
            // outside the game bounds
            cellCol + col < 0 ||
            cellCol + col >= playfield[0].length ||
            cellRow + row >= playfield.length ||
            // collides with another piece
            playfield[cellRow + row][cellCol + col])
          ) {
          return false;
        }
      }
    }
  
    return true;
  }
  
  // place the tetromino on the playfield
  function placeTetromino() {
    let rowsCleared = 0; // initialize rowsCleared to 0

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {
  
          // game over if piece has any part offscreen
          if (tetromino.row + row < 0) {
            return showGameOver();
          }
  
          playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
        }
      }
    }
  
    // check for line clears starting from the bottom and working our way up
    for (let row = playfield.length - 1; row >= 0;) {
      if (playfield[row].every(cell => !!cell)) {
        console.log("row cleared");
        rowsCleared++;
        
        // drop every row above this one
        for (let r = row; r >= 0; r--) {
          for (let c = 0; c < playfield[r].length; c++) {
            playfield[r][c] = playfield[r-1][c];
          }
        }
      }
      else {
        row--;
      }
    }

  // update score based on rowsCleared
  if (rowsCleared > 0) 
  {
    if (rowsCleared == 1)
      score += 100;
    else if (rowsCleared == 2)
      score += 300;
    else if (rowsCleared == 3)
      score += 500;
    else
      score += 800; 
  }
  updateScore(score);
  switched = false;
    //console.log("Score: " + score);
    tetromino = getNextTetromino();
  }

  const grid2 = 20;
  const nextPieceField = [];
  const nextPieceCanvas = document.getElementById('next');
  const context2 = nextPieceCanvas.getContext('2d');
  nextPieceCanvas.width = 6 * grid2;
  nextPieceCanvas.height = 6 * grid2;

  for (let row = 0; row < 6; row++) {
    nextPieceField[row] = [];
    // console.log("Row: " + row)
  
    for (let col = 0; col < 6; col++) {
      nextPieceField[row][col] = 0;
      // console.log("Column: " + col)
    }
  }

  function displayNext(nextBlock)
  {
    if(!clear)
    {
      context2.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
      clear = true
    }

    // draw the next tetromino
    if (nextBlock) {  
      context2.fillStyle = colors[nextBlock.name];
    //   console.log("nextBlock.name: " + colors[nextBlock.name])
  
      for (let row = 0; row < nextBlock.matrix.length; row++) {
        for (let col = 0; col < nextBlock.matrix[row].length; col++) {
          if (nextBlock.matrix[row][col]) {
            // console.log("Row: " + row)
            // console.log("Column: " + col)
            // console.log("Next block " + nextBlock.name)
            nextPieceField[row][col] = nextBlock.name;
  
            // drawing 1 px smaller than the grid creates a grid effect
            context2.fillRect((nextBlock.col + col) * grid2, (nextBlock.row + row) * grid2, grid2-1, grid2-1);
            clear = false
          }
        }
      }
    }  
  }

  function hold()
  {
    if(!holding)
    {
      // console.log("previous block: " + tetrimino.name)
      heldBlock = tetromino;
    //   console.log("held block: " + tetromino.name)
      tetromino = getNextTetromino();
    //   console.log("current block: " + tetromino.name)

      heldBlock.row = 2;
      heldBlock.col = 1;
      heldBlock.matrix  = tetrominos[heldBlock.name];

      displayHeld(heldBlock)

      tetromino.row = 0;
      tetromino.col = 3;

      holding = true;
      switched = true;
    }
    else
    {
      if(!switched)
      {
        const temp = tetromino
        tetromino = heldBlock;
        heldBlock = temp;

        heldBlock.row = 2;
        heldBlock.col = 1;
        heldBlock.matrix  = tetrominos[heldBlock.name];

        displayHeld(heldBlock)

        tetromino.row = 0;
        tetromino.col = 3;

        switched = true;
      }
    }

  }

  const grid3 = 20;
  const heldPieceField = [];
  const holdPieceCanvas = document.getElementById('hold');
  const context3 = holdPieceCanvas.getContext('2d');
  holdPieceCanvas.width = 6 * grid2;
  holdPieceCanvas.height = 6 * grid2;

  for (let row = 0; row < 6; row++) {
    holdPieceCanvas[row] = [];
    // console.log("Row: " + row)
  
    for (let col = 0; col < 6; col++) {
      holdPieceCanvas[row][col] = 0;
      // console.log("Column: " + col)
    }
  }
  function displayHeld(holdingBlock)
  {
    if(!clear2)
    {
      context3.clearRect(0, 0, holdPieceCanvas.width, holdPieceCanvas.height);
      clear2 = true
    }

    // draw the next tetromino
    if (holdingBlock) {  
      context3.fillStyle = colors[holdingBlock.name];
    //   console.log("holdingBlock.name: " + colors[holdingBlock.name])
  
      for (let row = 0; row < holdingBlock.matrix.length; row++) {
        for (let col = 0; col < holdingBlock.matrix[row].length; col++) {
          if (holdingBlock.matrix[row][col]) {
            // console.log("Row: " + row)
            // console.log("Column: " + col)
            // console.log("held block " + holdingBlock.name)
            nextPieceField[row][col] = holdingBlock.name;
  
            // drawing 1 px smaller than the grid creates a grid effect
            context3.fillRect((holdingBlock.col + col) * grid2, (holdingBlock.row + row) * grid2, grid2-1, grid2-1);
            clear2 = false
          }
        }
      }
    }  
  }


  function updateScore(score) 
  {
    scoreElement.textContent = `Score: ${score}`;
  }
  
  // show the game over screen
  function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;
  
    context.fillStyle = 'black';
    context.globalAlpha = 0.75;
    context.fillRect(10, canvas.height / 2 - 85, canvas.width-20, 160);
  
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText("GAME OVER!", canvas.width / 2, canvas.height / 2 - 60);
    context.font = '32px monospace';
    context.fillText("Your Score:", canvas.width / 2, canvas.height / 2);
    context.font = '32px monospace bold';
    context.fillText((" " + score + " "), canvas.width / 2, canvas.height / 2 + 45);
    gameScreen.classList.add('hide');
    document.removeEventListener('keydown', pDown);
    pauseClicked()
    openGameOverModal()
  }
  
  const canvas = document.getElementById('game');
  const context = canvas.getContext('2d');
  
  //const holdPiece = document.getElementById('hold');

  const grid = 32;
  let tetrominoSequence = [];
  nextTetrominos = [];
  
  // keep track of what is in every cell of the game using a 2d array
  // tetris playfield is 10x20, with a few rows offscreen
  const playfield = [];
  
  // populate the empty state
  for (let row = -2; row < 20; row++) {
    playfield[row] = [];
  
    for (let col = 0; col < 10; col++) {
      playfield[row][col] = 0;
    }
  }
  
  // how to draw each tetromino
  // @see https://tetris.fandom.com/wiki/SRS
  const tetrominos = {
    'I': [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    'J': [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    'L': [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    'O': [
      [1,1],
      [1,1],
    ],
    'S': [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    'Z': [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
    'T': [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ]
  };
  
  // color of each tetromino
  const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
  };

  function resetdefault()
  {
    const reset = localStorage.getItem("resetDefaults");
    console.log(reset);
    if(reset == "true")
      defaultColors()
  }
  function defaultColors()
  {
    const blockColors = {
      'I': 'cyan',
      'O': 'yellow',
      'T': 'purple',
      'S': 'green',
      'Z': 'red',
      'J': 'blue',
      'L': 'orange'
    };

    for (const blockType in blockColors) 
    {
      console.log(blockType)
      console.log(blockColors[blockType])
      changeBlockColor(blockType, blockColors[blockType])
    }
    backgroundColor = '#808080'

    changeBackgroundColor("body", backgroundColor) 
    changeBackgroundColor("gameScreen", backgroundColor)

    gameScreenColor = '#000000'
    
    changeBackgroundColor("hold", gameScreenColor)
    changeBackgroundColor("game", gameScreenColor)
    changeBackgroundColor("next", gameScreenColor)


    // Convert object to string and save to local storage
    const colorsString = JSON.stringify(blockColors);
    localStorage.setItem('blockColors', colorsString);
    const backgroundString = JSON.stringify(backgroundColor);
    localStorage.setItem('backgroundColor', backgroundString);
    const gameScreenString = JSON.stringify(gameScreenColor);
    localStorage.setItem('gameScreenColor', gameScreenString);

    
  }

  function changeBlockColor(blockType, newColor) 
  {
    if(newColor)
    {
      const blockColor = colors[blockType];

      colors[blockType] = newColor;
   
  
      console.log(`Changed color of ${blockType} block from ${blockColor} to ${colors[blockType]}`);
    }
  }
  //changeColor("O", "Brown");

  function changeBackgroundColor(id, color) 
  {
    const element = document.getElementById(id);
    element.style.backgroundColor = color;
  }
  // changeBackgroundColor("gameScreen", "#ff0000")
  // changeBackgroundColor("body", "Red")
  //changeBackgroundColor("game", "gray")

  function whiteTheme()
  {
    for (const blockType in colors) {
      colors[blockType] = "white";
    }
  }
  //whiteTheme()

  function redBlue()
  {
    for (const blockType in colors) 
    {
      colors[blockType] = "red";
    }

    const elements = [document.getElementById("gameScreen"), document.getElementById("body")];
    
    for (let i = 0; i < elements.length; i++) 
    {
      console.log(elements)
      //console.log(element)
      const element = elements[i];
      console.log(element);
      element.style.backgroundColor = "blue";
    }
    
  }
  //redBlue()
  
  let count = 0;
  let tetromino = null;
  let rAF = null;  // keep track of the animation frame so we can cancel it
  let gameOver = false;


  
  // game loop
  function loop() {
    if(!paused && !gameOver)
    {
      // Change the button's text
      // document.getElementById("tetrisPlayButton").innerHTML = "Pause!";
      // document.getElementById("tetrisPlayButton").onclick = pauseClicked;

      rAF = requestAnimationFrame(loop);
      context.clearRect(0,0,canvas.width,canvas.height);
    
      // draw the playfield
      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
          if (playfield[row][col]) {
            const name = playfield[row][col];
            context.fillStyle = colors[name];
    
            // drawing 1 px smaller than the grid creates a grid effect
            context.fillRect(col * grid, row * grid, grid-1, grid-1);}
        }
      }
    }
  
    // draw the active tetromino
    if (tetromino) { 
  
      // tetromino falls every 35 frames
      //Control how fast the tetrimino falls
      if (++count > 60) {
        tetromino.row++;
        count = 0;
  
        // place piece if it runs into anything
        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
          tetromino.row--;
          placeTetromino();
        }
      }
  
      context.fillStyle = colors[tetromino.name];
  
      for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
          if (tetromino.matrix[row][col]) {
  
            // drawing 1 px smaller than the grid creates a grid effect
            context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid-1, grid-1);
          }
        }
      }
    }
  }


  
  // listen to keyboard events to move the active tetromino
  function handleKeyDown(e) {
    e.preventDefault(); // add this line to prevent default behavior

    if (gameOver) return;

    move = e.which

    if(move === 65)
      move = 37;

    if(move === 68)
      move = 39;

    if(move === 87)
      move = 38;

    if(move === 83)
      move = 40;
    
    // left and right arrow keys (move)
    if (move === 37 || move === 39) {
      const col = move === 37
        ? tetromino.col - 1
        : tetromino.col + 1;
  
      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }
  
    // up arrow key (rotate)
    if (move === 38) {
      const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }
  
    // down arrow key (drop)
    if(move === 40) {
      score+=2;
      updateScore(score);
      const row = tetromino.row + 1;
  
      if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
        tetromino.row = row - 1;
  
        placeTetromino();
        return;
      }
  
      tetromino.row = row;
    }

    // Spacebar
    if(move === 32) {
      hold()
    }

  }

  function pDown(e) 
  {
    if(e.which === 80) {
      const modal = document.getElementById('ms-modal');
      if(paused)
      {
        closeModal(modal)
      }
      else
      {
        openModal(modal);
      }
    }
  }

  function pausedControl(e)
  {
    if(e.which === 82) 
    {
      confirmation.style.display = 'inline-block';
      document.querySelector(".pause-modal").classList.remove('active');
      confirmation.classList.add('restart-cmd');
      confirmMsgElement.textContent = "Are you sure you would like to restart the current game?";
      document.removeEventListener('keydown', pausedControl);
      document.addEventListener('keydown', restartEndControl);
    }
    if(e.which === 77 || e.which === 81) 
    {
      confirmation.style.display = 'inline-block';
      document.querySelector(".pause-modal").classList.remove('active')
      confirmMsgElement.textContent = "Are you sure you would like to exit the current game?";
      document.removeEventListener('keydown', pausedControl);
      document.addEventListener('keydown', MenuEndControl);
    }
  }

  function restartEndControl(e)
  {
    if(e.which === 89) 
    {
      location.reload();
      confirmationPanel.classList.remove('restart-cmd');
    }
    if(e.which === 67 || e.which === 78) 
    {
      document.addEventListener('keydown', pausedControl);
      document.removeEventListener('keydown', MenuEndControl);
      confirmation.classList.remove('restart-cmd');
    if(confirmation.classList.contains('end')) 
    {
      document.querySelector(".game-over-modal").classList.add('active');
    }
    else
    {
      document.querySelector(".pause-modal").classList.add('active');
    }
    confirmation.style.display = 'none';
    }
  }
  function MenuEndControl(e)
  {
    if(e.which === 89) 
    {
      resetdefault();
      location.href = "../UI/game-select.html";
    }
    if(e.which === 67 || e.which === 78) 
    {
      confirmation.classList.remove('restart-cmd');
    if(confirmation.classList.contains('end')) 
    {
      document.querySelector(".game-over-modal").classList.add('active');
    }
    else
    {
      document.querySelector(".pause-modal").classList.add('active');
    }
    confirmation.style.display = 'none';
    }
  }

  // document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', pDown);


  //Starts as play button
  // document.getElementById("tetrisPlayButton").innerHTML = "Play!";
  // document.getElementById("tetrisPlayButton").onclick = resume;

  function pauseClicked() {
    console.log("Hi pause was pressed!")
    paused=true;
    document.removeEventListener('keydown', handleKeyDown);

    game.classList.add('hide');
    gameScreen.classList.add('hide');
    body.classList.add('hide');


    // document.getElementById("tetrisPlayButton").innerHTML = "Play!";
    // document.getElementById("tetrisPlayButton").onclick = resume;
  }

  function resume() {
    console.log("Hi play was pressed!")
    paused=false;
    document.addEventListener('keydown', handleKeyDown);

    game.classList.remove('hide');
    gameScreen.classList.remove('hide');
    body.classList.remove('hide');

    loop();
  }

  /* PAUSE STUFF */
  //Add Confirmation after Choosing to Restart or Go to Menu
  const openModalButtons = document.getElementById('pause-button'); //pause
  const closeModalButtons = document.querySelectorAll('[data-modal-close]'); //resume
  const restartButton = document.getElementById('restart'); //restart
  const menuButton = document.getElementById('menu'); //menu
  const overlay = document.getElementById('overlay'); //screen  

  const modal = document.querySelector(openModalButtons.dataset.modalTarget);
  //console.log(modal)
  
  //Open Pause Menu
  openModalButtons.addEventListener('click', function() {openModal(modal); } );

  // closeModalButtons.addEventListener('click', function() {const modal = closeModalButtons.closest('.pause-modal'); closeModal(modal);} );
  
  //Close Pause Menu to continue game
  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.pause-modal');
      closeModal(modal);
    })
  })

  //restartButton.addEventListener('click', function() {location.reload();})
  restartButton.addEventListener('click', function() 
  {
    confirmation.style.display = 'inline-block';
    document.querySelector(".pause-modal").classList.remove('active');
    confirmation.classList.add('restart-cmd');
    confirmMsgElement.textContent = "Are you sure you would like to restart the current game?";
    document.removeEventListener('keydown', pausedControl);
    document.addEventListener('keydown', restartEndControl);
  });

  //menuButton.addEventListener('click', function() {resetdefault(); location.href = "../UI/game-select.html";})
  menuButton.addEventListener('click', function() 
  {
    confirmation.style.display = 'inline-block';
    document.querySelector(".pause-modal").classList.remove('active')
    confirmMsgElement.textContent = "Are you sure you would like to exit the current game?";
    document.removeEventListener('keydown', pausedControl);
    document.addEventListener('keydown', MenuEndControl);
  });
  
  function openModal(modal) {
    if (modal == null) return;
    pauseClicked();
    modal.classList.add('active');
    overlay.classList.add('active');
    document.addEventListener('keydown', pausedControl);
  }
  
  function closeModal(modal) {
    if (modal == null) return;
    resume();
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.removeEventListener('keydown', pausedControl);
  }


  /* END OF GAME */
  const gameOverModal = document.getElementById('game-over-modal');
  const restartGameButton = document.getElementById('restart-game');
  const goMenuButton = document.getElementById('go-menu');
  const playerNameInput = document.getElementById('player-name');
  const finalScoreSpan = document.getElementById('final-score');
  const submitScore = document.getElementById('submit-button')
  
  //openGameOverModal()

  //Submit Score event
  submitScore.addEventListener('click', saveHighScore);

  // Restart event
  restartGameButton.addEventListener('click', function() {location.reload();})


  // Menu event
  goMenuButton.addEventListener('click', function() 
  {
    confirmation.style.display = 'inline-block';
    confirmMsgElement.textContent = "Are you sure you would like to exit the current game?";
    confirmation.classList.add('end');
    document.querySelector(".game-over-modal").classList.remove('active')
  });

  function openGameOverModal() {
    //console.log(score);
    if(isHighScore())
    {
      document.removeEventListener('keydown', pausedControl);
      restartGameButton.disabled = true;
      goMenuButton.disabled = true;
      const highScoreElement = document.getElementById('highScore');
      highScoreElement.textContent = "HIGH SCORE!!";
      const highScoreMsgElement = document.getElementById('highScoremsg');
      highScoreMsgElement.textContent = "Enter your name so we can record history!";
      const recordScoreElement = document.getElementById('recordScore');
      recordScoreElement.style.display = 'none';
    }
    if(isLowScore())
    {
      const recordScoreElement = document.getElementById('recordScore');
      recordScoreElement.style.display = 'none';
      submitScore.disabled = true;
    }
    finalScoreSpan.textContent = score;
    document.addEventListener('keydown', function(event) {
    });
    gameOverModal.classList.add('active');
    overlay.classList.add('active');
  }

  function closeGameOverModal() {
    gameOverModal.classList.remove('active');
    overlay.classList.remove('active');
  }




  /* HIGH SCORE */

  const NO_OF_HIGH_SCORES = 10;
  const HIGH_SCORES = 'Tetris top scores';

  const highScoreString = localStorage.getItem(HIGH_SCORES);
  const highScores = JSON.parse(highScoreString) ?? {
            easy_scores: [],
            medium_scores: [],
            hard_scores: []
        };

  function saveHighScore()
  {
    const name = document.querySelector("#player-name").value;

    if(name.trim() == "")
    {
      alert("Please use the text area to enter a name to go with your score!");
      return;
    }

    notification.style.display = "block";
    setTimeout(function() {
      notification.style.display = "none";
    }, 2000);
    

    var highScoresMedium = highScores["medium_scores"];

    const newScore = { score, name };

    // 1. Add to list
    console.log(JSON.stringify(highScoresMedium))
    highScoresMedium.push(newScore);
    console.log(JSON.stringify(highScoresMedium))
  
    // 2. Sort the list
    highScoresMedium.sort((a, b) => b.score - a.score);
    
    // 3. Select new list
    highScoresMedium.splice(NO_OF_HIGH_SCORES);
    
    // 4. Save to local storage
    highScores["medium_scores"] = highScoresMedium;
    localStorage.setItem(HIGH_SCORES, JSON.stringify(highScores));

    submitScore.disabled = true;
    restartGameButton.disabled = false;
    goMenuButton.disabled = false;

  }


   function isHighScore() 
   {
    var highScoresMedium = highScores["medium_scores"];
    const highestScore = highScoresMedium[0]?.score ?? 0;
    console.log("score " + score)
    console.log("highestScore " + highestScore)
    if (!(score > highestScore)){
        return false;
    }

    return true;
  }

  function isLowScore() 
   {
    var highScoresMedium = highScores["medium_scores"];
    const lowestScore = highScoresMedium[NO_OF_HIGH_SCORES-1]?.score ?? 0;
    console.log("score " + score)
    console.log("lowest " + lowestScore)
    if (score < lowestScore){
        return true;
    }

    return false;
  }

  /* Confirmation Panel */
  const confirmation = document.getElementById('confirmation-modal');
  const cancel = document.getElementById('cancel');
  const confirm = document.getElementById('continue');
  const confirmMsgElement = document.getElementById('confirmMsg');



  confirm.addEventListener('click', function() 
  {
    if(confirmation.classList.contains('restart-cmd')) 
    {
      location.reload();
      confirmationPanel.classList.remove('restart-cmd');
    }
    else
    {
      resetdefault();
      location.href = "../UI/game-select.html";
    }
    resetdefault(); location.href = "../UI/game-select.html";
  });

  cancel.addEventListener('click', function() 
  {
    confirmation.classList.remove('restart-cmd');
    if(confirmation.classList.contains('end')) 
    {
      document.querySelector(".game-over-modal").classList.add('active');
    }
    else
    {
      document.querySelector(".pause-modal").classList.add('active');
    }
    confirmation.style.display = 'none';
  });




