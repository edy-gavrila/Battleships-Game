import Ship from "./Ship";
import { getRandomInt, isInRange } from "./helperFunc";

const Gameboard = () => {
  const size = 10;
  const ships = [];
  const missedHits = [];

  //private methods
  const checkHitOnShip = (shipRec, [x, y]) => {
    if (shipRec.orient === "hor") {
      if (
        y >= shipRec.coords[1] &&
        y <= shipRec.coords[1] + shipRec.ship.length &&
        x === shipRec.coords[0]
      ) {
        return true;
      }
    }
    if (shipRec.orient === "ver") {
      if (
        x >= shipRec.coords[0] &&
        x <= shipRec.coords[0] + shipRec.ship.length &&
        y === shipRec.coords[1]
      ) {
        return true;
      }
    }
    return false;
  };

  const getHitCoord = (shipRec, [x, y]) => {
    let hitCoord = null;
    if (shipRec.orient === "hor") {
      hitCoord = y - shipRec.coords[1];
    }
    if (shipRec.orient === "ver") {
      hitCoord = x - shipRec.coords[0];
    }
    return hitCoord;
  };

  //is a ship in a legal position, given the coords?
  const isPositionLegal = (ship, [x, y], orient) => {
    if (x > 9 || y > 9) {
      return false;
    }
    if (orient !== "ver" && orient !== "hor") {
      return false;
    }
    if (orient === "hor") {
      if (ship.length + y > 9) {
        return false;
      }
    }

    if (orient === "ver") {
      if (ship.length + x > 9) {
        return false;
      }
    }

    let overlapsWithShip = false;
    ships.forEach((shipRec) => {
      if (areShipsOverlapped({ ship, coords: [x, y], orient }, shipRec)) {
        overlapsWithShip = true;
      }
    });

    if (overlapsWithShip) {
      return false;
    }

    return true;
  };

  const generateFullCoords = (shipRec) => {
    const fullCoords = [];
    if (shipRec.orient === "hor") {
      for (let i = 0; i < shipRec.ship.length; i++) {
        fullCoords.push([shipRec.coords[0], shipRec.coords[1] + i]);
      }
    }
    if (shipRec.orient === "ver") {
      for (let i = 0; i < shipRec.ship.length; i++) {
        fullCoords.push([shipRec.coords[0] + i, shipRec.coords[1]]);
      }
    }
    return fullCoords;
  };

  const areShipsOverlapped = (shipRec1, shipRec2) => {
    const ship1FullCoords = generateFullCoords(shipRec1);
    const ship2FullCoords = generateFullCoords(shipRec2);
    const coordsIntersection = ship1FullCoords.filter((coord) =>
      ship2FullCoords.includes(coord)
    );
    if (coordsIntersection.length > 0) {
      return true;
    }
    return false;
  };

  //public methods
  const receiveAttack = ([x, y]) => {
    if (!isInRange(x, 0, 9) || !isInRange(y, 0, 9)) {
      return;
    }
    let shipHit = false;
    ships.forEach((shipRec) => {
      if (checkHitOnShip(shipRec, [x, y])) {
        const hitCoord = getHitCoord(shipRec, [x, y]);
        if (hitCoord >= 0) {
          shipHit = true;
          shipRec.ship.hit(hitCoord);
        }
      }
    });
    if (!shipHit) {
      missedHits.push([x, y]);
    }
  };

  const populateRandom = () => {
    const orientations = ["ver", "hor"];
    for (let i = 0; i < 6; i++) {
      let placed = false;
      let shipLength;
      if (i > 1) {
        shipLength = i;
      } else {
        shipLength = getRandomInt(2, 5);
      }

      const randomShip = Ship(shipLength);
      const randomOrientation = orientations[getRandomInt(0, 1)];
      while (!placed) {
        const randomX = Math.round(Math.random() * 9);
        const randomY = Math.round(Math.random() * 9);
        if (
          isPositionLegal(randomShip, [randomX, randomY], randomOrientation)
        ) {
          ships.push({
            ship: randomShip,
            coords: [randomX, randomY],
            orient: randomOrientation,
          });
          placed = true;
        }
      }
    }
  };
  const placeShip = (ship, coords, orient = "hor") => {
    if (isPositionLegal(ship, coords, orient)) {
      ships.push({ ship, coords, orient });
    }
  };
  const allShipsSunk = () => {
    let allSunk = true;
    ships.forEach((shipRec) => {
      if (!shipRec.ship.isSunk()) {
        allSunk = false;
      }
    });
    return allSunk;
  };

  const getBoardMap = () => {
    let map = [];
    for (let i = 0; i < 10; i++) {
      map[i] = new Array(10).fill("W");
    }
    ships.forEach((shipRec, s_idx) => {
      const [x, y] = shipRec.coords;
      const { ship } = shipRec;
      if (shipRec.orient === "hor") {
        ship.body.forEach((point, b_idx) => {
          map[x][y + b_idx] = point === 1 ? `X${s_idx}` : s_idx;
        });
      }
      if (shipRec.orient === "ver") {
        ship.body.forEach((point, b_idx) => {
          map[x + b_idx][y] = point === 1 ? `X${s_idx}` : s_idx;
        });
      }
    });

    missedHits.forEach((point) => {
      const [x, y] = point;
      map[x][y] = "X";
    });

    return map;
  };

  return {
    size,
    ships,
    missedHits,
    receiveAttack,
    populateRandom,
    placeShip,
    getBoardMap,
    allShipsSunk,
  };
};

export default Gameboard;
