import React, { useRef, useState } from "react";
import classes from "./MainMenu.module.css";
import titleImg from "../../assets/img/title.png";
const MainMenu = ({ onInitGame }) => {
  const [centerScreen, setCenterScreen] = useState(true);
  const [fadeInputs, setFadeInputs] = useState(true);
  const [showInputs, setShowInputs] = useState(true);
  const inputRef = useRef();

  let containerStyles = `${classes["menu-container"]}`;
  centerScreen ||
    (containerStyles = `${classes["menu-container"]} ${classes["slide-to-top"]}`);
  let controlsStyles = classes["inputs-container"];
  fadeInputs ||
    (controlsStyles = `${classes["inputs-container"]} ${classes["fade-out"]}`);

  const clickStartHandler = () => {
    const humanPlayerName = inputRef.current.value.trim() || "Soldier #42";
    setCenterScreen(false);
    setFadeInputs(false);
    setTimeout(() => {
      setShowInputs(false);
      onInitGame(humanPlayerName);
    }, 500);
  };

  return (
    <div className={containerStyles}>
      <img
        src={titleImg}
        alt="Game Title"
        className={classes["game-title"]}
      ></img>
      {showInputs && (
        <div className={controlsStyles}>
          <label className={classes.label} htmlFor={"playerName"}>
            ENTER PLAYER NAME:
          </label>
          <input
            className={classes["name-input"]}
            type="text"
            id="playerName"
            placeholder="Soldier #42"
            autoFocus
            spellCheck="false"
            ref={inputRef}
          />
          <button
            className={classes["start-button"]}
            onClick={clickStartHandler}
          >
            START GAME
          </button>
        </div>
      )}
      {centerScreen && (
        <p className={classes.text}>
          For best experience, play on a computer or tablet
        </p>
      )}
    </div>
  );
};

export default MainMenu;
