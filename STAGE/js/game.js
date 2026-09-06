const board = document.getElementById("board");
const snakeElement = document.getElementById("snake");
const foodElement = document.getElementById("food");
const scoreElement = document.getElementById("score");
const bestElement = document.getElementById("best");
const pauseButton = document.getElementById("pauseButton");

const cell = 30;
const columns = 28;
const rows = 13;

const difficulty = new URLSearchParams(window.location.search).get("difficulty");

let speed = 150;

if (difficulty === "easy") {
    speed = 200;
}

if (difficulty === "hard") {
    speed = 90;
}

let snake = [
    { x: 10, y: 6 },
    { x: 9, y: 6 },
    { x: 8, y: 6 }
];

let food = {
    x: 18,
    y: 6
};

let direction = {
    x: 1,
    y: 0
};

let nextDirection = {
    x: 1,
    y: 0
};

let score = 0;
let best = Number(localStorage.getItem("snakeBest")) || 0;
let paused = false;
let gameEnded = false;

function drawSnake() {
    snakeElement.innerHTML = "";

    snake.forEach((part, index) => {
        const element = document.createElement("div");

        element.className = "snake-part";

        if (index === 0) {
            element.classList.add("snake-head");
        }

        element.style.left = part.x * cell + "px";
        element.style.top = part.y * cell + "px";

        snakeElement.appendChild(element);
    });
}

function drawFood() {
    foodElement.style.left = food.x * cell + "px";
    foodElement.style.top = food.y * cell + "px";
}

function updateScore() {
    scoreElement.textContent = score;
    bestElement.textContent = best;
}

function createFood() {
    do {
        food.x = Math.floor(Math.random() * columns);
        food.y = Math.floor(Math.random() * rows);
    } while (
        snake.some(part => part.x === food.x && part.y === food.y)
    );
}

function gameOver() {
    gameEnded = true;

    const playAgain = confirm(
        "Game Over!\n\nScore: " +
        score +
        "\n\nPlay again?"
    );

    if (playAgain) {
        location.reload();
    } else {
        window.location.href = "../1/index.html";
    }
}

function moveSnake() {
    if (paused || gameEnded) {
        return;
    }

    direction = nextDirection;

    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    if (
        newHead.x < 0 ||
        newHead.x >= columns ||
        newHead.y < 0 ||
        newHead.y >= rows
    ) {
        gameOver();
        return;
    }

    const eating = newHead.x === food.x && newHead.y === food.y;

    const bodyToCheck = eating ? snake : snake.slice(0, -1);

    const hitSelf = bodyToCheck.some(
        part => part.x === newHead.x && part.y === newHead.y
    );

    if (hitSelf) {
        gameOver();
        return;
    }

    snake.unshift(newHead);

    if (eating) {
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
}

function pauseGame() {
    if (gameEnded) {
        return;
    }

    paused = !paused;
    pauseButton.textContent = paused ? "RESUME" : "PAUSE";
}

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && direction.y === 0) {
        nextDirection = { x: 0, y: -1 };
    }

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
        pauseGame();
    }

    if (event.key.toLowerCase() === "r") {
        location.reload();
    }

    if (event.key === "Escape") {
        window.location.href = "../1/index.html";
    }
});

pauseButton.addEventListener("click", pauseGame);

updateScore();
drawSnake();
drawFood();

setInterval(moveSnake, speed);