// https://tetris.fandom.com/wiki/Tetris_Guideline

// get a random integer between the range of [min,max]
// @see https://stackoverflow.com/a/1527820/2124254

/*Notes
- Store a block
- Preview of next block
- Adjust randomnedd so you still see all 7 blocks within some larger sequence
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
    context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  
    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
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
  
  let count = 0;
  let tetromino = getNextTetromino();
  let rAF = null;  // keep track of the animation frame so we can cancel it
  let gameOver = false;


  
  // game loop
  function loop() {
    if(!paused && !gameOver)
    {
      // Change the button's text
      document.getElementById("tetrisPlayButton").innerHTML = "Pause!";
      document.getElementById("tetrisPlayButton").onclick = pauseClicked;

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
  
    // left and right arrow keys (move)
    if (e.which === 37 || e.which === 39) {
      const col = e.which === 37
        ? tetromino.col - 1
        : tetromino.col + 1;
  
      if (isValidMove(tetromino.matrix, tetromino.row, col)) {
        tetromino.col = col;
      }
    }
  
    // up arrow key (rotate)
    if (e.which === 38) {
      const matrix = rotate(tetromino.matrix);
      if (isValidMove(matrix, tetromino.row, tetromino.col)) {
        tetromino.matrix = matrix;
      }
    }
  
    // down arrow key (drop)
    if(e.which === 40) {
      score+=1;
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
    if(e.which === 32) {
      hold()
    }

  }

  function pDown(e) 
  {
    if(e.which === 80) {
      if(paused)
        resume()
      else
        pauseClicked()
    }
  }

  // document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', pDown);


  //Starts as play button
  document.getElementById("tetrisPlayButton").innerHTML = "Play!";
  document.getElementById("tetrisPlayButton").onclick = resume;

  function pauseClicked() {
    console.log("Hi pause was pressed!")
    paused=true;
    document.removeEventListener('keydown', handleKeyDown);

    game.classList.add('show');


    document.getElementById("tetrisPlayButton").innerHTML = "Play!";
    document.getElementById("tetrisPlayButton").onclick = resume;
  }

  function resume() {
    console.log("Hi play was pressed!")
    paused=false;
    document.addEventListener('keydown', handleKeyDown);

    game.classList.remove('show');

    loop();
  }
  