import * as React from 'react';
import Button from 'material-ui/Button';
import cx from 'classnames';
const styles = require('./page.scss');

interface Props {
  pageText: (string | React.ReactNode); // Review this Element not sure if make sense
  pageNumber: number;
  onClick: (pageNumber : number) => void;
  isActive?: boolean;
  isDisabled?: boolean,
}


const handleClick = ({onClick, pageNumber} : Props) => (e) => {
  e.preventDefault();
  onClick(pageNumber);
}


export const Page : React.StatelessComponent<Props> = (props) => {
  return (
    !props.isDisabled &&
    <Button
      className={styles.page}
      onClick={handleClick(props)}
      color={
        Boolean(props.isActive) ?
          'primary' :
          'inherit'
      }
    >
      {props.pageText}
    </Button>
  );
}

Page.defaultProps =  {
  isActive: false,
  isDisabled: false,
};
