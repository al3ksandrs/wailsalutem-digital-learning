import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { UserManagementTab } from '../../pages/Admin/tabs/UserManagementTab';
import * as adminService from '../../services/adminService';
import { UserStatus } from '../../../../common/types';

// Mock the admin service
vi.mock('../../services/adminService', () => ({
  useGetAllUsers: vi.fn(),
  useDeleteUser: vi.fn(),
  useUpdateUser: vi.fn(),
}));

// Mock user data
const MOCK_USERS = [
  { id: 1, name: 'Alice Student', email: 'alice@test.com', role: 'Student', status: 'Active' },
  { id: 2, name: 'Bob Teacher', email: 'bob@test.com', role: 'Teacher', status: 'Pending' },
  { id: 3, name: 'Charlie Admin', email: 'charlie@test.com', role: 'Admin', status: 'Blocked' },
];

describe('UserManagementTab', () => {
  const mockGetUsers = adminService.useGetAllUsers as Mock;
  const mockDeleteUser = adminService.useDeleteUser as Mock;
  const mockUpdateUser = adminService.useUpdateUser as Mock;
  const mutateDelete = vi.fn();
  const mutateUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteUser.mockReturnValue({ mutate: mutateDelete, isPending: false });
    mockUpdateUser.mockReturnValue({ mutate: mutateUpdate, isPending: false });
  });

  it('renders user list successfully', () => {
    mockGetUsers.mockReturnValue({ data: MOCK_USERS, isLoading: false });
    render(<UserManagementTab />);

    expect(screen.getByText('Alice Student')).toBeInTheDocument();
    expect(screen.getByText('Bob Teacher')).toBeInTheDocument();
  });

  it('filters users by search term', () => {
    mockGetUsers.mockReturnValue({ data: MOCK_USERS, isLoading: false });
    render(<UserManagementTab />);

    const searchInput = screen.getByPlaceholderText(/search users/i);
    fireEvent.change(searchInput, { target: { value: 'Bob' } });

    expect(screen.queryByText('Alice Student')).not.toBeInTheDocument();
    expect(screen.getByText('Bob Teacher')).toBeInTheDocument();
  });

  it('sorts users by name', () => {
    mockGetUsers.mockReturnValue({ data: MOCK_USERS, isLoading: false });
    render(<UserManagementTab />);

    const nameHeader = screen.getByText(/name/i);
    
    // First click -> ASC
    fireEvent.click(nameHeader);
    
    const rows = screen.getAllByRole('row');
    // rows[0] is header, rows[1] is first user
    expect(rows[1]).toHaveTextContent('Alice Student');

    // Second click -> DESC
    fireEvent.click(nameHeader);
    const rowsDesc = screen.getAllByRole('row');
    expect(rowsDesc[1]).toHaveTextContent('Charlie Admin');
  });

  it('opens edit modal and submits changes', () => {
    mockGetUsers.mockReturnValue({ data: MOCK_USERS, isLoading: false });
    render(<UserManagementTab />);

    const editBtns = screen.getAllByTitle('Edit User');
    fireEvent.click(editBtns[0]); // Edit Alice

    // Modal should appear
    expect(screen.getByText('Edit User')).toBeInTheDocument();
    
    const nameInput = screen.getByLabelText('Name');
    const statusSelect = screen.getByLabelText('Status');
    const saveBtn = screen.getByRole('button', { name: /save changes/i });

    fireEvent.change(nameInput, { target: { value: 'Alice Updated' } });
    fireEvent.change(statusSelect, { target: { value: UserStatus.Blocked } });

    fireEvent.click(saveBtn);

    expect(mutateUpdate).toHaveBeenCalledWith({
      id: 1,
      data: expect.objectContaining({
        name: 'Alice Updated',
        status: 'Blocked'
      })
    }, expect.anything());
  });

  it('calls delete user', () => {
    mockGetUsers.mockReturnValue({ data: MOCK_USERS, isLoading: false });
    render(<UserManagementTab />);

    const deleteBtns = screen.getAllByTitle('Delete User');
    fireEvent.click(deleteBtns[0]); // Delete Alice

    const confirmBtn = screen.getByRole('button', { name: 'Delete' }); // Modal button
    fireEvent.click(confirmBtn);

    expect(mutateDelete).toHaveBeenCalledWith(1, expect.anything());
  });
});