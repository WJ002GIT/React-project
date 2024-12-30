//type rafce to get shortcut

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => void;
  //color?: string;//? means it optional
  color?: "primary" | "secondary" | "danger"; 
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
