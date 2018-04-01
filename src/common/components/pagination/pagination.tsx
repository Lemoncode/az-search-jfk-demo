import * as React from 'react';
import paginator from 'paginator';
import { Page } from './page';
import cx from 'classnames';

// based on: https://github.com/vayser/react-js-pagination
const styles = require('./pagination.scss');

interface Props {
  totalItemsCount: number;
  onChange: (pageNumber: number) => void;
  activePage?: number;
  itemsCountPerPage?: number;
  pageRangeDisplayed?: number;
  prevPageText?: (string | React.ReactNode);  // Not sure if element makes sense here
  nextPageText?: (string | React.ReactNode);
  lastPageText?: (string | React.ReactNode);
  firstPageText?: (string | React.ReactNode);  
  hideDisabled?: boolean;
  hideNavigation?: boolean,
    
  hideFirstLastPages?: boolean;  
}

export class Pagination extends React.Component<Props, {}> {
  static defaultProps = {
    itemsCountPerPage: 10,
    pageRangeDisplayed: 5,
    activePage: 1,
    prevPageText: "⟨",
    firstPageText: "«",
    nextPageText: "⟩",
    lastPageText: "»",
    hideFirstLastPages: false,
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
      hideFirstLastPages,
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
          pageNumber={i}
          pageText={i + ""}
          onClick={onChange}                                        
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
