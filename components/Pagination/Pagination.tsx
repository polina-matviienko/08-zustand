"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selected: number) => void;
  forcePage: number;
}

const Pagination = ({
  pageCount,
  onPageChange,
  forcePage,
}: PaginationProps) => {
  return (
    <ReactPaginate
      previousLabel={"<"}
      nextLabel={">"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={(data) => onPageChange(data.selected + 1)}
      forcePage={forcePage}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
    />
  );
};

export default Pagination;
