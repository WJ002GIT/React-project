// src/components/AvailableFiles.tsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

interface FileListResponse {
  files: string[];
}

interface AvailableFilesProps {
  onHandleFile: (fileName: string) => void; // Add this prop to handle file name
}

function AvailableFiles({ onHandleFile }: AvailableFilesProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the available files from the backend
    fetch("/api/files")
      .then((response) => response.json())
      .then((data: FileListResponse) => {
        setFiles(data.files);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch files");
        setLoading(false);
      });
  });

  const handleFile = async (fileName: string) => {
    onHandleFile(`/uploads/${fileName}`);
  };

  const handleDelete = async (fileName: string) => {
    try {
      const response = await fetch(`/api/uploads/${fileName}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFiles(files.filter((file) => file !== fileName)); // Remove the deleted file from the list

        alert(`${fileName} is successfully deleted!`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to delete file");
      }
    } catch (error) {
      alert(`Failed to delete ${fileName}`);
      setError("Failed to delete file");
    }
  };
  return (
    <div>
      <p>The available files are:</p>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="dropdown">
        {/* Dropdown button */}
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Select a file
        </button>

        {/* Dropdown menu */}
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {files.length === 0 && !loading && (
            <li>
              <p className="dropdown-item">No files available</p>
            </li>
          )}
          {files.map((file, index) => (
            <li
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              <button
                onClick={() => handleFile(file)}
                className="btn btn-link text-decoration-none"
              >
                {file}
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(file)} // Ensure you handle delete action properly
              >
                <i className="bi bi-trash"></i>
                {"Delete"}
                {/* Using Bootstrap icon for trash */}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AvailableFiles;
