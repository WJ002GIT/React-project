import React, { useState } from "react";

type User = Record<string, any>;

interface PaginatedTableProps {
  data: User[]; // Explicitly type the `data` prop
}
const PaginatedTable: React.FC<PaginatedTableProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Filter out empty rows (rows with no meaningful data)
  const filteredData = data.filter((user) => {
    return Object.values(user).some((value) => value); // Keep rows where at least one field has a value
  });

  // Calculate the index of the first and last row to display
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Slice the data array to show only the rows for the current page
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Handle page change
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Handle page change
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  // Determine which page numbers to display
  const pageNumbersToShow = () => {
    const pageLinks = [];
    const maxVisiblePages = 2; // Max pages to show before ellipsis

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(
      totalPages,
      currentPage + Math.floor(maxVisiblePages / 2)
    );

    if (endPage - startPage < maxVisiblePages) {
      if (currentPage - startPage < Math.floor(maxVisiblePages / 2)) {
        endPage = Math.min(
          totalPages,
          endPage +
            (Math.floor(maxVisiblePages / 2) - (currentPage - startPage))
        );
      } else if (endPage - currentPage < Math.floor(maxVisiblePages / 2)) {
        startPage = Math.max(
          1,
          startPage -
            (Math.floor(maxVisiblePages / 2) - (endPage - currentPage))
        );
      }
    }

    if (startPage > 1) {
      pageLinks.push(1);
      if (startPage > 2) pageLinks.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pageLinks.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageLinks.push("...");
      pageLinks.push(totalPages);
    }

    return pageLinks;
  };

  return (
    <div>
      <div className="table_container overflow-scroll">
        <table className="table table-bordered">
          <thead>
            <tr>
              {/* Render table headers dynamically */}
              {data &&
                data.length > 0 &&
                Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {currentRows
              ?.filter(
                (user) => Object.values(user).some((value) => value) // Ensure at least one non-empty field in each row
              )
              .map((user, index) => (
                <tr key={index}>
                  {Object.values(user).map((value, i) => (
                    <td key={i}>{value || "-"}</td> // Handle empty values by displaying "-"
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          {/* Previous Page */}
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <a
              className="page-link"
              href="#"
              onClick={goToPreviousPage}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          {/* Page Numbers with Ellipses */}
          {pageNumbersToShow().map((page, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === page ? "active" : ""} ${
                typeof page === "string" ? "disabled" : ""
              }`}
            >
              <a
                className="page-link"
                href="#"
                onClick={
                  typeof page === "number" ? () => goToPage(page) : undefined
                }
              >
                {page}
              </a>
            </li>
          ))}

          {/* Next Page */}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <a
              className="page-link"
              href="#"
              onClick={goToNextPage}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
      {/* <div className="pagination-controls">
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div> */}
    </div>
  );
};

export default PaginatedTable;
