import React, { useEffect, type JSX } from "react";
import styles from "./Modal.module.css";

type ModalProps = {
  onClose: () => void;
  children?: React.ReactNode;
};

export default function Modal({ children, onClose }: ModalProps): JSX.Element {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles.modalBackdrop} onMouseDown={onBackdropClick}>
      <div className={styles.modalPanel}>{children}</div>
    </div>
  );
}
