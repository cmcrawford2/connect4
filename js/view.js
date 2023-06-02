export default class View {
  $ = {};
  $$ = {};

  // Get all the elements that we need to access.

  constructor() {
    this.$.menu = this.#qs('[data-id="menu"]');
    this.$.menuButton = this.#qs('[data-id="menu-button"]');
    this.$.menuItems = this.#qs('[data-id="menu-items"]');
    this.$.resetButton = this.#qs('[data-id="reset-button"]');
    this.$.newRoundButton = this.#qs('[data-id="new-round-button"]');
    this.$.modal = this.#qs('[data-id="modal"]');
    this.$.modalText = this.#qs('[data-id="modal-text"]');
    this.$.modalButton = this.#qs('[data-id="modal-button"]');
    this.$.turn = this.#qs('[data-id="turn"]');
    this.$.p1Wins = this.#qs('[data-id="p1-wins"]');
    this.$.p2Wins = this.#qs('[data-id="p2-wins"]');
    this.$.ties = this.#qs('[data-id="ties"]');
    this.$$.circles = this.#qsAll(".circle");

    // UI only event listeners
    this.$.menuButton.addEventListener("click", (event) => {
      this.#toggleMenu();
    });
  }

  // Render is called when the game starts, when the game is over,
  // when Reset button is clicked, snd when New Round button is clicked.
  // Also called when we refresh or when we detect a change in another browser tab.

  render(game, stats) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    this.#closeAll();
    this.#clearMoves();
    this.#updateScoreboard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} wins!` : "Tie game!");
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  // Render part is called after a player makes a move.
  // We don't want to clear the game and refill it with the saved moves,
  // because we would do that before the token drops down to the final position.
  // Timeout simply works that way.

  renderPart(game) {
    const {
      currentPlayer,
      status: { isComplete, winner },
    } = game;

    if (isComplete) {
      this.#openModal(winner ? `${winner.name} wins!` : "Tie game!");
      return;
    }

    this.#setTurnIndicator(currentPlayer);
  }

  /*
   * Register all the event listeners
   */

  bindGameResetEvent(handler) {
    this.$.resetButton.addEventListener("click", handler);
    this.$.modalButton.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundButton.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.circles.forEach((circle) => {
      circle.addEventListener("click", handler);
    });
  }

  handlePlayerMove(circle, currentPlayer) {
    let thisCircle = circle;
    let circleId = +thisCircle.id;

    if (currentPlayer.id === 1) {
      thisCircle.classList.add("circle-magenta");
    } else {
      thisCircle.classList.add("circle-purple");
    }

    let nextCircle = thisCircle;
    // If there are empty circles under this one, advance the position.
    while (circleId < 36) {
      // Note the circles array index starts at 0, but the ids start at 1.
      // We need to advance 7 to get the next circle below.
      // However id is already advanced by one.
      let nextIndex = circleId + 6;
      if (this.$$.circles[nextIndex].classList.contains("data-occupied")) break;
      nextCircle = this.$$.circles[nextIndex];
      circleId = +nextCircle.id;
    }

    if (thisCircle !== nextCircle) {
      // Remove the color from the start circle.
      setTimeout(() => {
        if (currentPlayer.id === 1) {
          thisCircle.classList.remove("circle-magenta");
          thisCircle.classList.add("circle-remove-magenta");
        } else {
          thisCircle.classList.remove("circle-purple");
          thisCircle.classList.add("circle-remove-purple");
        }
      }, 500);

      // Remove the remover - we just added it for the animation.
      setTimeout(() => {
        if (currentPlayer.id === 1) {
          thisCircle.classList.remove("circle-remove-magenta");
        } else {
          thisCircle.classList.remove("circle-remove-purple");
        }
      }, 700);

      // Add the color to the end circle.
      setTimeout(() => {
        if (currentPlayer.id === 1) {
          nextCircle.classList.add("circle-magenta");
        } else {
          nextCircle.classList.add("circle-purple");
        }
      }, 500);
    }

    nextCircle.classList.add("data-occupied");
    return +nextCircle.id;
  }

  /*
   * DOM helper methods
   */

  #updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = p1Wins === 1 ? `${p1Wins} win` : `${p1Wins} wins`;
    this.$.p2Wins.innerText = p2Wins === 1 ? `${p2Wins} win` : `${p2Wins} wins`;
    this.$.ties.innerText = ties === 1 ? `${ties} tie` : `${ties} ties`;
  }

  #openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }

  #closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  #clearMoves() {
    this.$$.circles.forEach((circle) => {
      circle.classList.remove(
        "circle-magenta",
        "circle-purple",
        "data-occupied"
      );
    });
  }

  // This is called if we refresh the window, so we might be mid-game.

  #initializeMoves(moves) {
    this.$$.circles.forEach((circle) => {
      const existingMove = moves.find((move) => move.circleId === +circle.id);
      if (existingMove) {
        if (existingMove.player.id === 1) {
          circle.classList.add("circle-magenta");
        } else {
          circle.classList.add("circle-purple");
        }
        circle.classList.add("data-occupied");
      }
    });
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menuButton.classList.remove("border");
    const icon = this.$.menuButton.querySelector("i");
    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuButton.classList.toggle("border");

    const icon = this.$.menuButton.querySelector("i");

    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  #setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", "fa-circle", player.colorClass);
    label.classList.add(player.colorClass);
    label.innerText = `${player.name}, you're up!`;

    this.$.turn.replaceChildren(icon, label);
  }

  #qs(selector, parent) {
    const el = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!el) throw new Error("Could not find element");

    return el;
  }

  #qsAll(selector) {
    const elList = document.querySelectorAll(selector);

    if (!elList) throw new Error("Could not find elements");

    return elList;
  }
}
