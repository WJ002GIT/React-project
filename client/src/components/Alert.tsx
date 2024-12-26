//type rafce to get shortcut

import { ReactNode } from "react";

interface Props {
  //   children: string;
  //if want to pass html content
  children: ReactNode;
}

const Alert = ({ children }: Props) => {
  return (
    <>
      <div className="alert alert-primary" role="alert">
        {children}
      </div>
    </>
  );
};

export default Alert;
