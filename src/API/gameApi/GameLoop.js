import { isInRange } from "./helperFunc";
import Player from "./Player";

const GameLoop = (stateUpdateHandler) => {
  let player1 = null;
  let player2 = null;
  let gameState = "";
  let nextPlayer = null;
  let winner = null;

  const buildStateObject = () => ({
    player1,
    player2,
    gameState,
    nextPlayer,
    winner,
    error: null,
  });

  const initGame = (name1 = "Mistery Player", name2 = "CPU Player") => {
    if (!stateUpdateHandler || typeof stateUpdateHandler !== "function") {
      throw new Error("stateUpdateHandler should be a function!");
    }
    player1 = Player(name1, false);
    player2 = Player(name2, true);
    gameState = "gameState/initial"; //or gameState/running, gameState/over
    nextPlayer = player1;
    winner = null;
  };

  const startGame = () => {
    player2 && player2.gameboard.populateRandom();
    gameState = "gameState/running";
  };

  const assessGame = () => {
    if (player1.gameboard.allShipsSunk()) {
      winner = player2;
    }
    if (player2.gameboard.allShipsSunk()) {
      winner = player1;
    }
    winner && (gameState = "gameState/over");
  };

  //checks if square at specified coords had already been hit
  const isMoveLegal = (player, coords) => {
    const [x, y] = coords;
    if (!player || !isInRange(x, 0, 9) || !isInRange(y, 0, 9)) {
      return false;
    }
    const boardMap = player.gameboard.getBoardMap();
    if (!/X/.test(boardMap[x][y])) {
      return true;
    }
    return false;
  };

  const gameAction = ({ type, payload }) => {
    switch (type) {
      //called when first initializing the game
      case "gameLoop/initGame":
        initGame(payload.name1, payload.name2);

        stateUpdateHandler(buildStateObject());
        break;
      //called when ready to start the game
      case "gameLoop/startGame":
        if (gameState === "gameState/running") {
          //if game already started, do nothing
          break;
        }
        if (gameState !== "gameState/initial") {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Game not initialized!" },
          });
          break;
        }
        if (!player1 || !player2) {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Invalid players!" },
          });
          break;
        }
        if (player1.gameboard.ships.length < 6) {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Human player board not populated with ships!" },
          });
          break;
        }
        startGame();
        stateUpdateHandler(buildStateObject());
        break;
      case "gameLoop/placeShipsRandomly":
        if (gameState !== "gameState/initial") {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Game not initialized!" },
          });
          break;
        }
        player1.gameboard.populateRandom();
        stateUpdateHandler(buildStateObject());
        break;

      case "gameLoop/strike":
        if (gameState !== "gameState/running") {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Game not running!" },
          });
          break;
        }

        if (payload.playerType !== "human" && payload.playerType !== "cpu") {
          stateUpdateHandler({
            ...buildStateObject(),
            error: { message: "Invalid player type!" },
          });
          break;
        }

        if (payload.playerType === "human") {
          player1.attack(player2, payload.coords);
          nextPlayer = player2;
        }

        if (payload.playerType === "cpu") {
          player2.cpuAttack(player1);
          nextPlayer = player1;
        }
        assessGame();
        stateUpdateHandler(buildStateObject());
        break;

      default:
        stateUpdateHandler({
          ...buildStateObject(),
          error: { message: `${type}: Invalid action type!` },
        });
    }
  };

  return {
    gameAction,
    isMoveLegal,
  };
};

export default GameLoop;
