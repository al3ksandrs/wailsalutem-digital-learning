import React, { useState, useMemo } from 'react';
import { 
  useGetDashboardStats, 
  useGetPendingTeachers, 
  useUpdateUserStatus,
  useGetAllUsers,
  useUpdateUser,
  useDeleteUser,
  useGetOpenHelpRequests,
  useAssignTeacher,
  type AdminHelpRequest
} from '../../services/adminService';
import { type UserProfile, UserStatus, type Teacher } from '../../../../common/types';
import StatsCard from '../../components/StatsCard';
import WSButton from '../../components/WSButton';
import Modal from '../../components/Modal';
import LogoutButton from '../../components/LogoutButton';
import '../../css/admin-dashboard.css';

// note to jesse: mock data voor nu als het je niet meer lukt om manual matching werkend te krijgen
const MOCK_PENDING_MATCHES = [
  { id: 101, student: "John Doe", teacher: "Jane Smith", subject: "Mathematics", date: "2026-01-20" },
  { id: 102, student: "Alice Johnson", teacher: "Robert Brown", subject: "Physics", date: "2026-01-19" },
];

const MOCK_ACCEPTED_MATCHES = [
  { id: 201, student: "Michael Lee", teacher: "Sarah Connor", subject: "History", date: "2025-12-15" },
  { id: 202, student: "Emily Davis", teacher: "James Wilson", subject: "Chemistry", date: "2026-01-10" },
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'user_management' | 'help_requests' | 'pending_teachers' | 'pending_matches' | 'accepted_matches'>('user_management');

  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSortConfig, setUserSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    status: '' as UserStatus
  });

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [requestToAssign, setRequestToAssign] = useState<AdminHelpRequest | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');

  const { data: stats, isLoading: isLoadingStats } = useGetDashboardStats();
  const { data: pendingTeachers, isLoading: isLoadingTeachers } = useGetPendingTeachers();
  const { data: allUsers, isLoading: isLoadingUsers } = useGetAllUsers();
  const { data: openRequests } = useGetOpenHelpRequests();
  
  const { data: allTeachers } = useGetAllUsers('Teacher');
  const availableTeachers = useMemo(() => {
    return allTeachers?.filter(t => t.status === 'Approved') || [];
  }, [allTeachers]);

  const updateUserStatusMutation = useUpdateUserStatus();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const assignTeacherMutation = useAssignTeacher();

  const handleApproveTeacher = (teacherId: number) => {
    updateUserStatusMutation.mutate({ id: teacherId, status: UserStatus.Approved });
  };

  const handleRejectTeacher = (teacherId: number) => {
    if (!confirm('Are you sure you want to reject this teacher?')) return;
    updateUserStatusMutation.mutate({ id: teacherId, status: UserStatus.Blocked }); 
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
        data: {
          name: editFormData.name,
          email: editFormData.email,
          status: editFormData.status
        }
      }, {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setUserToEdit(null);
        }
      });
    }
  };

  const handleAssignClick = (req: AdminHelpRequest) => {
    setRequestToAssign(req);
    setSelectedTeacherId('');
    setIsAssignModalOpen(true);
  };

  const confirmAssignTeacher = () => {
    if (requestToAssign && selectedTeacherId) {
        assignTeacherMutation.mutate({
            requestId: requestToAssign.id,
            teacherId: Number(selectedTeacherId)
        }, {
            onSuccess: () => {
                setIsAssignModalOpen(false);
                setRequestToAssign(null);
                setSelectedTeacherId('');
            }
        });
    }
  };

  // Sorting & filtering logic
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (userSortConfig?.key === key && userSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setUserSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    if (!allUsers) return [];
    
    let result = [...allUsers];

    // Filter
    if (userSearchTerm) {
      const lowerTerm = userSearchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(lowerTerm) ||
        user.email.toLowerCase().includes(lowerTerm) ||
        (user as any).role?.toLowerCase().includes(lowerTerm) ||
        user.status.toLowerCase().includes(lowerTerm)
      );
    }

    // Sort
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

  // Helper to calculate percentage growth based on monthly new users
  const getGrowthText = (total: number, newThisMonth: number) => {
    if (!total || total === 0) return "No data";
    if (!newThisMonth || newThisMonth === 0) return "No change this month";
    
    // Calculates previous month total to get accurate growth percentage
    const previousTotal = total - newThisMonth;
    if (previousTotal <= 0) return `+100% this month`; // grew from 0 to X
    
    const percentage = Math.round((newThisMonth / previousTotal) * 100);
    return `+${percentage}% this month`;
  };


  if (isLoadingStats || isLoadingTeachers || isLoadingUsers) return <div className="admin-loading">Loading dashboard...</div>;

  // Casts stats to any to access new properties safely
  const s = stats as any;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="admin-stats">
        <StatsCard 
          title="Total students" 
          value={s?.totalStudents || 0} 
          icon="👨‍🎓" 
          trend={getGrowthText(s?.totalStudents, s?.newStudentsMonth)}
          trendDirection={s?.newStudentsMonth > 0 ? "up" : "neutral"}
        />
        <StatsCard 
          title="Total teachers" 
          value={s?.totalTeachers || 0} 
          icon="👨‍🏫" 
          trend={getGrowthText(s?.totalTeachers, s?.newTeachersMonth)}
          trendDirection={s?.newTeachersMonth > 0 ? "up" : "neutral"}
        />
        <StatsCard 
          title="Pending approvals" 
          value={s?.pendingTeachers || 0} 
          icon="⏳" 
          color={(s?.pendingTeachers || 0) > 0 ? 'orange' : 'blue'}
          trend={s?.pendingTeachers ? "(Action required)" : "All caught up"}
          trendDirection={s?.pendingTeachers ? "down" : "neutral"}
        />
        <StatsCard 
            title="Pending Matches"
            value={s?.pendingMatches || 0}
            icon="🤝"
            color={(s?.pendingMatches || 0) > 0 ? 'orange' : 'purple'}
            trend={s?.pendingMatches ? "(Action required)" : "No new requests"}
            trendDirection={s?.pendingMatches ? "down" : "neutral"}
        />
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab-btn ${activeTab === 'user_management' ? 'active' : ''}`}
          onClick={() => setActiveTab('user_management')}
        >
          User management
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'help_requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('help_requests')}
        >
          Help requests
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'pending_teachers' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending_teachers')}
        >
          Pending teacher registrations
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'pending_matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending_matches')}
        >
          Pending matches
        </button>
        <button 
          className={`admin-tab-btn ${activeTab === 'accepted_matches' ? 'active' : ''}`}
          onClick={() => setActiveTab('accepted_matches')}
        >
          Accepted matches
        </button>
      </div>

      <div className="admin-content">

        {/* --- Tab: User Management --- */}
        {activeTab === 'user_management' && (
          <div className="section-container">
            <h2>User management</h2>
            
            <div className="search-box-container">
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', width: '300px' }}
                />
            </div>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                    Name {userSortConfig?.key === 'name' && (userSortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                    Email {userSortConfig?.key === 'email' && (userSortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                    Role {userSortConfig?.key === 'role' && (userSortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
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
                {filteredAndSortedUsers.length === 0 && (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No users found matching "{userSearchTerm}"
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Tab: Help requests --- */}
        {activeTab === 'help_requests' && (
            <div className="section-container">
                <h2>Open help requests</h2>
                {!openRequests || openRequests.length === 0 ? (
                    <p className="no-data">No open help requests.</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {openRequests.map(req => (
                                <tr key={req.id}>
                                    <td>{req.student_name}</td>
                                    <td>{req.subject_name || 'N/A'}</td>
                                    <td className="truncate-cell" title={req.description}>{req.description}</td>
                                    <td>{req.location || 'Online'}</td>
                                    <td className="actions-cell">
                                        <WSButton
                                            label="Assign teacher"
                                            size="small"
                                            className="action-btn approve-btn"
                                            onClick={() => handleAssignClick(req)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        )}
        
        {/* --- Tab: Pending teachers --- */}
        {activeTab === 'pending_teachers' && (
          <div className="section-container">
            <h2>Pending teacher registrations</h2>
            {!pendingTeachers || pendingTeachers.length === 0 ? (
              <p className="no-data">No pending approvals.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Expertise</th>
                    <th>Bio</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTeachers.map((teacher: UserProfile) => {
                    const t = teacher as Teacher;
                    return (
                      <tr key={teacher.id}>
                        <td>{t.name}</td>
                        <td>{t.email}</td>
                        <td>{t.expertise || 'N/A'}</td>
                        <td className="truncate-cell" title={t.bio}>{t.bio || 'N/A'}</td>
                        <td>{t.location || 'N/A'}</td>
                        <td className="actions-cell">
                          <WSButton 
                            icon={<span className="codicon codicon-check"></span>}
                            title="Approve"
                            size="small"
                            className="action-btn approve-btn"
                            onClick={() => handleApproveTeacher(t.id)}
                            disabled={updateUserStatusMutation.isPending}
                          />
                          <WSButton 
                            icon={<span className="codicon codicon-close"></span>}
                            title="Reject"
                            size="small"
                            className="action-btn reject-btn"
                            onClick={() => handleRejectTeacher(t.id)}
                            disabled={updateUserStatusMutation.isPending}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* --- Tab: Pending matches --- */}
        {activeTab === 'pending_matches' && (
          <div className="section-container">
            <h2>Pending matches</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Teacher</th>
                  <th>Subject</th>
                  <th>Requested Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PENDING_MATCHES.map(match => (
                  <tr key={match.id}>
                    <td>{match.student}</td>
                    <td>{match.teacher}</td>
                    <td>{match.subject}</td>
                    <td>{match.date}</td>
                    <td className="actions-cell">
                      <WSButton 
                        icon={<span className="codicon codicon-check"></span>}
                        title="Approve Match"
                        size="small" 
                        className="action-btn approve-btn" 
                      />
                      <WSButton 
                        icon={<span className="codicon codicon-close"></span>}
                        title="Reject Match"
                        size="small" 
                        className="action-btn reject-btn" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Tab: Accepted matches --- */}
        {activeTab === 'accepted_matches' && (
          <div className="section-container">
            <h2>Accepted matches</h2>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Teacher</th>
                  <th>Subject</th>
                  <th>Date Accepted</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ACCEPTED_MATCHES.map(match => (
                  <tr key={match.id}>
                    <td>{match.student}</td>
                    <td>{match.teacher}</td>
                    <td>{match.subject}</td>
                    <td>{match.date}</td>
                    <td><span className="status-badge status-active">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Delete confirmation modal --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm User Deletion"
      >
        <div style={{ padding: '1rem 0' }}>
          <p>Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?</p>
          <p style={{ fontSize: '0.9rem', color: '#dc3545', marginTop: '0.5rem' }}>
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
            <WSButton 
              label="Cancel" 
              onClick={() => setIsDeleteModalOpen(false)} 
            />
            <WSButton 
              label="Delete" 
              className="delete-btn" 
              onClick={confirmDeleteUser}
              disabled={deleteUserMutation.isPending}
            />
          </div>
        </div>
      </Modal>

      {/* --- Edit user modal --- */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
      >
        <form onSubmit={submitEditUser} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
          <div className="form-group">
            <label htmlFor="edit-name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Name</label>
            <input 
              id="edit-name"
              type="text" 
              value={editFormData.name} 
              onChange={e => setEditFormData({...editFormData, name: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="edit-email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
            <input 
              id="edit-email"
              type="email" 
              value={editFormData.email} 
              onChange={e => setEditFormData({...editFormData, email: e.target.value})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-status" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
            <select 
              id="edit-status"
              value={editFormData.status}
              onChange={e => setEditFormData({...editFormData, status: e.target.value as UserStatus})}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value={UserStatus.Approved}>Approved</option>
              <option value={UserStatus.Pending}>Pending</option>
              <option value={UserStatus.Blocked}>Blocked</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <WSButton 
              label="Cancel" 
              type="button"
              onClick={() => setIsEditModalOpen(false)} 
            />
            <WSButton 
              label="Save Changes" 
              type="submit"
              className="approve-btn"
              disabled={updateUserMutation.isPending}
            />
          </div>
        </form>
      </Modal>

      {/* --- Assign teacher modal --- */}
      <Modal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          title="Assign Teacher"
      >
          <div style={{ padding: '1rem 0', minWidth: '350px' }}>
              <p>Assign a teacher to <strong>{requestToAssign?.student_name}</strong>'s request for <strong>{requestToAssign?.subject_name}</strong>.</p>
              
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label htmlFor="teacher-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Teacher</label>
                  <select
                      id="teacher-select"
                      value={selectedTeacherId}
                      onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' }}
                  >
                      <option value="">-- Choose a teacher --</option>
                      {availableTeachers.map(t => (
                          <option key={t.id} value={t.id}>
                              {t.name} ({t.email})
                          </option>
                      ))}
                  </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
                  <WSButton 
                      label="Cancel" 
                      onClick={() => setIsAssignModalOpen(false)} 
                  />
                  <WSButton 
                      label="Confirm Assignment" 
                      className="approve-btn"
                      onClick={confirmAssignTeacher}
                      disabled={assignTeacherMutation.isPending || !selectedTeacherId}
                  />
              </div>
          </div>
      </Modal>

    </div>
  );
};

export default AdminDashboard;