//type rafce to get shortcut

import { ReactNode } from "react";

interface Props {
  //   children: string;
  //if want to pass html content
  children: ReactNode;
  onClick: () => void;
  //color?: string;//? means it optional
  color?: "primary" | "secondary" | "danger"; //can only set to one of these color
}

const Button = ({ children, onClick, color = "primary" }: Props) => {
  return (
    <>
      <button type="button" className={"btn btn-" + color} onClick={onClick}>
        {children}
      </button>
    </>
  );
};

export default Button;
