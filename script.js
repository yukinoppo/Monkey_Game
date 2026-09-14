const SUPABASE_URL = "https://wycjtdnuuyigzlheauew.supabase.co";
const SUPABASE_KEY = "sb_publishable_AzqcdJavNurfTbwlT3xFBA_X6eqcCQT";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let level = 4;
let expectedNumber = 1;
let gameRunning = false;
let username = "";
let leaderboard = [];
const DISPLAY_TIME = 650;

const startButton = document.getElementById("startButton");
const gameBoard = document.getElementById("gameBoard");
const levelDisplay = document.getElementById("level");
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");
const gameOverPopup = document.getElementById("gameOverPopup");
const finalScore = document.getElementById("finalScore");
const playAgainButton = document.getElementById("playAgainButton");
const usernameInput = document.getElementById("usernameInput");
const leaderboardDisplay = document.getElementById("leaderboard");


function startGame() {
    if (gameRunning === true) {
        return;
    }

    username = usernameInput.value.trim();

    if (username === "") {
        message.textContent = "Please enter a username!";
        return;
    }

    gameRunning = true;
    level = 4;
    expectedNumber = 1;
    console.log("Game Started");

    setTimeout(function () {
        startRound();
        }, 1000);
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

                let currentScore = Math.max(4, level - 1);

                addToLeaderboard(username, currentScore)
                    .then(function () {
                        loadLeaderboard();
                    });

                setTimeout(function () {
                    finalScore.textContent = currentScore;
                    gameOverPopup.classList.remove("hidden");
                }, 500);

            }
        });

        gameBoard.appendChild(square);
    }

    setTimeout(function () {

    const squares = document.querySelectorAll(".square");

    squares.forEach(function (square) {
        square.classList.add("hidden-number");
    });

}, DISPLAY_TIME);
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

async function addToLeaderboard(name, score) {

    const { error } = await supabaseClient
        .rpc("submit_high_score", {
            player_name: name,
            player_score: score
        });

    if (error) {
        console.error("Error saving score:", error);
    }
}

async function loadLeaderboard() {

    const { data, error } = await supabaseClient
        .from("leaderboard")
        .select("name, score")
        .order("score", { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error loading leaderboard:", error);
        return;
    }

    leaderboard = data;

    displayLeaderboard();
}

function displayLeaderboard() {

    // Clear old leaderboard HTML
    leaderboardDisplay.innerHTML = "";

    // Go through leaderboard array
    leaderboard.forEach(function(player, index) {

        // Create a row
        const row = document.createElement("div");
        row.classList.add("leaderboard-row");

        // Create rank
        const rank = document.createElement("span");
        rank.classList.add("leaderboard-rank");
        rank.textContent = (index + 1) + ".";

        // Create name
        const name = document.createElement("span");
        name.classList.add("leaderboard-name");
        name.textContent = player.name;

        // Create score
        const score = document.createElement("span");
        score.classList.add("leaderboard-score");
        score.textContent = player.score;

        // Put rank, name, score inside row
        row.appendChild(rank);
        row.appendChild(name);
        row.appendChild(score);

        // Put row inside leaderboard
        leaderboardDisplay.appendChild(row);
    });
}

playAgainButton.addEventListener("click", playAgain);

function playAgain() {

    // Hide popup
    gameOverPopup.classList.add("hidden");

    // Clear old squares
    gameBoard.innerHTML = "";

    // Make sure startGame isn't blocked
    gameRunning = false;

    // Start fresh
    startGame();
}
