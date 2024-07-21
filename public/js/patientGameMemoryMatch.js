document.addEventListener("DOMContentLoaded", () => {
  let cardsArray = [];
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let matchCount = 0;
  let timeLeft = 30;
  let timerId;

  const memoryGame = document.getElementById("memory-game");
  const startGameBtn = document.getElementById("startGameBtn");

  startGameBtn.addEventListener("click", startGame);

  async function fetchRandomIcons() {
    try {
      const response = await fetch("/api/healthCareIcon/randomIcon", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "PatientJWTAuthToken"
          )}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching icons:", error);
      return [];
    }
  }

  async function createBoard() {
    cardsArray = await fetchRandomIcons();
    const doubleCardsArray = [...cardsArray, ...cardsArray];
    shuffle(doubleCardsArray);
    doubleCardsArray.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("memory-card");
      cardElement.dataset.name = card.IconName;
      cardElement.innerHTML = `
          <div class="front"></div>
          <div class="back"><i class="${card.IconClass}"></i></div>
        `;
      cardElement.addEventListener("click", flipCard);
      memoryGame.appendChild(cardElement);
    });
  }

  function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
  }

  function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
    matchCount++;
    if (matchCount === cardsArray.length) {
      showNotification("Congratulations! You won!", "success");
      clearInterval(timerId);
      setTimeout(() => {
        window.location.href = "./patientLuckyDraw.html";
      }, 3000);
    }
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function startTimer() {
    timerId = setInterval(() => {
      timeLeft--;
      document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerId);
        showNotification("Time's up! Game over.", "error");
        disableAllCards();
        displayTryAgainButton();
      }
    }, 1000);
  }

  function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.innerText = message;

    notification.className = `notification ${type}`;
    notification.classList.add("show");

    setTimeout(() => {
      notification.className = "notification";
      notification.classList.remove("show");
    }, 3000); // Show the notification for 3 seconds
  }

  function disableAllCards() {
    const allCards = document.querySelectorAll(".memory-card");
    allCards.forEach((card) => card.removeEventListener("click", flipCard));
  }

  function displayTryAgainButton() {
    const tryAgainBtn = document.createElement("button");
    tryAgainBtn.textContent = "Try Again";
    tryAgainBtn.className = "btn btn-danger mt-3";
    tryAgainBtn.addEventListener("click", () => {
      location.reload();
    });
    document.querySelector(".game-info").appendChild(tryAgainBtn);
  }

  function startGame() {
    createBoard();
    startGameBtn.style.display = "none";
    startTimer();
  }
});
