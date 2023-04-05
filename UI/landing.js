//Redirect to the game select page if user clicks anywhere or presses any key 
document.addEventListener("click", function() {
    window.location.href = "./game-select.html";
});

document.addEventListener("keydown", function() {
    window.location.href = "./game-select.html";
});

//Make the bricks fall top to botom, but add random delay before starting
let brick_offsets = [2, 10, 86, 92]
tetris_bricks = document.querySelectorAll('.brick');

function executeWithDelay(arr) {
    arr.forEach((element, i) => {
        console.log("hey");
        element.style.left = `${brick_offsets[i%4]}%`;
        element.style.display = 'block'
        let delay = Math.floor(Math.random() * 1200); // random delay between 0 and 5 seconds
        if(i >= 4){
            delay += 1300;
        } 
        setTimeout(() => {
            fall(element);
        }, delay);
    });
}
  
executeWithDelay(tetris_bricks);

function fall(brick) {
    let position = 0;
    setInterval(() => {
        position += 3; // speed of falling
        brick.style.top = `${position}px`;
        if (position+84 >= window.innerHeight) {
            position = 0;
            brick.style.top = '0';
        }
    }, 15); //frequency of updates
}
