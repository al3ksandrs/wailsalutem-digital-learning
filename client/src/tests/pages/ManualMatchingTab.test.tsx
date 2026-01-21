import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
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

const MOCK_SUBJECTS = [
  { id: 101, name: 'Math' },
  { id: 102, name: 'Science' }
];

describe('ManualMatchingTab', () => {
  const mockGetMatches = useGetAcceptedMatches as Mock;
  const mockCreate = useCreateManualMatch as Mock;
  const mockDelete = useDeleteMatch as Mock;
  const mockGetUsers = useGetAllUsers as Mock;
  
  const mutateCreate = vi.fn();
  const mutateDelete = vi.fn();
  
  // Store original fetch to restore later
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockReturnValue({ mutate: mutateCreate, isPending: false });
    mockDelete.mockReturnValue({ mutate: mutateDelete, isPending: false });
    
    // Default mocks for service hooks
    mockGetUsers.mockReturnValue({ data: [] });
    mockGetMatches.mockReturnValue({ data: MOCK_MATCHES, isLoading: false });
    
    // Explicitly mock global.fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_SUBJECTS,
    });
  });

  afterEach(() => {
    // Restore original fetch
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('fetches and displays subjects in dropdown', async () => {
    render(<ManualMatchingTab />);
    
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/api/subjects');
    });
    
    // Use findByText which has built-in waitFor
    expect(await screen.findByText('Math')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });

  it('shows validation error when fields are empty', async () => {
    render(<ManualMatchingTab />);

    // Wait for subjects to load first to ensure stable render state
    await screen.findByText('Math');

    const submitBtn = screen.getByRole('button', { name: /assign teacher/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/please select a student, a teacher, and a subject/i)).toBeInTheDocument();
    expect(mutateCreate).not.toHaveBeenCalled();
  });

  it('submits valid form data', async () => {
    // Mock dropdown data
    mockGetUsers.mockImplementation((role) => ({
      data: role === 'Student' 
        ? [{ id: 1, name: 'S1', email: 's@t.com' }] 
        : [{ id: 2, name: 'T1', email: 't@t.com', status: 'Approved' }]
    }));

    render(<ManualMatchingTab />);
    
    // Wait for subjects
    await screen.findByText('Math');

    const studentSelect = screen.getByLabelText(/student/i);
    const teacherSelect = screen.getByLabelText(/teacher/i);
    const subjectSelect = screen.getByLabelText(/subject/i);

    fireEvent.change(studentSelect, { target: { value: '1' } });
    fireEvent.change(teacherSelect, { target: { value: '2' } });
    fireEvent.change(subjectSelect, { target: { value: '101' } });

    const submitBtn = screen.getByRole('button', { name: /assign teacher/i });
    fireEvent.click(submitBtn);

    expect(mutateCreate).toHaveBeenCalledWith({
      studentId: 1,
      teacherId: 2,
      subjectId: 101
    }, expect.anything());
  });

  it('displays API error message on failure', async () => {
    // Simulate error response via mutation's onError callback
    mockCreate.mockReturnValue({
      mutate: (_variables: any, options: any) => {
        options.onError(new Error('This match already exists'));
      },
      isPending: false
    });

    // Provide valid mock data for dropdowns so they populate correctly
    mockGetUsers.mockImplementation((role) => ({
      data: role === 'Student' 
        ? [{ id: 1, name: 'StudentUser', role: 'Student' }] 
        : [{ id: 2, name: 'TeacherUser', role: 'Teacher', status: 'Approved' }]
    }));
    
    render(<ManualMatchingTab />);
    
    // Wait for subjects to appear
    await screen.findByText('Math');

    // Fill form to pass validation
    const studentSelect = screen.getByLabelText(/student/i);
    const teacherSelect = screen.getByLabelText(/teacher/i);
    const subjectSelect = screen.getByLabelText(/subject/i);
    
    fireEvent.change(studentSelect, { target: { value: '1' } });
    fireEvent.change(teacherSelect, { target: { value: '2' } });
    fireEvent.change(subjectSelect, { target: { value: '101' } });

    const submitBtn = screen.getByRole('button', { name: /assign/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/this match already exists/i)).toBeInTheDocument();
  });

  it('deletes a match', () => {
    vi.spyOn(globalThis, 'confirm').mockImplementation(() => true);

    render(<ManualMatchingTab />);

    const deleteBtn = screen.getByRole('button', { name: /unmatch/i });
    fireEvent.click(deleteBtn);

    expect(mutateDelete).toHaveBeenCalledWith(99);
  });
});