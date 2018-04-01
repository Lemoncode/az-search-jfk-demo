import * as React from 'react';
import paginator from 'paginator';
import { Page } from './page';
import cx from 'classnames';

const styles = require('./pagination.scss');

interface Props {
  totalItemsCount: number;
  onChange: (e) => void;
  activePage?: number;
  itemsCountPerPage?: number;
  pageRangeDisplayed?: number;
  prevPageText?: (string | React.ReactNode);  // Not sure if element makes sense here
  nextPageText?: (string | React.ReactNode);
  lastPageText?: (string | React.ReactNode);
  firstPageText?: (string | React.ReactNode);
  disabledClass?: string,
  hideDisabled?: boolean;
  hideNavigation?: boolean,
  
  innerClass?: string;
  itemClass?: string;
  linkClass?: string;
  activeClass?: string;
  activeLinkClass?: string;
  linkClassFirst?: string;
  linkClassPrev?: string;
  linkClassNext?: string;
  linkClassLast?: string;
  
  hideFirstLastPages?: boolean;
  getPageUrl?: (i) => string;  
}

export class Pagination extends React.Component<any, {}> {
  static defaultProps = {
    itemsCountPerPage: 10,
    pageRangeDisplayed: 5,
    activePage: 1,
    prevPageText: "⟨",
    firstPageText: "«",
    nextPageText: "⟩",
    lastPageText: "»",
    innerClass: "pagination",
    itemClass: undefined,
    linkClass: undefined,
    activeLinkClass: undefined,
    hideFirstLastPages: false,
    getPageUrl: (i) => "#"
  };

  isFirstPageVisible(has_previous_page) {
    const { hideDisabled, hideNavigation, hideFirstLastPages } = this.props;
    return !hideNavigation && !hideFirstLastPages && !(hideDisabled && !has_previous_page);
  }

  isPrevPageVisible(has_previous_page) {
    const { hideDisabled, hideNavigation } = this.props;
    return !hideNavigation && !(hideDisabled && !has_previous_page);
  }

  isNextPageVisible(has_next_page) {
    const { hideDisabled, hideNavigation } = this.props;
    return !hideNavigation && !(hideDisabled && !has_next_page);
  }

  isLastPageVisible(has_next_page) {
    const { hideDisabled, hideNavigation, hideFirstLastPages } = this.props;
    return !hideNavigation && !hideFirstLastPages && !(hideDisabled && !has_next_page);
  }

  buildPages() {
    const pages = [];
    const {
      itemsCountPerPage,
      pageRangeDisplayed,
      activePage,
      prevPageText,
      nextPageText,
      firstPageText,
      lastPageText,
      totalItemsCount,
      onChange,
      activeClass,
      itemClass,
      activeLinkClass,
      disabledClass,
      hideDisabled,
      hideNavigation,
      linkClass,
      linkClassFirst,
      linkClassPrev,
      linkClassNext,
      linkClassLast,
      hideFirstLastPages,
      getPageUrl
    } = this.props;

    const paginationInfo : any = new paginator(
      itemsCountPerPage,
      pageRangeDisplayed
    ).build(totalItemsCount, activePage);

    for (
      let i = paginationInfo.first_page;
      i <= paginationInfo.last_page;
      i++
    ) {
      pages.push(
        <Page
          isActive={i === activePage}
          key={i}
          href={getPageUrl(i)}
          pageNumber={i}
          pageText={i + ""}
          onClick={onChange}
          itemClass={itemClass}
          linkClass={linkClass}
          activeClass={activeClass}
          activeLinkClass={activeLinkClass}
        />
      );
    }

    this.isPrevPageVisible(paginationInfo.has_previous_page) &&
      pages.unshift(
        <Page
          key={"prev" + paginationInfo.previous_page}
          pageNumber={paginationInfo.previous_page}
          onClick={onChange}
          pageText={prevPageText}
          isDisabled={!paginationInfo.has_previous_page}
          itemClass={itemClass}
          linkClass={cx(linkClass, linkClassPrev)}
          disabledClass={disabledClass}
        />
      );

    this.isFirstPageVisible(paginationInfo.has_previous_page) &&
      pages.unshift(
        <Page
          key={"first"}
          pageNumber={1}
          onClick={onChange}
          pageText={firstPageText}
          isDisabled={!paginationInfo.has_previous_page}
          itemClass={itemClass}
          linkClass={cx(linkClass, linkClassFirst)}
          disabledClass={disabledClass}
        />
      );

    this.isNextPageVisible(paginationInfo.has_next_page) &&
      pages.push(
        <Page
          key={"next" + paginationInfo.next_page}
          pageNumber={paginationInfo.next_page}
          onClick={onChange}
          pageText={nextPageText}
          isDisabled={!paginationInfo.has_next_page}
          itemClass={itemClass}
          linkClass={cx(linkClass, linkClassNext)}
          disabledClass={disabledClass}
        />
      );

    this.isLastPageVisible(paginationInfo.has_next_page) &&
      pages.push(
        <Page
          key={"last"}
          pageNumber={paginationInfo.total_pages}
          onClick={onChange}
          pageText={lastPageText}
          isDisabled={
            paginationInfo.current_page === paginationInfo.total_pages
          }
          itemClass={itemClass}
          linkClass={cx(linkClass, linkClassLast)}
          disabledClass={disabledClass}
        />
      );

    return pages;
  }

  render() {
    const pages = this.buildPages();
    return (
      <div className={styles.pagination}>
        {pages}
      </div>
    );
  }
}
