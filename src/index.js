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

//grabs the value from the dropdown menu and returns the value
function changeLevel() {
  selectLevel = document.getElementById('level-selector').value;
  return selectLevel;
}

//starts the game, sets max rounds based on selected level in the drop down.
//makes the start button dissappear and prevents the drop down from being selected
//reveals the status text and starts computers turn
function startButtonHandler() {
  setLevel(selectLevel);
  roundCount++;
  document.querySelector(".js-level-select").classList.add("unclickable");
  document.querySelector(".js-start-button").classList.add("hidden");
  document.querySelector(".js-status").classList.remove("hidden");
  playComputerTurn();
  return { startButton, statusSpan };
}

//called when a pad is clicked. takes the color from the activated pad and stores
//in th color variable. plays the sound for the matching pad. 
function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;
  let pad = pads.find((pad) => pad.color === color);
  pad.sound.currentTime = 0;
  pad.sound.play();
  checkPress(color);
  return color;
}

/**
 * HELPER FUNCTIONS
 */

//sets the level of the game, defaulting to level 1 and sets the equivalent amount
// of rounds per level. 
function setLevel(selectLevel = 1) {
  if (selectLevel == 1) return maxRoundCount = 8;
  if (selectLevel == 2) return maxRoundCount = 14;
  if (selectLevel == 3) return maxRoundCount = 20;
  if (selectLevel == 4) return maxRoundCount = 31;
}

//randomly selects a color from the color array.
function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

//sets the status text with a given message.
function setText(element, text) {
  element.textContent = text;
  return element;
}

//activates a pad of a given color, playing its sound and light.
// delay between each pad to legibility. 
function activatePad(color) {
  let pad = pads.find((pad) => pad.color === color);
  pad.selector.classList.add("activated");
  pad.sound.currentTime = 0;
  pad.sound.play();
  setTimeout(() => {
    pad.selector.classList.remove("activated");
    }, 500);
  }

//activates a sequence of pads from the pads array
//calls the activatepad function per pad activated. 
function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, 600 * index);
  })
}

//the computers turn.
//makes the pads uninteractable, and changes the status to Simons turn. 
//displays the current and total rounds in the status. 
//collects random sequence of colors and calls the funtion to activate them.
//at the end of the function, playHuman() is called. 
 function playComputerTurn() {
  document.querySelector(".js-pad-container").classList.add("unclickable");
  setText(statusSpan, "Simon's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);
  computerSequence.push(getRandomItem(pads).color);
  activatePads(computerSequence);

  setTimeout(() => playHumanTurn(roundCount), roundCount * 600 + 1000); // 5
}

//makes pads clickable again and changes status to players turn. 
function playHumanTurn() {
  document.querySelector(".js-pad-container").classList.remove("unclickable");
  setText(statusSpan, "Players turn...");
}


// displays how many moves are left if the player has not made all moved. 
// if the player make a mistake the function ends the game and alerts the player, 
// then resets the game.
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

// checks to see if the player has made all of thier moves. 
// increments round count after completing a round
// 
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

// resets the game. empties the computerSequence, playerSequence arrays.
// sets the roundCounter variable to 0
// unhides the start button, hides the status screen, makes the pads unclickable.
// makes the level selector dropdown unclickable 
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
