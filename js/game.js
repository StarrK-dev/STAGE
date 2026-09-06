const board = document.querySelector(".board");
const food = document.querySelector(".food");
const snakeParts = document.querySelectorAll(".segment");
const scoreText = document.querySelector(".score-item strong");
const bestText = document.querySelectorAll(".score-item strong")[1];
const pauseButton = document.querySelector(".pause");

const difficulty = new URLSearchParams(window.location.search).get("difficulty");

let speed = difficulty === "easy" ? 180 : difficulty === "hard" ? 80 : 120;

let snake = [
    { x: 14, y: 6 },
    { x: 13, y: 6 },
    { x: 12, y: 6 }
];

let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let foodPos = { x: 20, y: 6 };
let score = 0;
let best = localStorage.getItem("snakeBest") || 0;
let paused = false;
let gameOver = false;

function draw() {
    scoreText.textContent = score;
    bestText.textContent = best;

    food.style.left = foodPos.x * 30 + 1 + "px";
    food.style.top = foodPos.y * 30 + 1 + "px";

    snakeParts.forEach((part, i) => {
        if (snake[i]) {
            part.style.display = "block";
            part.style.left = snake[i].x * 30 + 1 + "px";
            part.style.top = snake[i].y * 30 + 1 + "px";
        } else {
            part.style.display = "none";
        }
    });
}

function newFood() {
    foodPos = {
        x: Math.floor(Math.random() * 28),
        y: Math.floor(Math.random() * 13)
    };
}

function move() {
    if (paused || gameOver) return;

    direction = nextDirection;

    let head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (head.x < 0 || head.x >= 28 || head.y < 0 || head.y >= 13) {
        endGame();
        return;
    }

    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head);

    if (head.x === foodPos.x && head.y === foodPos.y) {
        score++;

        if (score > best) {
            best = score;
            localStorage.setItem("snakeBest", best);
        }

        newFood();
    } else {
        snake.pop();
    }

    draw();
}

function endGame() {
    gameOver = true;
    alert("Game Over! Score: " + score);
}

function pauseGame() {
    paused = !paused;
    pauseButton.textContent = paused ? "RESUME" : "PAUSE";
}

document.addEventListener("keydown", e => {
    if (e.key === "ArrowUp" && direction.y === 0)
        nextDirection = { x: 0, y: -1 };

    if (e.key === "ArrowDown" && direction.y === 0)
        nextDirection = { x: 0, y: 1 };

    if (e.key === "ArrowLeft" && direction.x === 0)
        nextDirection = { x: -1, y: 0 };

    if (e.key === "ArrowRight" && direction.x === 0)
        nextDirection = { x: 1, y: 0 };

    if (e.key === "p") pauseGame();
});

pauseButton.addEventListener("click", pauseGame);

draw();
setInterval(move, speed);