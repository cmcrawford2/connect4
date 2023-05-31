const App = {
  // All of our selected HTML elements
  // Use a namespace to avoid problems with global variables.
  $: {
    menu: document.querySelector('[data-id="menu"]'),
    menuItems: document.querySelector('[data-id="menu-items"]'),
    resetButton: document.querySelector('[data-id="reset-button"]'),
    newRoundButton: document.querySelector('[data-id="new-round-button"]'),
    circles: document.querySelectorAll(".circle"),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalButton: document.querySelector('[data-id="modal-button"]'),
    turn: document.querySelector('[data-id="turn"]'),
    turnLabel: document.querySelector('[data-id="turn-label"]'),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.circleId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.circleId);
    const winningPatterns = [
      [1, 8, 15, 22],
      [8, 15, 22, 29],
      [15, 22, 29, 36],
      [2, 9, 16, 23],
      [9, 16, 23, 30],
      [16, 23, 30, 37],
      [3, 10, 17, 24],
      [10, 17, 24, 31],
      [17, 24, 31, 38],
      [4, 11, 18, 25],
      [11, 18, 25, 32],
      [18, 25, 32, 39],
      [5, 12, 19, 26],
      [12, 19, 26, 33],
      [19, 26, 33, 40],
      [6, 13, 20, 27],
      [13, 20, 27, 34],
      [20, 27, 34, 41],
      [7, 14, 21, 28],
      [14, 21, 28, 35],
      [21, 28, 35, 42],
      [1, 2, 3, 4],
      [2, 3, 4, 5],
      [3, 4, 5, 6],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [9, 10, 11, 12],
      [10, 11, 12, 13],
      [11, 12, 13, 14],
      [15, 16, 17, 18],
      [16, 17, 18, 19],
      [17, 18, 19, 20],
      [18, 19, 20, 21],
      [22, 23, 24, 25],
      [23, 24, 25, 26],
      [24, 25, 26, 27],
      [25, 26, 27, 28],
      [29, 30, 31, 32],
      [30, 31, 32, 33],
      [31, 32, 33, 34],
      [32, 33, 34, 35],
      [36, 37, 38, 39],
      [37, 38, 39, 40],
      [38, 39, 40, 41],
      [39, 40, 41, 42],
      [15, 23, 31, 39],
      [8, 16, 24, 32],
      [16, 24, 32, 40],
      [1, 9, 17, 25],
      [9, 17, 25, 33],
      [17, 25, 33, 41],
      [2, 10, 18, 26],
      [10, 18, 26, 34],
      [18, 26, 34, 42],
      [3, 11, 19, 27],
      [11, 19, 27, 35],
      [4, 12, 20, 28],
      [4, 10, 16, 22],
      [5, 11, 17, 23],
      [11, 17, 23, 29],
      [6, 12, 18, 24],
      [12, 18, 24, 30],
      [18, 24, 30, 36],
      [7, 13, 19, 25],
      [13, 19, 25, 31],
      [19, 25, 31, 37],
      [14, 20, 26, 32],
      [20, 26, 32, 38],
      [21, 27, 33, 39],
    ];

    let winner = null;

    // TODO: This goes through all patterns even after finding a winner!
    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status:
        moves.length === 42 || winner != null ? "complete" : "in-progress",
      winner, // 1 | 2 | null
    };
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });

    App.$.resetButton.addEventListener("click", (event) => {
      console.log("Reset the game");
    });

    App.$.newRoundButton.addEventListener("click", (event) => {
      console.log("Add a new round");
    });

    App.$.modalButton.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.modal.classList.add("hidden");
      // Strip all the circles of everything but "circle" class.
      App.$.circles.forEach((circle) => {
        circle.classList.remove(
          "circle-magenta",
          "circle-purple",
          "data-occupied"
        );
      });
    });

    App.$.circles.forEach((circle) => {
      circle.addEventListener("click", (event) => {
        let thisCircle = circle;
        let circleId = +thisCircle.id;

        if (circle.classList.contains("data-occupied")) return;

        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);

        if (currentPlayer === 1) {
          thisCircle.classList.add("circle-magenta");
        } else {
          thisCircle.classList.add("circle-purple");
        }
        let nextCircle = thisCircle;
        // If there are empty circles under this one, advance the position.
        while (circleId < 36) {
          // Note the circles array index starts at 0, but the ids start at 1.
          // We need to advance 7 to get the next circle below.
          let nextIndex = circleId + 6;
          if (App.$.circles[nextIndex].classList.contains("data-occupied"))
            break;
          nextCircle = App.$.circles[nextIndex];
          circleId = +nextCircle.id;
        }
        if (thisCircle !== nextCircle) {
          // Remove the color from the start circle.
          setTimeout(() => {
            if (currentPlayer === 1) {
              thisCircle.classList.remove("circle-magenta");
              thisCircle.classList.add("circle-remove-magenta");
            } else {
              thisCircle.classList.remove("circle-purple");
              thisCircle.classList.add("circle-remove-purple");
            }
          }, 500);

          // Remove the remover - we just added it for the animation.
          setTimeout(() => {
            if (currentPlayer === 1) {
              thisCircle.classList.remove("circle-remove-magenta");
            } else {
              thisCircle.classList.remove("circle-remove-purple");
            }
          }, 700);

          // Add the color to the end circle.
          setTimeout(() => {
            if (currentPlayer === 1) {
              nextCircle.classList.add("circle-magenta");
            } else {
              nextCircle.classList.add("circle-purple");
            }
          }, 500);
        }

        nextCircle.classList.add("data-occupied");

        // Say who's up next
        App.$.turnLabel.innerText = `Player ${nextPlayer}, you're up!`;
        if (nextPlayer === 1) {
          App.$.turn.classList.remove("purple");
          App.$.turn.classList.add("magenta");
        } else {
          App.$.turn.classList.remove("magenta");
          App.$.turn.classList.add("purple");
        }

        App.state.moves.push({
          circleId: +nextCircle.id,
          playerId: currentPlayer,
        });

        // Chck if there is a winner or game over.
        const game = App.getGameStatus(App.state.moves);

        if (game.status === "complete") {
          setTimeout(() => {
            App.$.modal.classList.remove("hidden");
            let message = "";
            if (game.winner) {
              message = `Player ${game.winner} wins!`;
            } else {
              message = "Tie game!";
            }
            App.$.modalText.textContent = message;
          }, 800);
        }
      });
    });
  },
};

window.addEventListener("load", App.init);
