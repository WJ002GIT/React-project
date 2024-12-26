import Papa from "papaparse";

type Callback = (data: any) => void;

const Displaydata = () => {
  const fetchCsvData = async (filePath: string, callback: Callback) => {
    console.log("this is path", filePath);
    const response = await fetch(filePath);
    // console.log(response.headers.get("Content-Type"));
    if (!response.ok) {
      console.error("Failed to fetch CSV file", response.statusText);
      return;
    }
    const reader = response.body!.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder("utf-8");
    const csvString = decoder.decode(result.value!);
    const { data } = Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
    });
    callback(data);
  };

  return { fetchCsvData };
};

export default Displaydata;
