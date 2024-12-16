console.log("JavaScript Script Loaded");
const gameBoard = document.getElementById("game-board");
console.log("gameBoard", gameBoard);

// Erstelle ein Array mit allen verfügbaren Bildnummern (1-20)
const availableImages = Array.from({length: 20}, (_, i) => i + 1);

// Mische die verfügbaren Bilder und wähle die ersten 8
const shuffledImages = availableImages.sort(() => 0.5 - Math.random());
const selectedImages = shuffledImages.slice(0, 8);

// Erstelle das Kartendeck mit den ausgewählten Bildern
const cards = [...selectedImages, ...selectedImages];
console.log("cards", cards);
// Karten mischen
cards.sort(() => 0.5 - Math.random());
console.log("cards", cards);
let flippedCards = [];
let lockBoard = false;
let lastClickedCard = null; // Variable für die zuletzt angeklickte Karte
let attempts = 0; // Zähler für Versuche
let matchedPairs = 0; // Zähler für gefundene Paare

function createGameBoard() {
  console.log("loading gameBoard");
  cards.forEach((value, index) => {
    console.log(value);
    const card = document.createElement("div");
    const cardImage = document.createElement("img");
    cardImage.setAttribute("src", "./images/card.png");
    cardImage.setAttribute("alt", value);
    card.appendChild(cardImage);
    //       card.innerText = value;
    card.classList.add("card");
    card.dataset.value = value;
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });
}

function flipCard(card) {
    if (lockBoard === true) { 
        console.log("Board locked!")
    } else if (card === lastClickedCard) {
        console.log("Same card clicked twice!");
        return;
    } else if (card.classList.contains('matched')) {
        console.log("Card already matched!");
        return;
    } else {
        console.log("cardclicked", card, card.dataset.value);
        const tempImage = card.querySelector("img");
        console.log("TempImage", tempImage);
        tempImage.setAttribute("src", `./images/card-${card.dataset.value}.png`)
        flippedCards.push(card);
        lastClickedCard = card; // Speichere die zuletzt angeklickte Karte
        console.log(flippedCards);
        if (flippedCards.length === 2) {
            lockBoard = true;
            checkmatch();
        }
    }
}

function checkmatch() {
  const [card1, card2] = flippedCards;
  console.log("card1", card1);
  console.log("card2", card2);
  attempts++; // Erhöhe den Versuchszähler
  
  if (card1.dataset.value === card2.dataset.value) {
    console.log("MATCH");
    matchedPairs++; // Erhöhe den Zähler für gefundene Paare
    card1.classList.add('matched');
    card2.classList.add('matched');
    flippedCards = [];
    lockBoard = false;
    
    // Prüfe, ob alle Paare gefunden wurden
    if (matchedPairs === selectedImages.length) {
      setTimeout(() => {
        // Start confetti effect
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
          return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          }));
          confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          }));
        }, 250);

        // Erstelle Container für die Erfolgsmeldung
        const messageContainer = document.createElement("div");
        messageContainer.style.position = "fixed";
        messageContainer.style.top = "50%";
        messageContainer.style.left = "50%";
        messageContainer.style.transform = "translate(-50%, -50%)";
        messageContainer.style.backgroundColor = "white";
        messageContainer.style.padding = "20px";
        messageContainer.style.borderRadius = "10px";
        messageContainer.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        messageContainer.style.textAlign = "center";
        
        // Füge die Erfolgsmeldung hinzu
        const message = document.createElement("p");
        message.textContent = `Herzlichen Glückwunsch! Sie haben es geschafft! Sie haben ${attempts} Versuche gemacht! Weiter so!`;
        messageContainer.appendChild(message);
        
        // Füge den Neustart-Button hinzu
        const restartButton = document.createElement("button");
        restartButton.textContent = "Spiel neu laden";
        restartButton.style.padding = "10px 20px";
        restartButton.style.fontSize = "16px";
        restartButton.style.cursor = "pointer";
        restartButton.addEventListener("click", () => {
          location.reload();
        });
        messageContainer.appendChild(restartButton);
        
        document.body.appendChild(messageContainer);
      }, 500);
    }
  } else {
    console.log('NOMATCH');
    flippedCards = [];
    setTimeout(() => {
        card1.querySelector('img').setAttribute('src', './images/card.png');
        card2.querySelector('img').setAttribute('src', './images/card.png');
        lockBoard = false;
        lastClickedCard = null; // Reset lastClickedCard when cards don't match
    }, 1000);
  }
}

createGameBoard();
