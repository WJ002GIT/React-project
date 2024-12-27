import "./App.css";
// import ListGroup from "./components/ListGroup";
import { useState, useEffect } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import Upload from "./components/upload";
import Displaydata from "./components/Displaydata";
import PaginatedTable from "./components/PaginaedTable";
import Papa from "papaparse";

function App() {
  // interface User {
  //   "First Name": string;
  //   "Last Name": string;
  // }

  // let items = [
  //   "NewYork",
  //   "Singapore",
  //   "Beijing",
  //   "Munich",
  //   "Jakarta",
  //   "Bali",
  //   "London",
  // ];

  // const handleSelectItem = (item: string) => {
  //   console.log(item);
  // };
  const [alertVisible, setalertVisible] = useState<boolean>(false);
  // const [backendData, setBackendData] = useState<User | null>(null);
  // const [data, setData] = useState<User[] | null>(null);
  const [data, setData] = useState<Array<Record<string, any>> | null>(null);
  const [keys, setKeys] = useState<string[]>([]);
  const { fetchCsvData } = Displaydata();
  const [fileLocation, setFileLocation] = useState<string | null>(null);

  //find back end dynamic port
  const backendPort = import.meta.env.VITE_BACKEND_PORT || '5000';
  const backendUrl = `http://localhost:${backendPort}`;


  const handleFileLocationUpdate = (location: string) => {
    setFileLocation(location);
    console.log("Received file location:", location);
  };

  useEffect(() => {
    if (fileLocation) {
      fetchCsvData(`${backendUrl}${fileLocation}`, setData);
      console.log('dynamic port location',`${backendUrl}${fileLocation}`)
    }
  }, [fileLocation]); // Add fileLocation as a dependency
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
    <div>
      {alertVisible && data && (
        <Alert>
          <PaginatedTable data={data} />
        </Alert>
      )}
      <Button onClick={() => setalertVisible(!alertVisible)} color="danger">
        Button Component
      </Button>

      <Upload backendUrl={backendUrl} onFileLocationUpdate={handleFileLocationUpdate}></Upload>

      <div>
         <h1>Backend is running at: {backendUrl}</h1>
      </div>
      {fileLocation && (
        <div>
          <p>The file is available at:</p>
          <p>{fileLocation}</p> {/* Display the file location */}
        </div>
      )}
      {/* <Displaydata></Displaydata> */}
      {/* pass the values down into the component */}
      {/* <ListGroup
        items={items}
        heading="Cities"
        onSelectItem={handleSelectItem}
      ></ListGroup> */}
    </div>
  );
}

export default App;
