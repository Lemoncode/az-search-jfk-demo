import * as React from "react";

const logoSvg = require("../../../../assets/svg/logoJFK.svg");
const style = require("./logo.style.scss");


export const LogoComponent = (props) => (
  <div className={style.container}>
    <object className={style.logo}
      type="image/svg+xml"
      data={logoSvg}
    />
  </div>
);
