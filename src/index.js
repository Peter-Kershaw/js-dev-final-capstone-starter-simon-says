/**
 * DOM SELECTORS
 */

 const startButton = document.querySelector(".js-start-button");
 const statusSpan = document.querySelector(".js-status"); 
 const heading = document.querySelector(".js-heading"); 
 const padContainer = document.querySelector(".js-pad-container"); 
 const levelSelector = document.querySelector(".js-level-select");

/**
 * VARIABLES
 */
let computerSequence = []; // track the computer-generated sequence of pad presses
let playerSequence = []; // track the player-generated sequence of pad presses
let maxRoundCount = 0; // the max number of rounds, varies with the chosen level
let roundCount = 0; // track the number of rounds that have been played so far
let selectLevel = 1; //tracks the current level for simon says
/**
 */


 const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("../assets/simon-says-sound-1.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("../assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("../assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("../assets/simon-says-sound-4.mp3"),
  },
];

/**
 * EVENT LISTENERS
 */

padContainer.addEventListener("click", padHandler);
startButton.addEventListener("click", startButtonHandler);

/**
 * EVENT HANDLERS
 */

function changeLevel() {
  selectLevel = document.getElementById('level-selector').value;
  console.log("selected level:", selectLevel);
  return selectLevel;
}

function startButtonHandler() {
  setLevel(selectLevel);
  console.log('rounds this game: ', maxRoundCount);
  roundCount++;
  document.querySelector(".js-level-select").classList.add("unclickable");
  document.querySelector(".js-start-button").classList.add("hidden");
  document.querySelector(".js-status").classList.remove("hidden");
  playComputerTurn();
  return { startButton, statusSpan };
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;
  let pad = pads.find((pad) => pad.color === color);
  pad.sound.play();
  checkPress(color);
  return color;
}

/**
 * HELPER FUNCTIONS
 */

function setLevel(selectLevel = 1) {
  console.log("current lev: ", selectLevel)
  if (selectLevel == 1) return maxRoundCount = 8;
  if (selectLevel == 2) return maxRoundCount = 14;
  if (selectLevel == 3) return maxRoundCount = 20;
  if (selectLevel == 4) return maxRoundCount = 31;
}


function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}


function setText(element, text) {
  element.textContent = text;
  return element;
}


function activatePad(color) {
  console.log(color) //REMOVE AFTER TESTING
  let pad = pads.find((pad) => pad.color === color);
  pad.selector.classList.add("activated");
  pad.sound.play();
  setTimeout(() => {
    pad.selector.classList.remove("activated");
    }, 500);
  }

function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, 600 * index);
  })
}

 function playComputerTurn() {
  document.querySelector(".js-pad-container").classList.add("unclickable");
  setText(statusSpan, "Simon's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);
  computerSequence.push(getRandomItem(pads).color);
  activatePads(computerSequence);

  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000); // 5
}

function playHumanTurn() {
  document.querySelector(".js-pad-container").classList.remove("unclickable");
  setText(statusSpan, "Players turn...");
}

function checkPress(color) {
  playerSequence.push(color);
  const index = playerSequence.length - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;
  setText(statusSpan, `You have ${remainingPresses} presses left`);
  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("You made a mistake!");
    return;
  }
  if (remainingPresses === 0) {
    checkRound();
    return;
  }
}

function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    resetGame("You win!");
    return;
  } else {
    roundCount += 1;
    playerSequence = [];
    setText(statusSpan, "Nice! Keep going!");
    setTimeout(() => playComputerTurn(), 1000);
  }
}

function resetGame(text) {
  computerSequence = [];
  playerSequence = [];
  roundCount = 0;

  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");
  levelSelector.classList.remove("unclickable");
  
}

/**
 * Please do not modify the code below.
 * Used for testing purposes.
 *
 */
window.statusSpan = statusSpan;
window.heading = heading;
window.padContainer = padContainer;
window.pads = pads;
window.computerSequence = computerSequence;
window.playerSequence = playerSequence;
window.maxRoundCount = maxRoundCount;
window.roundCount = roundCount;
window.startButtonHandler = startButtonHandler;
window.padHandler = padHandler;
window.setLevel = setLevel;
window.getRandomItem = getRandomItem;
window.setText = setText;
window.activatePad = activatePad;
window.activatePads = activatePads;
window.playComputerTurn = playComputerTurn;
window.playHumanTurn = playHumanTurn;
window.checkPress = checkPress;
window.checkRound = checkRound;
window.resetGame = resetGame;
