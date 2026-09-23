import ReactPaginatePkg from 'react-paginate';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReactPaginate = ReactPaginatePkg.default || ReactPaginatePkg;

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const handlePageClick = (event) => {
    // react-paginate returns the 0-indexed page in event.selected
    onPageChange(event.selected + 1);
  };

  return (
    <div className="flex justify-center mt-6">
      <ReactPaginate
        breakLabel={<span className="px-3 py-1 text-gray-500">...</span>}
        nextLabel={
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <ChevronRight className="w-4 h-4" />
          </span>
        }
        previousLabel={
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <ChevronLeft className="w-4 h-4" />
          </span>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={1}
        pageCount={totalPages}
        forcePage={currentPage - 1} // react-paginate is 0-indexed
        renderOnZeroPageCount={null}
        containerClassName="flex items-center gap-2"
        pageClassName="flex items-center justify-center"
        pageLinkClassName="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
        activeClassName=""
        activeLinkClassName="!bg-primary !border-primary text-white hover:!bg-orange-600 shadow-md"
        disabledClassName="opacity-50 cursor-not-allowed"
        disabledLinkClassName="hover:bg-white cursor-not-allowed"
      />
    </div>
  );
};

export default Pagination;
