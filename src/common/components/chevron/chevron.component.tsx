import * as React from "react"
import IconButton from "material-ui/IconButton";
import ChevronIcon from "material-ui-icons/ExpandMore";
import { cnc } from "../../../util";

const style = require("./chevron.style.scss");


interface ChevronProps {
  expanded: boolean;
  onClick: () => void;
  className?: string;
}

const Chevron: React.StatelessComponent<ChevronProps> = (props) => {
  return (
    <IconButton
      classes={{
        root: cnc(props.className, style.chevron, props.expanded && style.chevronUp)
      }}
      onClick={props.onClick}
      aria-expanded={props.expanded}
      aria-label="Show more"      
    >
      <ChevronIcon/>
    </IconButton>
  )
}

export { Chevron };