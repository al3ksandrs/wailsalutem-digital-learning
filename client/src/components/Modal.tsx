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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}></button>
                {title && <h2 className="modal-title">{title}</h2>}
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
