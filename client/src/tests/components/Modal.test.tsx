import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../../components/Modal';

describe('Modal', () => {
    test('does not render when isOpen is false', () => {
        render(
            <Modal isOpen={false} onClose={() => {}}>
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    test('renders content when isOpen is true', () => {
        render(
            <Modal isOpen={true} onClose={() => {}} title="Test Title">
                <div>Modal Content</div>
            </Modal>
        );
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    test('calls onClose when overlay or close button is clicked', () => {
        const handleClose = vi.fn();
        render(
            <Modal isOpen={true} onClose={handleClose}>
                <div>Content</div>
            </Modal>
        );

        const overlay = document.querySelector('.modal-overlay');
        fireEvent.click(overlay!);
        expect(handleClose).toHaveBeenCalledTimes(1);

        const closeBtn = document.querySelector('.modal-close');
        fireEvent.click(closeBtn!);
        expect(handleClose).toHaveBeenCalledTimes(2);
    });
});