import Gameboard from "./Gameboard";
import { getRandomInt, arrayMatch, isInRange } from "./helperFunc";

const Player = (playerName, isCPUplayer = false) => {
  const name = playerName;
  const isComputerPlayer = isCPUplayer;
  const gameboard = Gameboard();
  const attacksList = [];
  const attack = (player, coords) => {
    if (!Array.isArray(coords)) {
      return;
    }
    if (!isInRange(coords[0], 0, 9) || !isInRange(coords[1], 0, 9)) {
      return;
    }
    player.gameboard.receiveAttack([...coords]);
    attacksList.push([...coords]);
  };

  let cpuAttack;
  if (isCPUplayer) {
    cpuAttack = (player) => {
      if (!player.gameboard) {
        return;
      }
      if (attacksList.length >= 100) {
        return;
      }
      let randomCoords = [getRandomInt(0, 9), getRandomInt(0, 9)]; 
      while (attacksList.find((hit) => arrayMatch(hit, [...randomCoords]))) {
        randomCoords = [getRandomInt(0, 9), getRandomInt(0, 9)];
      }
      player.gameboard.receiveAttack([...randomCoords]);
      attacksList.push([...randomCoords]);
    };
  }

  return {
    name,
    gameboard,
    isComputerPlayer,
    attack,
    cpuAttack,
    attacksList,
  };
};

export default Player;
