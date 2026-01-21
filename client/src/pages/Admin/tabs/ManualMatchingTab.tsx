import React, { useState, useEffect } from 'react';
import { 
  useGetAcceptedMatches, 
  useCreateManualMatch, 
  useDeleteMatch,
  useGetAllUsers 
} from '../../../services/adminService';
import WSButton from '../../../components/WSButton';

export const ManualMatchingTab: React.FC = () => {
  const { data: matches, isLoading: matchesLoading } = useGetAcceptedMatches();
  const { data: students } = useGetAllUsers('Student');
  const { data: teachers } = useGetAllUsers('Teacher');
  
  // Local state for subjects
  const [subjects, setSubjects] = useState<{id: number, name: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const createMatchMutation = useCreateManualMatch();
  const deleteMatchMutation = useDeleteMatch();

  const [selectedStudent, setSelectedStudent] = useState<number | ''>('');
  const [selectedTeacher, setSelectedTeacher] = useState<number | ''>('');
  const [selectedSubject, setSelectedSubject] = useState<number | ''>('');

  useEffect(() => {
    fetch('http://localhost:3000/api/subjects')
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error("Failed to fetch subjects", err));
  }, []);

  const handleCreate = () => {
    setError(null);
    if (!selectedStudent || !selectedTeacher || !selectedSubject) {
      setError("Please select a student, a teacher, and a subject.");
      return;
    }

    createMatchMutation.mutate({
      studentId: Number(selectedStudent),
      teacherId: Number(selectedTeacher),
      subjectId: Number(selectedSubject)
    }, {
      onSuccess: () => {
        // Reset form
        setSelectedStudent('');
        setSelectedTeacher('');
        setSelectedSubject('');
        setError(null);
      },
      onError: (err: Error) => {
        setError(err.message);
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to unassign this teacher from the student?')) {
      deleteMatchMutation.mutate(id);
    }
  };

  if (matchesLoading) return <div className="admin-loading">Loading matches...</div>;

  return (
    <div className="section-container">
      <h2>Manual matching</h2>
      <p className="manual-match-description">
        Manually assign a teacher to a student for a specific subject. This will create an active connection between them.
      </p>

      {/* Creation Form */}
      <div className="manual-match-form">
        <div className="manual-match-input-group">
          <label htmlFor="select-student">Student</label>
          <select 
            id="select-student"
            value={selectedStudent} 
            onChange={(e) => setSelectedStudent(Number(e.target.value))}
          >
            <option value="">Select Student...</option>
            {students?.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
            ))}
          </select>
        </div>

        <div className="manual-match-input-group">
          <label htmlFor="select-teacher">Teacher</label>
          <select 
            id="select-teacher"
            value={selectedTeacher} 
            onChange={(e) => setSelectedTeacher(Number(e.target.value))}
          >
            <option value="">Select Teacher...</option>
            {teachers?.filter(t => t.status === 'Approved').map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
            ))}
          </select>
        </div>

        <div className="manual-match-input-group">
          <label htmlFor="select-subject">Subject</label>
          <select 
            id="select-subject"
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(Number(e.target.value))}
          >
            <option value="">Select Subject...</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div className="manual-match-assign-btn">
          <WSButton 
            label={createMatchMutation.isPending ? "Assigning..." : "Assign Teacher"} 
            onClick={handleCreate}
            className="is-primary" 
            disabled={createMatchMutation.isPending}
          />
        </div>

        {error && (
          <div className="manual-match-error">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* List of Matches */}
      <h3>Existing Matches</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Teacher</th>
            <th>Subject</th>
            <th>Matched On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matches?.map(match => (
            <tr key={match.id}>
              <td>{match.student_name}</td>
              <td>{match.teacher_name}</td>
              <td>{match.subject_name || '-'}</td>
              <td>{new Date(match.created_at).toLocaleDateString()}</td>
              <td>
                <button 
                  className="ws-button secondary small btn-unmatch"
                  onClick={() => handleDelete(match.id)}
                  disabled={deleteMatchMutation.isPending}
                >
                  Unmatch
                </button>
              </td>
            </tr>
          ))}
          {matches?.length === 0 && (
            <tr>
              <td colSpan={5} className="no-data">No active matches found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};