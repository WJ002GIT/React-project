import React, { useState } from "react";

interface FileUploadProps {
  backendUrl: string;
  onFileLocationUpdate: (location: string) => void; // Define prop type for callback
}

const FileUpload: React.FC<FileUploadProps> = ({ backendUrl, onFileLocationUpdate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileLocation, setFileLocation] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected!");
      return;
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
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
};

export default FileUpload;
