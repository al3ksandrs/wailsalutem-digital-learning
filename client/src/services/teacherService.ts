import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const TEACHER_DATA_KEY = 'teacherData';
const API_URL = 'http://localhost:3000/api/teacher';

const getDashboard = async () => {
  const response = await fetch(`${API_URL}/dashboard`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch dashboard');
  return response.json();
};

const getSuggestedMatches = async () => {
  const response = await fetch(`${API_URL}/suggested-matches`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch suggestions');
  return response.json();
};

const acceptSuggestedMatch = async (requestId: number) => {
  const response = await fetch(`${API_URL}/suggested-matches/${requestId}/accept`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to accept match');
  return response.json();
};

const removeStudent = async (studentId: number) => {
  const response = await fetch(`${API_URL}/students/${studentId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to remove student');
};

// React query hooks
export const useTeacherDashboard = () => useQuery({ queryKey: [TEACHER_DATA_KEY, 'dashboard'], queryFn: getDashboard });
export const useSuggestedMatches = () => useQuery({ queryKey: [TEACHER_DATA_KEY, 'suggestions'], queryFn: getSuggestedMatches });

export const useAcceptMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptSuggestedMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEACHER_DATA_KEY] });
    },
  });
};

export const useRemoveStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEACHER_DATA_KEY] });
    },
  });
};