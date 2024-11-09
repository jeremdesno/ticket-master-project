import React from 'react';

import styles from '../styles/components/Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleNextPage = (): void => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handlePageChange = (page: number): void => {
    onPageChange(page);
  };

  const renderPageNumbers = (): React.JSX.Element[] => {
    const pages = [];
    const pageRange = 2;

    if (currentPage > pageRange + 1) {
      pages.push(
        <button key={1} onClick={(): void => handlePageChange(1)}>
          1
        </button>,
      );
      if (currentPage > pageRange + 2) {
        pages.push(<span key="left-ellipsis">...</span>);
      }
    }

    for (
      let i = Math.max(1, currentPage - pageRange);
      i <= Math.min(totalPages, currentPage + pageRange);
      i++
    ) {
      pages.push(
        <button
          key={i}
          className={i === currentPage ? styles.activePage : ''}
          onClick={(): void => handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }

    if (currentPage < totalPages - pageRange) {
      if (currentPage < totalPages - pageRange - 1) {
        pages.push(<span key="right-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={(): void => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>,
      );
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
      </button>
      {renderPageNumbers()}
      <button onClick={handleNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
      <p>
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
};

export default Pagination;
