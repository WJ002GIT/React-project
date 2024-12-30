import React, { useState } from "react";

type User = Record<string, any>;

interface PaginatedTableProps {
  data: User[]; //type the data
  fileName: string | undefined;
}

const PaginatedTable: React.FC<PaginatedTableProps> = ({ data, fileName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); 
  const rowsPerPage = 10;

  // Filter out empty rows (rows with no meaningful data)
  const filteredData = data.filter((user) => {
    // Keep rows where at least one field has a value
    return Object.values(user).some((value) => value);
  });

  // Filter data based on search query
  const searchFilteredData = filteredData.filter((user) => {
    return Object.values(user).some((value) =>
      // Match any value in the row with the search query
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    ); 
  });

  // Calculate the index of the first and last row to display
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  // Slice the data array to show only the rows for the current page
  const currentRows = searchFilteredData.slice(indexOfFirstRow, indexOfLastRow);

  // Calculate total number of pages
  const totalPages = Math.ceil(searchFilteredData.length / rowsPerPage);

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

  // See which page numbers to show
  const pageNumbersToShow = () => {
    const pageLinks = [];
    // Max pages to show before ellipsis
    const maxVisiblePages = 2; 

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
    <div className="PaginatedTable">
      {/* Search input */}
      <div className="name">
        <h1>Displaying {fileName}</h1>
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
        />
      </div>

      <div className="table_container overflow-scroll">
        <table className="table table-bordered">
          <thead>
            <tr>
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
                    // empty values display "-"
                    <td key={i}>{value || "-"}</td> 
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

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

          {/* ellipses pages*/}
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
    </div>
  );
};

export default PaginatedTable;
