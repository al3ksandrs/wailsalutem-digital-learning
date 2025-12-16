import React, { useEffect, useRef } from 'react';
import '../css/modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog ref={dialogRef} className="modal-container">
      <button
        type="button"
        className="modal-close"
        onClick={onClose}
        aria-label="Close modal"
      />

      {title && <h2 className="modal-title">{title}</h2>}

      <div className="modal-content">{children}</div>
    </dialog>
  );
};

export default Modal;
