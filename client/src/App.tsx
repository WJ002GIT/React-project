import "./App.css";
// import ListGroup from "./components/ListGroup";
import { useState, useEffect } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import Upload from "./components/upload";
import Displaydata from "./components/Displaydata";
import Papa from "papaparse";

function App() {
  interface User {
    "First Name": string;
    "Last Name": string;
  }

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
  const [data, setData] = useState<User[] | null>(null);
  const { fetchCsvData } = Displaydata();
  const [fileLocation, setFileLocation] = useState<string | null>(null);

  const handleFileLocationUpdate = (location: string) => {
    setFileLocation(location);
    console.log("Received file location:", location);
  };
  useEffect(() => {
    if (fileLocation) {
      fetchCsvData(`http://localhost:5000${fileLocation}`, setData);
    }
  }, [fileLocation]); // Add fileLocation as a dependency

  console.log("this is my data", data);
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
          <ol>
            {/* Filter out rows where 'First Name' is empty or the row is completely empty */}
            {data
              .filter(
                (user) =>
                  user["First Name"] && // Check that "First Name" exists
                  Object.values(user).some((value) => value) // Ensure there's at least one non-empty field
              )
              .map((user, index) => (
                <li key={index}>{user["First Name"]}</li>
              ))}
          </ol>
        </Alert>
      )}
      <Button onClick={() => setalertVisible(!alertVisible)} color="danger">
        Button Component
      </Button>

      <Upload onFileLocationUpdate={handleFileLocationUpdate}></Upload>

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
