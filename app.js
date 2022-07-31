"use strict";
// main Elements
const gameContainer = document.querySelector("[data-the-game]");
const cardsContainer = document.querySelector("[data-game-body]");
const result = document.querySelector("[data-result]");
const timer = document.querySelector("[data-timer]");
const messes = document.querySelector("[data-messes]");
// Audio Objects
const gameThemeAudio = new Audio("audio/game-themee.mp3");
gameThemeAudio.loop = true;
let playGameTheme = true;
const compairedSound = new Audio("audio/win.mp3");
const notCompairedSound = new Audio("audio/lose.mp3");
let playEffects = true;
const gameOverSound = new Audio("audio/game-over.mp3");
const winGameSound = new Audio("audio/game-win.mp3");
let playEndGameSound = true;
reduceAudioVolume(
  0.4,
  gameThemeAudio,
  gameOverSound,
  winGameSound,
  notCompairedSound
);
function reduceAudioVolume(volumeLvl, ...audioObjects) {
  audioObjects.forEach((audio) => {
    audio.volume = volumeLvl;
  });
}
// needed Varibales
let gameTime = 60; // seconds
let duration = 1000;

// just to make the time counter a global to access it from Otherfunctions
let timeCount = setInterval(() => {});

let imgSource = [
  "river",
  "window",
  "triangle",
  "cube",
  "tree-hole",
  "old-vilage",
  "heptagon",
  "pentagon",
  "hexagon",
];

// start the game
displaySplashScreen("Start");
var gameRunning = false;
function startGame() {
  gameRunning = true;
  enterName(document.querySelector(".name span"));
  displayContent();
  countDown();
  finishGame();
  sounds.forEach((sound) => {
    updateSoundState(sound);
  });
}
// reset all element's values to the default
function resetValues() {
  cardsContainer.innerHTML = "";
  timer.style.color = "white";
  gameRunning = false;
  document.querySelector("[data-messes]").textContent = 0;
  timer.children[0].textContent = "00";
  timer.children[1].textContent = "00";
  gameThemeAudio.pause();
  result.innerHTML = "";
}
function randomAndDouble(array) {
  let StoreArray = array.slice();
  let result = array.slice();
  for (let i = 0, length = StoreArray.length; i < length; i++) {
    let random = Math.floor(Math.random() * result.length);
    result.splice(random, 0, StoreArray[i]);
  }
  return result;
}
// display cards on the screen and trigger some other functions
function displayContent() {
  // randomize cards
  let cardContent = randomAndDouble(imgSource);
  // append elements to the DOM
  cardContent.forEach((e) => {
    // card Element
    let card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-card-name", e);
    card.addEventListener("click", () => {
      checkFliped(card);
    });
    // front Element
    let front = document.createElement("div");
    front.textContent = "?";
    front.className = "front";
    // back Element
    let back = document.createElement("div");
    back.className = "back";
    // create img and append it to the back element
    let img = document.createElement("img");
    img.src = `imgs/game-images/${e}.jpg`;
    back.appendChild(img);
    card.appendChild(front);
    card.appendChild(back);
    cardsContainer.appendChild(card);
  });
  // I used Timeout to make the cards fliped after they added to the DOM
  setTimeout(flipeAll);
}
// check if the fliped cards are the same and does user opened 2 cards or not
function checkFliped(card) {
  card.classList.add("is-fliped");
  let fliped = document.querySelectorAll(".is-fliped");
  if (fliped.length === 2) {
    cardsContainer.style.pointerEvents = "none";
    if (fliped[0].dataset.cardName === fliped[1].dataset.cardName) {
      fliped[0].classList.remove("is-fliped");
      fliped[1].classList.remove("is-fliped");
      fliped[0].classList.add("compaired");
      fliped[1].classList.add("compaired");
      if (playEffects) compairedSound.play();
      if (
        document.querySelectorAll(".compaired").length ===
        cardsContainer.children.length
      ) {
        winLose(true);
      }
    } else {
      if (playEffects) notCompairedSound.play();
      messes.textContent = parseInt(messes.textContent) + 1;
      setTimeout(() => {
        fliped[0].classList.remove("is-fliped");
        fliped[1].classList.remove("is-fliped");
      }, duration);
    }
    setTimeout(() => {
      cardsContainer.style.pointerEvents = "all";
    }, duration);
  }
}
// to take Player name and put it in the info Element
function enterName(nameElement) {
  if (nameElement.textContent === "") {
    let userName = prompt("Enter your name ");
    if (userName == "" || userName == null) {
      nameElement.textContent = "unknown";
      return;
    }
    nameElement.textContent = userName;
  }
}
// flipe all cards at the beggening of the game for 1 Second
function flipeAll() {
  [...cardsContainer.children].forEach((e) => {
    e.classList.add("is-fliped");
  });
  setTimeout(() => {
    [...cardsContainer.children].forEach((e) => {
      e.classList.remove("is-fliped");
    });
  }, 2000);
}
// timer count-down function and game-over function trigger
function countDown() {
  var seconds = timer.children[1];
  var minutes = timer.children[0];
  let minutesTime = gameTime / 60;
  // to extract seconds from game Time // I hate Math (-_-)
  seconds.textContent = Math.round(
    (minutesTime - Math.floor(minutesTime)) * 60
  );
  minutes.textContent = Math.floor(minutesTime);
  timeCount = setInterval(() => {
    seconds.textContent = parseInt(seconds.textContent) - 1;
    if (seconds.textContent <= 0) {
      minutes.textContent = parseInt(minutes.textContent) - 1;
      seconds.textContent = 59;
    }
    if (minutes.textContent <= 0) {
      // finish the game
      if (seconds.textContent <= 0) winLose(false);
      // when time is about to end i will change the color of the timer
      else if (seconds.textContent <= 10) timer.style.color = "#d70040";
      else if (seconds.textContent <= 20) timer.style.color = "orange";
    }
    // incase if i put uncorrect number or anything else
    if (minutes.textContent <= -1 || isNaN(Number(gameTime))) {
      clearInterval(timeCount);
      winLose(false);
    }
  }, 1000);
}
function winLose(win = true) {
  clearInterval(timeCount);
  let scoreCount = document.querySelectorAll(".compaired");
  let status = document.createElement("div");
  status.innerHTML = `
  <div class="title end-game-title">
  ${win ? "You Win" : "Game Over"}
  <span class=score> 
  ${
    win
      ? ""
      : `your Score is ${scoreCount.length / 2} out of ${imgSource.length}`
  }
  </span>
  <span class="messes">
  ${"You messed " + messes.textContent + " Times"}
  </span>
  </div>
`;
  if (win) {
    // check if the player want to play the music or not
    if (playEndGameSound) winGameSound.play();
    status.className = "win-game status";
    status.setAttribute("data-win-game", "");
  } else {
    // check if the player want to play the music or not
    if (playEndGameSound) gameOverSound.play();
    status.className = "game-over status";
    status.setAttribute("data-game-over", "");
  }
  resetValues();
  displaySplashScreen("Replay", false);
  // append status to the DOM
  result.appendChild(status);
}

// settings code
const settings = document.querySelector("[data-setting]");
const settingControle = document.querySelector("[data-setting-control]");

settingControle.addEventListener("click", (e) => {
  switch (e.target.dataset.settingState) {
    case "open":
      if (settings.classList.contains("active")) {
        settings.classList.remove("active");
      }
      break;
    case "close":
      if (!settings.classList.contains("active")) {
        settings.classList.add("active");
      }
  }
});

// sound setting
const sounds = document.querySelectorAll("[data-sound]");
sounds.forEach((sound) => {
  sound.onclick = () => {
    sound.classList.toggle("no-sound");
    updateSoundState(sound);
  };
});
// toggle play music
function playMusic() {
  if (playGameTheme && gameRunning) {
    gameThemeAudio.currentTime = 0;
    gameThemeAudio.play();
  } else {
    gameThemeAudio.pause();
  }
}
function updateSoundState(objectElement) {
  let check = objectElement.classList.contains("no-sound");
  switch (objectElement.dataset.sound) {
    case "theme-music":
      if (check) {
        playGameTheme = false;
        playMusic();
      } else {
        playGameTheme = true;
        playMusic();
      }
      break;
    case "hit-or-mess":
      if (check) playEffects = false;
      else playEffects = true;
      break;
    case "game-end":
      if (check) playEndGameSound = false;
      else playEndGameSound = true;
  }
  updateLocalSounds();
}

// local Storage Area for sounds

function updateLocalSounds() {
  let localStorageSounds = {
    gameTheme: playGameTheme,
    effects: playEffects,
    gameEnds: playEndGameSound,
  };
  localStorage.setItem("sounds-settings", JSON.stringify(localStorageSounds));
}
window.addEventListener("load", getDataPlus);

function getDataPlus() {
  let obj = JSON.parse(localStorage.getItem("sounds-settings"));
  Object.entries(obj).forEach((value) => {
    if (!value[1]) {
      switch (value[0]) {
        case "gameTheme":
          playGameTheme = false;
          sounds[0].classList.add("no-sound");
          break;
        case "effects":
          playEffects = false;
          sounds[1].classList.add("no-sound");
          break;
        case "gameEnds":
          playEndGameSound = false;
          sounds[2].classList.add("no-sound");
      }
    }
  });
}

// finish the game funcitinality
// finish the game in middle if user click on x
function finishGame() {
  let div = document.createElement("div");
  div.className = "finish-game";
  div.title = "Finish the game";
  let img = document.createElement("img");
  img.src = "imgs/setting-icons/close-svgrepo-com.svg";
  div.appendChild(img);
  div.addEventListener("click", () => {
    div.remove();
    resetValues();
    clearInterval(timeCount);
    displaySplashScreen("Replay");
  });
  document.querySelector("[data-info-head]").appendChild(div);
}

// put splash screen on top of the page

function displaySplashScreen(buttonText, coverThePage = true) {
  let div = document.createElement("div");
  if (!coverThePage) {
    div.style.width = "max-content";
  }
  let button = document.createElement("button");
  div.className = "splash-screen";
  button.className = "special-btn";
  button.textContent = buttonText;
  button.setAttribute("data-start-btn", "");
  button.addEventListener("click", (e) => {
    button.parentElement.remove();
    resetValues();
    startGame();
  });
  div.appendChild(button);

  // clear the page from any other splash screen to put a new one
  document.querySelectorAll(".splash-screen").forEach((div) => {
    div.remove();
  });
  gameContainer.appendChild(div);
}

// change defficulty function
function changeDifficulty(difficulty) {
  switch (difficulty) {
    case "easy":
      gameTime = 30;
      break;
    case "medium":
      gameTime = 20;
      break;
    case "hard":
      gameTime = 10;
      break;
  }
  updateLocalDifficulty();
}

