import React, { useState, useMemo } from 'react';
import { 
  useGetOpenHelpRequests, 
  useAssignTeacher, 
  useGetAllUsers,
  type AdminHelpRequest
} from '../../../services/adminService';
import WSButton from '../../../components/WSButton';
import Modal from '../../../components/Modal';

export const HelpRequestsTab: React.FC = () => {
  const { data: openRequests } = useGetOpenHelpRequests();
  const { data: allTeachers } = useGetAllUsers('Teacher');
  const assignTeacherMutation = useAssignTeacher();

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [requestToAssign, setRequestToAssign] = useState<AdminHelpRequest | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | ''>('');

  const availableTeachers = useMemo(() => {
    return allTeachers?.filter(t => t.status === 'Approved') || [];
  }, [allTeachers]);

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

  return (
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

      {/* Assign Teacher Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign Teacher"
      >
        <div className="admin-modal-body" style={{ minWidth: '350px' }}>
          <p>Assign a teacher to <strong>{requestToAssign?.student_name}</strong>'s request for <strong>{requestToAssign?.subject_name}</strong>.</p>
          
          <div className="admin-form-group spaced">
            <label htmlFor="teacher-select">Select Teacher</label>
            <select
              id="teacher-select"
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
            >
              <option value="">Choose a teacher</option>
              {availableTeachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.email})
                </option>
              ))}
            </select>
          </div>

          <div className="admin-modal-actions">
            <WSButton label="Cancel" onClick={() => setIsAssignModalOpen(false)} />
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