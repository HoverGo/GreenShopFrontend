import React from "react";
import s from "./index.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={s.pagination}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? s.active : ""}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img src="img/pagination/arrow.svg" alt="arrow" />
      </button>
    </div>
  );
};

export default Pagination;
