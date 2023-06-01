import View from "./view.js";
import Store from "./store.js";

const players = [
  {
    id: 1,
    name: "Player 1",
    colorClass: "magenta",
  },
  {
    id: 2,
    name: "Player 2",
    colorClass: "purple",
  },
];

function init() {
  const view = new View();
  const store = new Store(players);

  view.bindGameResetEvent((event) => {
    view.closeAll();

    store.reset();

    view.clearMoves();
    view.setTurnIndicator(store.game.currentPlayer);
  });

  view.bindNewRoundEvent((event) => {
    console.log("new round event");
    console.log(event);
  });

  view.bindPlayerMoveEvent((event) => {
    const clickedCircle = event.target;

    if (clickedCircle.classList.contains("data-occupied")) return;

    // Handle the move; put the color in the right circle.
    view.handlePlayerMove(clickedCircle, store.game.currentPlayer);

    // Update the state with the new move
    store.playerMove(+clickedCircle.id);

    if (store.game.status.isComplete) {
      view.openModal(
        store.game.status.winner
          ? `${store.game.status.winner.name} wins!`
          : "Tie game!"
      );
      return;
    }

    // currentPlayer is changed now; reset the turn indicator.
    view.setTurnIndicator(store.game.currentPlayer);
  });
}

window.addEventListener("load", init);
