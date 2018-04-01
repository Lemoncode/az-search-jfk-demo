import * as React from 'react';
import Button from 'material-ui/Button';
import cx from 'classnames';
const styles = require('./page.scss');

export class Page extends React.Component<any, any> {
  // static propTypes = {
  //     pageText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  //     pageNumber: PropTypes.number.isRequired,
  //     onClick: PropTypes.func.isRequired,
  //     isActive: PropTypes.bool.isRequired,
  //     isDisabled: PropTypes.bool,
  //     activeClass: PropTypes.string,
  //     activeLinkClass: PropTypes.string,
  //     itemClass: PropTypes.string,
  //     linkClass: PropTypes.string,
  //     disabledClass: PropTypes.string,
  //     href: PropTypes.string
  // };

  static defaultProps = {
    activeClass: "active",
    disabledClass: "disabled",
    itemClass: undefined,
    linkClass: undefined,
    activeLinkCLass: undefined,
    isActive: false,
    isDisabled: false,
    href: "#"
  };

  handleClick = (e) => {
    const { isDisabled, pageNumber } = this.props;
    e.preventDefault();
    if (isDisabled) {
      return;
    }
    this.props.onClick(pageNumber);
  }

  render() {
    let {
      pageText,
      pageNumber,
      activeClass,
      itemClass,
      linkClass,
      activeLinkClass,
      disabledClass,
      isActive,
      isDisabled,
      href
    } = this.props;

    const css = cx(itemClass, {
      [activeClass]: isActive,
      [disabledClass]: isDisabled
    });

    const linkCss = cx(linkClass, {
      [activeLinkClass]: isActive
    });

    return (
      !this.props.isDisabled &&
      <Button
        className={styles.page}
        onClick={this.handleClick}
        color={
          Boolean(this.props.isActive) ?
            'primary' :
            'inherit'
        }
      >
        {pageText}
      </Button>
    );
  }
}
