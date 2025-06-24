const suits = ["♠", "♣", "♥", "♦"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

let playerHand = [];
let dealerHand = [];
let deck = [];

const playerCardsEl = document.getElementById("player-cards");
const dealerCardsEl = document.getElementById("dealer-cards");
const playerScoreEl = document.getElementById("player-score");
const dealerScoreEl = document.getElementById("dealer-score");
const resultEl = document.getElementById("result");

document.getElementById("hit-btn").onclick = () => {
  playerHand.push(drawCard());
  update();
  if (getScore(playerHand) > 21) endGame();
};

document.getElementById("stand-btn").onclick = () => {
  while (getScore(dealerHand) < 17) {
    dealerHand.push(drawCard());
    update();
  }
  endGame();
};

document.getElementById("restart-btn").onclick = startGame;

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  shuffle(deck);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function getScore(hand) {
  let score = 0;
  let aceCount = 0;
  for (let card of hand) {
    if (card.value === "A") {
      score += 11;
      aceCount++;
    } else if (["K", "Q", "J"].includes(card.value)) {
      score += 10;
    } else {
      score += parseInt(card.value);
    }
  }
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
}

function update() {
  renderHand(playerCardsEl, playerHand);
  renderHand(dealerCardsEl, dealerHand);
  playerScoreEl.textContent = `スコア: ${getScore(playerHand)}`;
  dealerScoreEl.textContent = `スコア: ${getScore(dealerHand)}`;
}

function renderHand(el, hand) {
  el.innerHTML = "";
  hand.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.textContent = `${card.value}${card.suit}`;
    el.appendChild(cardDiv);
  });
}

function endGame() {
  const playerScore = getScore(playerHand);
  const dealerScore = getScore(dealerHand);
  let message = "";

  if (playerScore > 21) {
    message = "あなたのバースト！ディーラーの勝ち！";
  } else if (dealerScore > 21) {
    message = "ディーラーがバースト！あなたの勝ち！";
  } else if (playerScore > dealerScore) {
    message = "あなたの勝ち！";
  } else if (playerScore < dealerScore) {
    message = "ディーラーの勝ち！";
  } else {
    message = "引き分け！";
  }

  resultEl.textContent = message;
  document.getElementById("hit-btn").disabled = true;
  document.getElementById("stand-btn").disabled = true;
}

function startGame() {
  createDeck();
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard()];
  resultEl.textContent = "";
  document.getElementById("hit-btn").disabled = false;
  document.getElementById("stand-btn").disabled = false;
  update();
}

startGame();
