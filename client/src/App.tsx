import "./App.css";
// import ListGroup from "./components/ListGroup";
// import Alert from "./components/Alert";
// import Button from "./components/Button";
import { useState, useEffect } from "react";
import Upload from "./components/upload";
import Displaydata from "./components/Displaydata";
import PaginatedTable from "./components/PaginaedTable";
import Papa from "papaparse";
import AvailableFiles from "./components/AvailableFiles";

function App() {
  // const [backendData, setBackendData] = useState<User | null>(null);
  // const [data, setData] = useState<User[] | null>(null);
  const [alertVisible, setalertVisible] = useState<boolean>(false);
  const [data, setData] = useState<Array<Record<string, any>> | null>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const { fetchCsvData } = Displaydata();
  const [fileLocation, setFileLocation] = useState<string | null>(null);

  //find back end dynamic port
  const backendPort = import.meta.env.VITE_BACKEND_PORT || "8080";
  const backendUrl = `http://localhost:${backendPort}`;

  const handleFileLocationUpdate = (location: string) => {
    setFileLocation(location);
    console.log("Received file location:", location);
  };

  const handleFileSelection = (fileName: string) => {
    fetchCsvData(`${backendUrl}${fileName}`, setData);
    console.log("dynamic port location", `${backendUrl}${fileLocation}`);
  };

  useEffect(() => {
    if (fileLocation) {
      //fetch csv data from srver address and send it to setData
      // Add fileLocation as a dependency
      fetchCsvData(`${backendUrl}${fileLocation}`, setData);
      console.log("dynamic port location", `${backendUrl}${fileLocation}`);
    }
  }, [fileLocation]); 

  if (data && data.length > 0) {
    console.log("this is my data", data);

    // keys.forEach((key) => {
    //   console.log(`Key: ${key}, Value: ${data[0][key]}`);
    // });
    if (data[0] && data[0].length > 0) {
      const extractedKeys = Object.keys(data[0]);
      console.log("Keys in data[0]:", keys);
      setKeys(extractedKeys);
    }
  }

  // useEffect(() => {
  //   fetch("/api")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setBackendData(data);
  //     });
  // }, []);
  return (
    <div className="main">
      {/* Alert and Paginated Table Section */}
      {/* {alertVisible && data && (
        <section className="Alert">
          <PaginatedTable data={data} />
        </section>
      )} */}
      {/* Button to toggle alert visibility */}
      {/* <section>
        <Button onClick={() => setalertVisible(!alertVisible)} color="danger">
          Toggle Alert
        </Button>
      </section> */}

      
      {data && (
        <section className="table">
          <PaginatedTable
            data={data}
            fileName={fileLocation?.replace("/uploads/", "")}
          />
        </section>
      )}

      {/* File Upload Section */}
      <section>
        <Upload
          backendUrl={backendUrl}
          onFileLocationUpdate={handleFileLocationUpdate}
        />
      </section>

      {/* Backend URL Display */}
      {/* <section>
        <h1>Backend is running at: {backendUrl}</h1>
      </section> */}

      {/* File Location Display */}
      {fileLocation && (
        <section className="file-location">
          <p>The file you have most recently uploaded is:</p>
          <p>{fileLocation.replace("/uploads/", "")}</p>
        </section>
      )}

      {/* Available Files Section */}
      <section>
        <AvailableFiles onHandleFile={handleFileSelection} />
      </section>
    </div>
  );
}

export default App;
