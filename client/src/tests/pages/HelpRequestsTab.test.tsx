import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { HelpRequestsTab } from '../../pages/Admin/tabs/HelpRequestsTab';
import { useGetOpenHelpRequests, useAssignTeacher, useGetAllUsers } from '../../services/adminService';

vi.mock('../../services/adminService', () => ({
  useGetOpenHelpRequests: vi.fn(),
  useAssignTeacher: vi.fn(),
  useGetAllUsers: vi.fn(),
}));

const MOCK_REQUESTS = [
  { id: 101, student_name: 'Alice', subject_name: 'Physics', description: 'Need help with gravity', status: 'Pending' }
];

const MOCK_TEACHERS = [
  { id: 50, name: 'Dr. Physics', role: 'Teacher' }
];

describe('HelpRequestsTab', () => {
  const mockGetRequests = useGetOpenHelpRequests as Mock;
  const mockAssign = useAssignTeacher as Mock;
  const mockGetUsers = useGetAllUsers as Mock;
  const mutateAssign = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAssign.mockReturnValue({ mutate: mutateAssign });
    mockGetUsers.mockReturnValue({ data: MOCK_TEACHERS }); 
  });

  it('renders requests list', () => {
    mockGetRequests.mockReturnValue({ data: MOCK_REQUESTS, isLoading: false });
    render(<HelpRequestsTab />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Need help with gravity')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    mockGetRequests.mockReturnValue({ data: [], isLoading: false });
    render(<HelpRequestsTab />);
    expect(screen.getByText(/no open help requests/i)).toBeInTheDocument();
  });

  it('triggers assignment flow', () => {
    mockGetRequests.mockReturnValue({ data: MOCK_REQUESTS, isLoading: false });
    render(<HelpRequestsTab />);

    const assignBtns = screen.getAllByRole('button', { name: /assign/i });
    expect(assignBtns.length).toBeGreaterThan(0);
    
    // Simulate clicking assign
    fireEvent.click(assignBtns[0]);
  });
});