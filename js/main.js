// Contants
let movement = { x: 0, y: 0 };
const foodSound = new Audio("../assets/music/food.mp3");
const gameoverSound = new Audio("../assets/music/gameover.mp3");
const moveSound = new Audio("../assets/music/move.mp3");
const gameMusic = new Audio("../assets/music/music.mp3");
const naagin = new Audio("../assets/music/naaginMarGayi.mp3");

const scoreEl = document.getElementById("score");
// const board = document.getElementById("board");

let speed = 5;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }]; // Snake is array because it will grow as the game progresses
let food = { x: 10, y: 5 }; // Food is just an object because it will only show up in one place at a time
let score = 0;

let hiScore = localStorage.getItem("hiscore");
let hiScoreVal;
let HighScore = document.getElementById("Highscore");
if (hiScore === null) {
  hiScoreVal = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiScoreVal));
} else {
  hiScoreVal = JSON.parse(hiScore);
  HighScore.innerHTML = "High Score: " + hiScoreVal;
}

// Game Loop
function main(ctime) {
  window.requestAnimationFrame(main);
  //console.log(ctime);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTime = ctime;

  gameEngine();
}

//Collision function
function isCollide(snake) {
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      // Bump happened
      return true;
    }
  }

  // Wall hit
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  //Part1 - Updating the snake and food array

  // If snake collides
  if (isCollide(snakeArr)) {
    naagin.play();
    movement = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreEl.innerHTML = "Score: " + score;
    speed = 5;
    alert("Try again, Press any key");
  }

  // If snake eats the food -> increase the size by one and generate food somewhere else
  if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
    snakeArr.unshift({
      x: snakeArr[0].x + movement.x,
      y: snakeArr[0].y + movement.y,
    }); // increase the snake by one
    foodSound.play();
    score++;
    if (score > hiScoreVal) {
      localStorage.setItem("hiscore", JSON.stringify(score));
      hiScoreVal = JSON.parse(localStorage.getItem("hiscore"));
      HighScore.innerHTML = "High Score: " + hiScoreVal;
    }

    scoreEl.innerHTML = "Score: " + score;
    if (speed <= 18) {
      speed++;
    }

    food = {
      x: Math.ceil(2 + Math.random() * 14),
      y: Math.ceil(2 + Math.random() * 14),
    }; // Random food generation between 2 and 16 grids
  }

  // Move the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += movement.x;
  snakeArr[0].y += movement.y;

  //Part2 - Render the snake
  board.innerHTML = ""; // Clear the board
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div"); // Create a div element for the head
    snakeElement.style.gridRowStart = e.y; // set position in y axis
    snakeElement.style.gridColumnStart = e.x; // set position in x axis
    if (index === 0) {
      snakeElement.classList.add("head"); //The first position of array is snake's head
    } else {
      snakeElement.classList.add("snake"); // All other positions are snake's body
    }

    board.appendChild(snakeElement);
  });

  // Render the Food
  foodElement = document.createElement("div"); // Create a div element for the head
  foodElement.style.gridRowStart = food.y; // set position in y axis
  foodElement.style.gridColumnStart = food.x; // set position in x axis
  foodElement.classList.add("food"); // Add a class so that we can manipulate it
  board.appendChild(foodElement);
}

// Main Logic

window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  movement = { x: 0, y: 1 };
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      movement.x = 0;
      movement.y = -1;
      break;
    case "ArrowDown":
      movement.x = 0;
      movement.y = 1;
      break;
    case "ArrowRight":
      movement.x = 1;
      movement.y = 0;
      break;
    case "ArrowLeft":
      movement.x = -1;
      movement.y = 0;
    default:
      break;
  }
});
