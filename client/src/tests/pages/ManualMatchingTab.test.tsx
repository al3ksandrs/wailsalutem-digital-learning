import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { ManualMatchingTab } from '../../pages/Admin/tabs/ManualMatchingTab';
import { useGetAcceptedMatches, useCreateManualMatch, useDeleteMatch, useGetAllUsers } from '../../services/adminService';

vi.mock('../../services/adminService', () => ({
  useGetAcceptedMatches: vi.fn(),
  useCreateManualMatch: vi.fn(),
  useDeleteMatch: vi.fn(),
  useGetAllUsers: vi.fn(),
}));

const MOCK_MATCHES = [
  { id: 99, student_name: 'Student A', teacher_name: 'Teacher B', subject_name: 'History', created_at: '2023-01-01' }
];

describe('ManualMatchingTab', () => {
  const mockGetMatches = useGetAcceptedMatches as Mock;
  const mockCreate = useCreateManualMatch as Mock;
  const mockDelete = useDeleteMatch as Mock;
  const mockGetUsers = useGetAllUsers as Mock;
  
  const mutateCreate = vi.fn();
  const mutateDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockReturnValue({ mutate: mutateCreate, isPending: false });
    mockDelete.mockReturnValue({ mutate: mutateDelete, isPending: false });
    // Mock getUsers to return empty arrays by default to prevent map errors
    mockGetUsers.mockReturnValue({ data: [] });
  });

  it('renders existing matches', () => {
    mockGetMatches.mockReturnValue({ data: MOCK_MATCHES, isLoading: false });
    render(<ManualMatchingTab />);

    expect(screen.getByText('Student A')).toBeInTheDocument();
    expect(screen.getByText('Teacher B')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
  });

  it('submits the form to create a new match', () => {
    mockGetMatches.mockReturnValue({ data: [], isLoading: false });
    // Mock users for dropdowns
    mockGetUsers.mockImplementation((role) => ({
      data: role === 'Student' 
        ? [{ id: 1, name: 'Student One', email: 's1@test.com' }] 
        : [{ id: 2, name: 'Teacher Two', email: 't2@test.com', status: 'Approved' }]
    }));

    render(<ManualMatchingTab />);

    const studentSelect = screen.getByLabelText(/student/i);
    const teacherSelect = screen.getByLabelText(/teacher/i);

    fireEvent.change(studentSelect, { target: { value: '1' } });
    fireEvent.change(teacherSelect, { target: { value: '2' } });
  });

  it('deletes a match', () => {
    mockGetMatches.mockReturnValue({ data: MOCK_MATCHES, isLoading: false });
    vi.spyOn(globalThis, 'confirm').mockImplementation(() => true);

    render(<ManualMatchingTab />);

    const deleteBtn = screen.getByRole('button', { name: /unmatch/i });
    fireEvent.click(deleteBtn);

    expect(mutateDelete).toHaveBeenCalledWith(99);
  });
});