const rockButton = document.querySelector(".rock-btn");
const paperButton = document.querySelector(".paper-btn");
const scissorsButton = document.querySelector(".scissors-btn");

// get previously saved scores from local storage
const score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  draws: 0,
};

// save scores to local storage
function saveToLocal() {
  localStorage.setItem("score", JSON.stringify(score));
}

// to pick random computer move
function pickComputerMove() {
  let computerMove;
  const randomValue = Math.random();
  if (randomValue < 0.33) {
    computerMove = "rock";
  } else if (randomValue < 0.66) {
    computerMove = "paper";
  } else {
    computerMove = "scissors";
  }
  return computerMove;
}

// if win
function winCondition() {
  score.wins++;
  updateMessage("win");
}

// if lose
function loseCondition() {
  score.losses++;
  updateMessage("lose");
}

// main game playing engine
function playGame(playerMove) {
  const computerMove = pickComputerMove();

  if (playerMove === computerMove) {
    score.draws++;
    updateMessage("draw");
    updateScore();
    saveToLocal();
    updateResults(playerMove, computerMove);
    return;
  } else if (playerMove === "rock") {
    if (computerMove === "scissors") {
      winCondition();
    } else {
      loseCondition();
    }
  } else if (playerMove === "paper") {
    if (computerMove === "rock") {
      winCondition();
    } else {
      loseCondition();
    }
  } else if (playerMove === "scissors") {
    if (computerMove === "paper") {
      winCondition();
    } else {
      loseCondition();
    }
  }
  updateResults(playerMove, computerMove);
  updateScore();
  saveToLocal();
}

const scoreField = document.querySelector(".scores");

// update scores in the DOM
function updateScore() {
  scoreField.innerHTML = `Wins: ${score.wins} Losses: ${score.losses} Draws: ${score.draws}`;
}

updateScore();

// click listeners for rock, paper, scissors button
rockButton.addEventListener("click", () => {
  playGame("rock");
});
paperButton.addEventListener("click", () => {
  playGame("paper");
});
scissorsButton.addEventListener("click", () => {
  playGame("scissors");
});

// updates player and computer moves in DOM
function updateResults(playerMove, computerMove) {
  const resultField = document.querySelector(".results");
  resultField.innerHTML = `
  Your move <img class="result-emojis" src="images/${playerMove}-emoji.png"> :
  <img src="images/${computerMove}-emoji.png" class="result-emojis">
  Computer's move
  `;
}

// shows result (win/lose/draw)
function updateMessage(result) {
  const resultMessage = document.querySelector(".result-message");
  if (result === "draw") {
    resultMessage.innerHTML = "It's a draw!";
  } else if (result === "win") {
    resultMessage.innerHTML = "You win!";
  } else {
    resultMessage.innerHTML = "You lose!";
  }
}

const resetScoreButton = document.querySelector(".reset-score-button");
resetScoreButton.addEventListener("click", showResetConfirmation);

// resets the score
function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.draws = 0;
  saveToLocal();
  isAutoPlaying = true;
  autoPlay();
  document.querySelector(".message-field").innerHTML = `
  <p class="results"></p>
  <h2 class="result-message"></h2>
  `;
  updateScore();
}

let intervalId;
let isAutoPlaying = false;
const autoPlayButton = document.querySelector(".autoplay-button");
autoPlayButton.addEventListener("click", autoPlay);

// autoplay on button click
function autoPlay() {
  if (!isAutoPlaying) {
    isAutoPlaying = true;
    intervalId = setInterval(() => {
      playGame(pickComputerMove());
    }, 1500);
    autoPlayButton.innerHTML = "Stop";
  } else {
    isAutoPlaying = false;
    clearInterval(intervalId);
    autoPlayButton.innerHTML = "Auto Play";
  }
}

document.body.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "r") {
    playGame("rock");
  } else if (event.key.toLowerCase() === "p") {
    playGame("paper");
  } else if (event.key.toLowerCase() === "s") {
    playGame("scissors");
  } else if (event.key.toLowerCase() === "a") {
    autoPlay();
  } else if (event.key === "Backspace") {
    showResetConfirmation();
  }
});

function showResetConfirmation() {
  const resetConfirmationPrompt = document.querySelector(".reset-confirmation");
  resetConfirmationPrompt.style.display = "block";

  const yesButton = document.querySelector(".yes-button");
  const noButton = document.querySelector(".no-button");

  yesButton.addEventListener("click", () => {
    resetScore();
    resetConfirmationPrompt.style.display = "none";
  });

  noButton.addEventListener("click", () => {
    resetConfirmationPrompt.style.display = "none";
  });
}
