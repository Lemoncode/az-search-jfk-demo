import * as React from 'react';
import cx from 'classnames';

interface Props {
  pageText: (string | Element); // Review this Element not sure if make sense
  pageNumber: number;
  onClick: (e) => void;
  isActive?: boolean;
  isDisabled?: boolean,

  activeClass?: string, // All this class stuff maybe we can remove it ans use it's css associated styles?
  activeLinkClass?: string,
  itemClass?: string,
  linkClass?: string,
  disabledClass?: string,

  href?: string  
}



export class Page extends React.Component<Props, {}> {

  static defaultProps = { // Confirm defaultProps in ts same approach?
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
      <li className={css} onClick={this.handleClick}>
        <a className={linkCss} href={href}>
          {pageText}
        </a>
      </li>
    );
  }
}
