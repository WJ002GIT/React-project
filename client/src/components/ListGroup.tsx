import { MouseEvent, useState } from "react";

interface Props {
  items: string[];
  heading: string;
  //type of the property is a function that have a string perimeter
  onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading, onSelectItem }: Props) {
  //let items = ["item1", "item2", "item3", "item4", "item5", "item6", "item7"];
  //this is a state hook, canupdate over time
  //<number | null> means this can either be a number or a null (-1) initilises value
  const [selectedIndex, setSelectedIndex] = useState<number | null>(-1); // Use state to track the selected item
  // const message = items.length === 0 ? <p>No item in item list</p> : null;
  //use a function like bellow instead so that we can pass values when we call this function
  const getMessage = () => {
    //return items.length === 0 ? <p>No item in item list</p> : null;
    return items.length === 0 && <p>No item in item list</p>;
  };
  const handle = (item: string, index: number) => {
    //cannot just put e ad it does not know what e means, we specify it is a mouseevent

    setSelectedIndex(index);
    // console.log(selectedIndex);
    return (e: MouseEvent) => console.log("clicked", item, index, e);
  };
  //or we can use a event handler like below
  //const handle = (e: MouseEvent) => console.log("clicked", item, index, e);
  //remb to not use the () brackets when calling as we pass a constant instead of function

  return (
    <>
      <h1>{heading}</h1>
      {getMessage()}
      <ul className="list-group">
        {items.map((item, index) => (
          <li
            className={`list-group-item ${selectedIndex === index && "active"}`}
            key={item}
            //doing ()=> ensures that the function only executes when onlick occurs
            onClick={() => {
              handle(item, index);
              onSelectItem(item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
