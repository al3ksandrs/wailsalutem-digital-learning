import React, { useState, useMemo } from 'react';
import { 
  useGetAllUsers, 
  useUpdateUser, 
  useDeleteUser 
} from '../../../services/adminService';
import { type UserProfile, UserStatus } from '../../../../../common/types';
import WSButton from '../../../components/WSButton';
import Modal from '../../../components/Modal';

export const UserManagementTab: React.FC = () => {
  const { data: allUsers } = useGetAllUsers();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSortConfig, setUserSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    status: '' as UserStatus
  });

  // Handlers
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (userSortConfig?.key === key && userSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setUserSortConfig({ key, direction });
  };

  const handleEditClick = (user: UserProfile) => {
    setUserToEdit(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: UserProfile) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }
      });
    }
  };

  const submitEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (userToEdit) {
      updateUserMutation.mutate({
        id: userToEdit.id,
        data: { ...editFormData }
      }, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setUserToEdit(null);
        }
      });
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    if (!allUsers) return [];
    let result = [...allUsers];

    if (userSearchTerm) {
      const lowerTerm = userSearchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm) ||
        (user as any).role?.toLowerCase().includes(lowerTerm) ||
        user.status.toLowerCase().includes(lowerTerm)
      );
    }

    if (userSortConfig) {
      result.sort((a, b) => {
        let aValue: any = a[userSortConfig.key as keyof UserProfile];
        let bValue: any = b[userSortConfig.key as keyof UserProfile];
        if (userSortConfig.key === 'role') {
            aValue = (a as any).role;
            bValue = (b as any).role;
        }
        if (aValue < bValue) return userSortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return userSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [allUsers, userSearchTerm, userSortConfig]);

  return (
    <div className="section-container">
      <h2>User management</h2>
      <div className="search-box-container">
        <input 
          type="text" 
          placeholder="Search users..." 
          value={userSearchTerm}
          onChange={(e) => setUserSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} className="admin-sort-header">
              Name {userSortConfig?.key === 'name' && (userSortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('email')} className="admin-sort-header">
              Email {userSortConfig?.key === 'email' && (userSortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('role')} className="admin-sort-header">
              Role {userSortConfig?.key === 'role' && (userSortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('status')} className="admin-sort-header">
              Status {userSortConfig?.key === 'status' && (userSortConfig.direction === 'asc' ? '↑' : '↓')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedUsers.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge role-${(user as any).role?.toLowerCase() || 'student'}`}>
                  {(user as any).role || 'Unknown'}
                </span>
              </td>
              <td>
                <span className={`status-badge status-${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </td>
              <td className="actions-cell">
                <WSButton 
                  icon={<span className="codicon codicon-edit"></span>}
                  title="Edit User"
                  size="small"
                  className="action-btn edit-btn"
                  onClick={() => handleEditClick(user)}
                />
                <WSButton 
                  icon={<span className="codicon codicon-trash"></span>}
                  title="Delete User"
                  size="small"
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteClick(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm User Deletion"
      >
        <div className="admin-modal-body">
          <p>Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?</p>
          <div className="admin-modal-actions">
            <WSButton label="Cancel" onClick={() => setIsDeleteModalOpen(false)} />
            <WSButton 
              label="Delete" 
              className="delete-btn" 
              onClick={confirmDeleteUser}
              disabled={deleteUserMutation.isPending}
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <form onSubmit={submitEditUser} className="admin-form">
          <div className="admin-form-group">
            <label htmlFor="edit-name">Name</label>
            <input 
              id="edit-name"
              type="text" 
              value={editFormData.name} 
              onChange={e => setEditFormData({...editFormData, name: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="edit-email">Email</label>
            <input 
              id="edit-email"
              type="email" 
              value={editFormData.email} 
              onChange={e => setEditFormData({...editFormData, email: e.target.value})}
              required
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="edit-status">Status</label>
            <select 
              id="edit-status"
              value={editFormData.status}
              onChange={e => setEditFormData({...editFormData, status: e.target.value as UserStatus})}
            >
              <option value={UserStatus.Approved}>Approved</option>
              <option value={UserStatus.Pending}>Pending</option>
              <option value={UserStatus.Blocked}>Blocked</option>
            </select>
          </div>
          <div className="admin-modal-actions">
            <WSButton label="Cancel" type="button" onClick={() => setIsEditModalOpen(false)} />
            <WSButton 
              label="Save Changes" 
              type="submit"
              className="approve-btn"
              disabled={updateUserMutation.isPending}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};