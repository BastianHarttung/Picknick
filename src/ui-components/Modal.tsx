import classes from "./Modal.module.scss";
import React, {useState} from "react";
import ReactDom from "react-dom";
import {IoMdClose} from "react-icons/io";


interface ModalProps {
  children: JSX.Element;
  closeable?: boolean;
}

const Modal = ({children, closeable = true}: ModalProps) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {isModalOpen && ReactDom.createPortal(
        <div className={classes.modal}>
          <div className={classes.inputContainer}>
            {closeable && <div className={classes.close_btn}>
                <IoMdClose size={24}
                           onClick={() => setIsModalOpen(false)}/>
            </div>}
            {children}
          </div>
        </div>
        , document.getElementById("modal-root") as HTMLElement)}
    </>
  );
};

export default Modal;