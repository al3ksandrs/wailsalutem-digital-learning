import React from 'react';
import '../css/modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <dialog className="modal-overlay" open>
      <div className="modal-container">

        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        />

        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-content">{children}</div>
      </div>
    </dialog>
  );
};

export default Modal;
