const initialValue = {
  moves: [],
};

export default class Store {
  #state = initialValue;

  constructor(players) {
    this.players = players;
  }

  get game() {
    const state = this.#getState();

    const currentPlayer = this.players[state.moves.length % 2];
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

    for (const player of this.players) {
      const selectedCircleIds = state.moves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.circleId);

      for (const pattern of winningPatterns) {
        if (pattern.every((v) => selectedCircleIds.includes(v))) {
          winner = player;
        }
      }
    }

    return {
      currentPlayer,
      status: {
        isComplete: winner != null || state.moves.length === 42,
        winner,
      },
    };
  }

  playerMove(circleId) {
    const state = this.#getState();
    const stateClone = structuredClone(state);

    stateClone.moves.push({
      circleId,
      player: this.game.currentPlayer,
    });
    this.#saveState(stateClone);
  }

  reset() {
    this.#saveState(initialValue);
  }

  #getState() {
    return this.#state;
  }

  #saveState(stateOrFn) {
    const prevState = this.#getState();
    let newState;

    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argumetn passed to saveState");
    }

    this.#state = newState;
  }
}
