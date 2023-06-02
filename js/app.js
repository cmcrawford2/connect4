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

// We've tried to make this game "declarative" rather than "imperative"
// meaning that we declare what we want and let View figure out how to do it.
// But it's complicated by the UI for choosing a color.
// You can drop a token from any empty space in the column above, and it
// appears in the right place below. We us timesouts to make that look good.
// So a player move has to be called differently, and we couldn't have the
// "store" simply trigger a render when the state changes.
// Render erases everything and then fills it back in again from the moves.

function init() {
  const view = new View();
  const store = new Store("connect4-storage-key", players);

  // This isn't working right now.
  window.addEventListener("storage", () => {
    view.render(store.game, store.stats);
  });

  view.render(store.game, store.stats);

  view.bindGameResetEvent(() => {
    store.reset();
    view.render(store.game, store.stats);
  });

  view.bindNewRoundEvent(() => {
    store.newRound();
    view.render(store.game, store.stats);
  });

  view.bindPlayerMoveEvent((event) => {
    const clickedCircle = event.target;

    if (clickedCircle.classList.contains("data-occupied")) return;

    // Handle the move; put the color in the right circle.
    const finalCircleId = view.handlePlayerMove(
      clickedCircle,
      store.game.currentPlayer
    );

    // Update the state with the new move
    store.playerMove(finalCircleId);

    // Render, but not from the start.
    view.renderPart(store.game, store.stats);
  });
}

window.addEventListener("load", init);
