import React from 'react';
import WSButton from '../../../components/WSButton';

const MOCK_PENDING_MATCHES = [
  { id: 101, student: "John Doe", teacher: "Jane Smith", subject: "Mathematics", date: "2026-01-20" },
  { id: 102, student: "Alice Johnson", teacher: "Robert Brown", subject: "Physics", date: "2026-01-19" },
];

export const PendingMatchesTab: React.FC = () => {
  return (
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
  );
};