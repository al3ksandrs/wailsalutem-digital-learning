import React from 'react';

const MOCK_ACCEPTED_MATCHES = [
  { id: 201, student: "Michael Lee", teacher: "Sarah Connor", subject: "History", date: "2025-12-15" },
  { id: 202, student: "Emily Davis", teacher: "James Wilson", subject: "Chemistry", date: "2026-01-10" },
];

export const AcceptedMatchesTab: React.FC = () => {
  return (
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
  );
};