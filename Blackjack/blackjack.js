let hidden; 

let cardDeck;

// Player 1 variables
let playerOneCards = [];
let playerOneSum = 0;
let playerOneHasBlackJack = false;
let playerOneIsAlive = true;
let playerOneAce = 0;
// Player 2 variables
let playerTwoCards = [];
let playerTwoSum = 0;
let playerTwoHasBlackJack = false;
let playerTwoIsAlive = true;
let playerTwoAce = 0;

let message = "";
let currentPlayer = 1;  // Start with Player 1

// DOM elements for Player 1 and Player 2
let messageEl = document.getElementById("message-el");
let playerOneSumEl = document.getElementById("player1-sum-el");
let playerOneCardsEl = document.getElementById("player1-cards-el");
let playerTwoSumEl = document.getElementById("player2-sum-el");
let playerTwoCardsEl = document.getElementById("player2-cards-el");



function startGame() {
    buildDeck();  // Build a fresh deck at the start of the game

      // Reset the Ace count for both players
    playerOneAce = 0;
    playerTwoAce = 0;

    currentPlayer = 1; 

    message = "Player, draw a card";
    messageEl.textContent = message;

    // Reset the game state for both players
    playerOneCards = [getRandomCard(), getRandomCard()];  // Get initial cards for Player 1
    playerOneSum = getCardValue(playerOneCards[0]) + getCardValue(playerOneCards[1]);  // Calculate the sum for Player 1
    playerOneHasBlackJack = false;
    playerOneIsAlive = true;

    playerTwoCards = [getRandomCard(), getRandomCard()];  // Get initial cards for Player 2
    playerTwoSum = getCardValue(playerTwoCards[0]) + getCardValue(playerTwoCards[1]);  // Calculate the sum for Player 2
    playerTwoHasBlackJack = false;
    playerTwoIsAlive = true;

  

    // Check if any of the initial cards are Aces and increment Ace count
    playerOneCards.forEach(card => {
        if (card.startsWith("A")) {
            playerOneAce++;
        }
    });
    playerTwoCards.forEach(card => {
        if (card.startsWith("A")) {
            playerTwoAce++;
        }
    });

    // Adjust the sum if necessary
    let result = handleAce(playerOneSum, playerOneAce);
    playerOneSum = result.playerSum;
    playerOneAce = result.playerAceCount;
    result = handleAce(playerTwoSum, playerTwoAce);
    playerTwoSum = result.playerSum;
    playerTwoAce = result.playerAceCount;
    // Display initial cards and sum for both players
    updateCardDisplay('player1-cards-el', playerOneCards, true);
    playerOneSumEl.textContent = "Player 1 Sum: " + playerOneSum;
    updateCardDisplay('player2-cards-el', playerTwoCards, false);
    playerTwoSumEl.textContent = "Player 2 Sum: " + playerTwoSum;

    // Show relevant buttons for gameplay
    document.getElementById("newcard").style.display = "inline";
    document.getElementById("startgame").style.display = "none";
    document.getElementById("endgame").style.display = "inline";
    document.getElementById("player1-sum-el").style.display = "none";

    // Automatically deal cards to meet game logic
    autoCards();
    console.log(playerTwoAce)
    console.log(playerOneAce)
}


function updateCardDisplay(elementId, cards, hideFirstCard = false) {
    const cardContainer = document.getElementById(elementId);
    cardContainer.innerHTML = '';  // Clear existing cards

    cards.forEach((card, index) => {
        let img = document.createElement("img");

        if (hideFirstCard && index === 0) {
            // If the first card should be hidden, show the back of the card
            img.src = "./cards/BACK.png";
            img.alt = "Hidden Card";
        } else {
            // Show the actual card for all other cases
            img.src = "./cards/" + card + ".png";
            img.alt = card;
        }

        img.style.width = "100px";  // Adjust size as needed
        cardContainer.appendChild(img);
    });
}



function newCard() {
    checkIfAlive()

    let newCard = getRandomCard();
    let cardValue = getCardValue(newCard);  // Convert drawn card to value

    if (currentPlayer === 1) {
        playerOneCards.push(newCard);
        playerOneSum += cardValue;

        // If it's an Ace, increase the Ace count
        if (newCard.startsWith("A")) {
            playerOneAce++;
        }

        // Adjust the sum if it exceeds 21 and there are Aces to adjust
        let result = handleAce(playerOneSum, playerOneAce);
        playerOneSum = result.playerSum;
        playerOneAce = result.playerAceCount;
        checkIfAlive()

        updateCardDisplay("player1-cards-el", playerOneCards, true);
        playerOneSumEl.textContent = "Player 1 Sum: " + playerOneSum;
    } else {
        playerTwoCards.push(newCard);
        playerTwoSum += cardValue;

        // If it's an Ace, increase the Ace count
        if (newCard.startsWith("A")) {
            playerTwoAce++;
        }

        // Adjust the sum if it exceeds 21 and there are Aces to adjust
        result = handleAce(playerTwoSum, playerTwoAce);
        playerTwoSum = result.playerSum;
        playerTwoAce = result.playerAceCount;
        checkIfAlive()

        updateCardDisplay("player2-cards-el", playerTwoCards);
        playerTwoSumEl.textContent = "Player 2 Sum: " + playerTwoSum;
    }
    
    console.log(playerTwoAce)
    console.log(playerOneAce)
}


function switchPlayer() {
    // Switch turns between Player 1 and Player 2
    currentPlayer = 2;

}



  function endGame() {

    checkIfAlive()

    if (playerOneIsAlive === false && playerTwoIsAlive == false ) {
        message = "Both players busted, no winners" 
    }else if (playerOneSum > playerTwoSum && playerOneIsAlive === true || playerOneSum < playerTwoSum && playerTwoIsAlive === false) {
        message = "You lose! Dealer score: " + playerOneSum + " Your score: " + playerTwoSum;
    } else if (playerTwoSum > playerOneSum  && playerTwoIsAlive === true || playerTwoSum < playerOneSum && playerOneIsAlive === false) {
        message = "You win! Dealer score: " + playerOneSum + " Your score: " + playerTwoSum;
    } 
    else if (playerOneSum === playerTwoSum) {
        message = "It's a draw! Dealer score: " + playerOneSum + " Your score: " + playerTwoSum;
    } 
    messageEl.textContent = message;

    document.getElementById("newcard").style.display = "none";
    document.getElementById("startgame").style.display = "inline";
    document.getElementById("switchplayer").style.display = "none";
    document.getElementById("endgame").style.display = "none";
    document.getElementById("player1-sum-el").style.display = "inline";

   
    revealHiddenCard()
    
    
    console.log(playerTwoAce)
    console.log(playerOneAce)
    console.log(playerOneIsAlive)
    console.log(playerTwoIsAlive)

    
  
}

function checkIfAlive() {
    if (playerOneSum > 21) {
        playerOneIsAlive = false;
    } 
    
    if (playerTwoSum > 21) {
        playerTwoIsAlive = false;
    } 

}

function buildDeck() {
    let cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10",
        "J", "Q", "K"];
    let cardTypes = ["C", "H", "S", "D"]

    cardDeck = [];

    for (let i = 0; i < cardTypes.length; i++) {
        for (let j = 0; j < cardValues.length; j++) {
            cardDeck.push(cardValues[j] + "-" + cardTypes[i]);
        } 
    } 

}

    function getRandomCard() {
        // Generate a random index between 0 and the current length of the card deck
    let randomIndex = Math.floor(Math.random() * cardDeck.length);
        
        // Get the card from the deck using the random index
    let card = cardDeck[randomIndex];
    
        // Remove the drawn card from the deck so it cannot be drawn again
    cardDeck.splice(randomIndex, 1);

    
    return card;  // Return the drawn card

    
}

function getCardValue(card) {
    let value = card.split("-")[0];  // Get the value part (e.g., "A", "2", "K")
    if (value === "A") {
        return 11;  // Start by treating Ace as 11
    } else if (value === "J" || value === "Q" || value === "K") {
        return 10;
    } else {
        return parseInt(value);  // Convert "2" to "10" to integers
    }
}

function revealHiddenCard() {
    playerOneCardsEl.innerHTML = playerOneCards.map(card => `<img src="/Blackjack/cards/${card}.png" alt="${card}" />`).join("");
    playerOneSumEl.textContent = "Player 1 Sum: " + playerOneSum;
}


function autoCards() {

    while (currentPlayer === 1 && playerOneSum < 17) {
        newCard();

    } 
        switchPlayer();
        document.getElementById("newcard").style.display = "inline";

    }
    
    function handleAce(playerSum, playerAceCount) {
        // Adjust the player sum for Aces if the sum exceeds 21
        while (playerSum > 21 && playerAceCount > 0) {
            playerSum -= 10;  // Reduce the Ace value from 11 to 1 by subtracting 10
            playerAceCount -= 1;  // Reduce the Ace count
        }
        return { playerSum, playerAceCount }
        }

