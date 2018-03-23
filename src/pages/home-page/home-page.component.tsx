import * as React from "react";
import { Link } from 'react-router-dom';
import { searchPath } from "../search-page";
import Button from 'material-ui/Button';
import Typography from "material-ui/Typography";

const style = require("./home-page.style.scss");


export const HomePageComponent: React.StatelessComponent<{}> = () => {
  return (
    <div className={style.container}>
      <Typography variant="display2" color="inherit" classes={{root: style.header}}>
        JFK Files
      </Typography>
      <br />
      <div className={style.buttonGroup}>
        <Link to={searchPath}>
          <Button variant="raised" color="primary" autoFocus={true}>Search Page</Button>
        </Link>
      </div>
    </div>
  )
}
