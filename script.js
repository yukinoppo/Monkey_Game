let level = 4;
let expectedNumber = 1;
let gameRunning = false;

const startButton = document.getElementById("startButton");
const gameBoard = document.getElementById("gameBoard");
const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");

function startGame() {
    if (gameRunning === true) {
        return;
    }

    gameRunning = true;
    level = 4;
    expectedNumber = 1;
    console.log("Game Started");

    startRound()
}

startButton.addEventListener("click", startGame);

function startRound() {

    let positions = getRandomPositions(level);

    for (let i = 1; i <= level; i++) {

        const square = document.createElement("div");

        square.textContent = i;
        square.classList.add("square");

        let position = positions[i - 1];

        let row = Math.floor((position - 1) / 6) + 1;
        let column = ((position - 1) % 6) + 1;

        square.style.gridRow = row;
        square.style.gridColumn = column;

        square.addEventListener("click", function () {
            if (!gameRunning) {
                return;
            }

            if (i === expectedNumber) {

                square.classList.add("correct");
                expectedNumber++;

                if (expectedNumber > level) {

                level++;
                expectedNumber = 1;

                levelDisplay.textContent = level;

                gameBoard.innerHTML = "";

                startRound();
            }

            } else {
                console.log("WRONG CLICK");

                square.classList.add("wrong");
                message.textContent = "Wrong!";
                gameRunning = false;

            }
        });

        gameBoard.appendChild(square);
    }

    setTimeout(function () {

    const squares = document.querySelectorAll(".square");

    squares.forEach(function (square) {
        square.classList.add("hidden-number");
    });

}, 650);
}

function getRandomPositions(count) {
    let usedPositions = [];

    while (usedPositions.length < count) {
        let position = Math.floor(Math.random() * 30) + 1;

        if (!usedPositions.includes(position)) {
            usedPositions.push(position);
        }
    }

    return usedPositions;
}

