import React, { useEffect, useState } from "react";

interface FileUploadProps {
  backendUrl: string;
  onFileLocationUpdate: (location: string) => void; 
}

interface FileListResponse {
  files: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  backendUrl,
  onFileLocationUpdate,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [checkfiles, setcheckFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fileLocation, setFileLocation] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const searchFiles = async () => {
    await fetch("/api/files")
      .then((response) => response.json())
      .then((data: FileListResponse) => {
        setcheckFiles(data.files);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch files");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (checkfiles.length > 0) {
      console.log(checkfiles); 
    }
  }, [checkfiles]);

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected!");
      return;
    }
    if (checkfiles.includes(file.name)) {
      const override = window.confirm(
        "A file with the same name already exists. Do you want to overwrite it?"
      );
      if (!override) {
        return; // If the user doesn't want to overwrite, exit the function
      }
    }
    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await fetch(`${backendUrl}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setFileLocation(result.fileUrl);
        alert("File uploaded successfully");
        // Notify the parent component about the file location
        onFileLocationUpdate(result.fileUrl);

        // Clear the file input after upload is complete
        setFile(null); 
        (document.querySelector("input[type=file]") as HTMLInputElement).value =
          "";
      } else {
        alert("Failed to upload file");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    }
  };

  return (
    <div>
      <input
        onClick={searchFiles}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
};

export default FileUpload;
