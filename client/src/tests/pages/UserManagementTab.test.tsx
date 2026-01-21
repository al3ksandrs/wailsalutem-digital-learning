import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { UserManagementTab } from '../../pages/Admin/tabs/UserManagementTab';
import * as adminService from '../../services/adminService';

// Mock the admin service
vi.mock('../../services/adminService', () => ({
  useGetAllUsers: vi.fn(),
  useDeleteUser: vi.fn(),
  useUpdateUser: vi.fn(),
}));

// Mock user data
const MOCK_USERS = [
  { id: 1, name: 'John Student', email: 'john@test.com', role: 'Student', status: 'Active' },
  { id: 2, name: 'Jane Teacher', email: 'jane@test.com', role: 'Teacher', status: 'Pending' },
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

    expect(screen.getByText('John Student')).toBeInTheDocument();
    expect(screen.getByText('Jane Teacher')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
  });

  it('filters users by role (if filter exists) or displays all', () => {
    mockGetUsers.mockReturnValue({ data: MOCK_USERS, isLoading: false });
    render(<UserManagementTab />);

    expect(screen.getByText('john@test.com')).toBeInTheDocument();
  });

  it('calls delete user when delete button is clicked', async () => {
    mockGetUsers.mockReturnValue({ data: MOCK_USERS, isLoading: false });
    
    render(<UserManagementTab />);

    const deleteBtns = screen.getAllByRole('button', { name: /delete user/i });
    fireEvent.click(deleteBtns[0]);

    // The component opens a modal first
    const confirmBtn = screen.getByRole('button', { name: 'Delete' }); // The button inside modal
    fireEvent.click(confirmBtn);

    expect(mutateDelete).toHaveBeenCalledWith(1, expect.any(Object));
  });
});