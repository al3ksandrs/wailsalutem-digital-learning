import React from 'react';
import { 
  useGetPendingTeachers, 
  useUpdateUserStatus 
} from '../../../services/adminService';
import { UserStatus, type Teacher, type UserProfile } from '../../../../../common/types';
import WSButton from '../../../components/WSButton';

export const PendingTeachersTab: React.FC = () => {
  const { data: pendingTeachers } = useGetPendingTeachers();
  const updateUserStatusMutation = useUpdateUserStatus();

  const handleApproveTeacher = (teacherId: number) => {
    updateUserStatusMutation.mutate({ id: teacherId, status: UserStatus.Approved });
  };

  const handleRejectTeacher = (teacherId: number) => {
    if (!confirm('Are you sure you want to reject this teacher?')) return;
    updateUserStatusMutation.mutate({ id: teacherId, status: UserStatus.Blocked }); 
  };

  return (
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
  );
};