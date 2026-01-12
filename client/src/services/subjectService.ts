import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Subject } from '../../../common/types';

const SUBJECTS_KEY = 'subjects';
const API_URL = 'http://localhost:3000/api/subjects';

const getAllSubjects = async (): Promise<Subject[]> => {
  const response = await fetch(`${API_URL}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch subjects');
  return response.json();
};

const getSubjectById = async (id: number): Promise<Subject> => {
  const response = await fetch(`${API_URL}/${id}`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch subject');
  return response.json();
};

const createSubject = async (name: string): Promise<Subject> => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to create subject');
  return response.json();
};

const deleteSubject = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete subject');
};

// React query hooks
export const useGetSubjects = () => {
  return useQuery({
    queryKey: [SUBJECTS_KEY],
    queryFn: getAllSubjects,
    staleTime: Infinity, 
  });
};

export const useGetSubjectById = (id: number) => {
  return useQuery({
    queryKey: [SUBJECTS_KEY, id],
    queryFn: () => getSubjectById(id),
    enabled: !!id,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_KEY] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_KEY] });
    },
  });
};