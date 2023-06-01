export default class View {
  $ = {};
  $$ = {};

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

  /*
   * DOM helper methods
   */

  updateScoreboard(p1Wins, p2Wins, ties) {
    this.$.p1Wins.innerText = p1Wins === 1 ? `${p1Wins} win` : `${p1Wins} wins`;
    this.$.p2Wins.innerText = p2Wins === 1 ? `${p2Wins} win` : `${p2Wins} wins`;
    this.$.ties.innerText = ties === 1 ? `${ties} tie` : `${ties} ties`;
  }

  openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }

  closeAll() {
    this.#closeModal();
    this.#closeMenu();
  }

  clearMoves() {
    this.$$.circles.forEach((circle) => {
      circle.classList.remove(
        "circle-magenta",
        "circle-purple",
        "data-occupied"
      );
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

  setTurnIndicator(player) {
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
