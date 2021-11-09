import React from "react";
import classes from "./Footer.module.css";

import { BsGithub } from "react-icons/bs";
import { GrLinkedin } from "react-icons/gr";
import { IconContext } from "react-icons/lib";
import { CgWebsite } from "react-icons/cg";

const Footer = () => {
  return (
    <div className={classes["footer-container"]}>
      <span className={classes["footer-text"]}>&copy; 2021 Eduard Gavrila</span>
      <IconContext.Provider
        value={{ size: "1.5rem", className: classes["margin-right"] }}
      >
        <a
          href="https://github.com/edy-gavrila"
          target="_blank"
          rel="noreferrer"
          className={classes.links}
        >
          <BsGithub />
        </a>
        <a
          href="https://www.linkedin.com/in/eduard-gavrila-129951136/"
          target="_blank"
          rel="noreferrer"
          className={classes.links}
        >
          <GrLinkedin />
        </a>
        <a
          href="https://edy-gavrila.github.io/Portfolio/"
          target="_blank"
          rel="noreferrer"
          className={classes.links}
        >
          <CgWebsite />
        </a>
      </IconContext.Provider>
    </div>
  );
};

export default Footer;
