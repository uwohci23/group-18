import { openGameOverModal } from '../UI/endmenu.js';saveHighScore
import { saveHighScore, isHighScore} from "../UI/highscores.js";

window.onload = function() {
    startGame()
};

document.getElementById('submit-button').addEventListener('click', () => {
    const score = document.querySelector("#final-score").textContent;
    const name = document.querySelector("#player-name").value;
    saveHighScore("Snake", difficulty, score, name);
    document.querySelector("#submit-button").style.display = "none";
});

const difficulty = localStorage.getItem('snake-difficulty')
let gameSpeed;
switch (difficulty) {
  case 'easy':
    gameSpeed = 175;
    break;
  case 'medium':
    gameSpeed = 110;
    break;
  case 'hard':
    gameSpeed = 70;
    break;
  default:
    gameSpeed = 100;
    break;
}
const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// create variables for score, highscore,game, snake and food
let score = 0, snake, food, highscore = 0, game; 

// load images

const ground = new Image();
ground.src = "../Media/ground.png";

const foodImg = new Image();
foodImg.src = "../Media/food.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "../Media/dead.mp3";
eat.src = "../Media/eat.mp3";
up.src = "../Media/up.mp3";
right.src = "../Media/right.mp3";
left.src = "../Media/left.mp3";
down.src = "../Media/down.mp3";

ground.onload = function(){
    
    ctx.drawImage(ground,0,0);

    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);

    ctx.font = "30px Changa one";
    ctx.fillText("Highest score: " + highscore,12*box,1.6*box);
}

//Control pausing 
let paused = false;


//TogglePause function
export function togglePause() {
    paused = !paused;
    if (paused) {
        clearInterval(game);
    }else {
        game = setInterval(draw, gameSpeed);
    }
}

//control the snake
document.addEventListener("keydown",direction);
let d;



// restart the game
function startGame(){
    clearInterval(game);
    highscore = Math.max(score, highscore);
    score = 0; 
    // create the snake
    snake = [];
    snake[0] = {
        x : 9 * box,
        y : 10 * box
    };
    // create the food
    food = {
        x : Math.floor(Math.random()*17+1) * box,
        y : Math.floor(Math.random()*15+3) * box
    }
    d = "";
    // call draw function every 100 ms
    game = setInterval(draw, gameSpeed);
}

// draw everything to the canvas 

function draw(){

    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }

    ctx.drawImage(foodImg, food.x, food.y);
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // we don't remove the tail
    }
    else{

        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }

    // game over 
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        
        dead.play();
        clearInterval(game);

        ctx.fillStyle="green";
        ctx.fillRect(5*box, 8*box, 7*box, 3*box);

        ctx.fillStyle="white";
        ctx.font="30px Changa One";
        ctx.fillText("Your Score: " + score, 6*box, 10*box);
        openGameOverModal(score);
        if(!isHighScore(score, "Snake", difficulty)){
            document.querySelector(".game-over-modal label").style.display = "none";
            document.querySelector(".game-over-modal input").style.display = "none";
            document.querySelector("#submit-button").style.display = "none";
        }
    }

    snake.unshift(newHead);


    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);

    ctx.font = "30px Changa one";
    ctx.fillText("Highest score: " + highscore,12*box,1.6*box);
    
}

function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

// cheack collision function
function collision(newhead,snake){
    for(let i = 0; i < snake.length; i++){
        if(newhead.x == snake[i].x && newhead.y == snake[i].y){
            return true;
        }
    }
    return false;
}

