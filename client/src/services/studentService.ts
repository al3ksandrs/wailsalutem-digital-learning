import { useQuery } from '@tanstack/react-query';

const STUDENT_DATA_KEY = 'studentData';
const API_URL = 'http://localhost:3000/api/student';

const getDashboard = async () => {
  const response = await fetch(`${API_URL}/dashboard`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch dashboard');
  return response.json();
};

const getMatches = async () => {
  const response = await fetch(`${API_URL}/matches`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch matches');
  return response.json();
};

const getConnections = async () => {
  const response = await fetch(`${API_URL}/connections`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch connections');
  return response.json();
};

// React query hooks
export const useStudentDashboard = () => useQuery({ queryKey: [STUDENT_DATA_KEY, 'dashboard'], queryFn: getDashboard });
export const useStudentMatches = () => useQuery({ queryKey: [STUDENT_DATA_KEY, 'matches'], queryFn: getMatches });
export const useStudentConnections = () => useQuery({ queryKey: [STUDENT_DATA_KEY, 'connections'], queryFn: getConnections });