import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { PendingTeachersTab } from '../../pages/Admin/tabs/PendingTeachersTab';
import { useGetPendingTeachers, useUpdateUserStatus } from '../../services/adminService';

vi.mock('../../services/adminService', () => ({
  useGetPendingTeachers: vi.fn(),
  useUpdateUserStatus: vi.fn(),
}));

const MOCK_PENDING = [
  { 
    id: 10, 
    name: 'New Teacher', 
    email: 'new@teach.com', 
    expertise: 'Math', 
    bio: 'I love math',
    location: 'London',
    role: 'Teacher'
  }
];

describe('PendingTeachersTab', () => {
  const mockGetPending = useGetPendingTeachers as Mock;
  const mockUpdateStatus = useUpdateUserStatus as Mock;
  const mutateStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateStatus.mockReturnValue({ mutate: mutateStatus, isPending: false });
  });

  it('renders "No pending teachers" when list is empty', () => {
    mockGetPending.mockReturnValue({ data: [], isLoading: false });
    render(<PendingTeachersTab />);
    expect(screen.getByText(/no pending approvals/i)).toBeInTheDocument();
  });

  it('renders pending teacher cards/rows', () => {
    mockGetPending.mockReturnValue({ data: MOCK_PENDING, isLoading: false });
    render(<PendingTeachersTab />);

    expect(screen.getByText('New Teacher')).toBeInTheDocument();
    expect(screen.getByText('Math')).toBeInTheDocument();
  });

  it('approves a teacher when Approve button is clicked', () => {
    mockGetPending.mockReturnValue({ data: MOCK_PENDING, isLoading: false });
    render(<PendingTeachersTab />);

    const approveBtn = screen.getByRole('button', { name: /approve/i });
    fireEvent.click(approveBtn);

    expect(mutateStatus).toHaveBeenCalledWith({ id: 10, status: 'Approved' });
  });

  it('rejects a teacher when Reject button is clicked', () => {
    mockGetPending.mockReturnValue({ data: MOCK_PENDING, isLoading: false });
    vi.spyOn(globalThis, 'confirm').mockImplementation(() => true);

    render(<PendingTeachersTab />);

    const rejectBtn = screen.getByRole('button', { name: /reject/i });
    fireEvent.click(rejectBtn);

    expect(mutateStatus).toHaveBeenCalledWith(expect.objectContaining({ id: 10, status: 'Blocked' }));
  });
});