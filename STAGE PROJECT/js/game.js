const snakeElement = document.querySelector(".snake");
const foodElement = document.querySelector(".food");
const scoreElement = document.querySelectorAll(".score-item strong")[0];
const bestElement = document.querySelectorAll(".score-item strong")[1];
const pauseButton = document.querySelector(".pause");
const segments = document.querySelectorAll(".segment");

const difficulty = new URLSearchParams(window.location.search).get("difficulty");

let speed = 150;

if (difficulty === "easy") speed = 200;
if (difficulty === "hard") speed = 90;

let snake = [
{ x: 9, y: 4 },
{ x: 8, y: 4 },
{ x: 7, y: 4 }
];

let food = {
x: 18,
y: 4
};

let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };

let score = 0;
let best = Number(localStorage.getItem("snakeBest")) || 0;
let paused = false;
let ended = false;

function drawSnake() {
segments.forEach((segment, index) => {
if (snake[index]) {
segment.style.display = "block";
segment.style.left = snake[index].x * 30 + "px";
segment.style.top = snake[index].y * 30 + "px";
} else {
segment.style.display = "none";
}
});
}

function drawFood() {
foodElement.style.left = food.x * 30 + "px";
foodElement.style.top = food.y * 30 + "px";
}

function updateScore() {
scoreElement.textContent = score;
bestElement.textContent = best;
}

function createFood() {
do {
food.x = Math.floor(Math.random() * 28);
food.y = Math.floor(Math.random() * 13);
} while (
snake.some(part => part.x === food.x && part.y === food.y)
);
}

function moveSnake() {
if (paused || ended) return;

```
direction = nextDirection;

const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
};

if (
    head.x < 0 ||
    head.x >= 28 ||
    head.y < 0 ||
    head.y >= 13
) {
    gameOver();
    return;
}

const hitSelf = snake.some(
    part => part.x === head.x && part.y === head.y
);

if (hitSelf) {
    gameOver();
    return;
}

snake.unshift(head);

if (head.x === food.x && head.y === food.y) {
    score++;

    if (score > best) {
        best = score;
        localStorage.setItem("snakeBest", best);
    }

    createFood();
} else {
    snake.pop();
}

drawSnake();
drawFood();
updateScore();
```

}

function gameOver() {
ended = true;
alert("Game Over! Score: " + score);
}

function togglePause() {
if (ended) return;

```
paused = !paused;
pauseButton.textContent = paused ? "RESUME" : "PAUSE";
```

}

document.addEventListener("keydown", function(event) {
if (event.key === "ArrowUp" && direction.y === 0) {
nextDirection = { x: 0, y: -1 };
}

```
if (event.key === "ArrowDown" && direction.y === 0) {
    nextDirection = { x: 0, y: 1 };
}

if (event.key === "ArrowLeft" && direction.x === 0) {
    nextDirection = { x: -1, y: 0 };
}

if (event.key === "ArrowRight" && direction.x === 0) {
    nextDirection = { x: 1, y: 0 };
}

if (event.key.toLowerCase() === "p") {
    togglePause();
}

if (event.key.toLowerCase() === "r") {
    location.reload();
}

if (event.key === "Escape") {
    window.location.href = "../1/index.html";
}
```

});

pauseButton.addEventListener("click", togglePause);

snakeElement.style.left = "0";
snakeElement.style.top = "0";
snakeElement.style.width = "840px";
snakeElement.style.height = "390px";

createFood();
drawSnake();
drawFood();
updateScore();

setInterval(moveSnake, speed);
