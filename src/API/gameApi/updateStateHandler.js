import { updateState } from "../../features/gameState/gameStateSlice";
const updateGameState = (gameState) => {
  updateState({ payload: gameState });
};

export default updateGameState;
