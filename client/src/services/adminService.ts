import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type UserProfile } from '../../../common/types';

const USERS_KEY = 'adminUsers';
const STATS_KEY = 'adminStats';
const PENDING_TEACHERS_KEY = 'adminPendingTeachers';
const OPEN_REQUESTS_KEY = 'adminOpenRequests';

const API_URL = 'http://localhost:3000/api/admin';

type CreateUserParams = Omit<UserProfile, 'id'> & { password: string };
type UpdateUserParams = { id: number; data: Partial<UserProfile> & { status?: string } };
type UpdateStatusParams = { id: number; status: string };

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  pendingTeachers: number;
  totalSubjects: number;
  pendingMatches: number;
}

export interface AdminHelpRequest {
  id: number;
  student_name: string;
  subject_name: string;
  description: string;
  location?: string;
  status: string;
}

// Fetch functions
const getAllUsers = async (role?: string): Promise<UserProfile[]> => {
  const query = role ? `?role=${role}` : '';
  const response = await fetch(`${API_URL}/users${query}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

const getUserById = async (id: number): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

const createUser = async (user: CreateUserParams): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
};

const updateUser = async ({ id, data }: UpdateUserParams): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
};

const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete user');
};

const updateUserStatus = async ({ id, status }: UpdateStatusParams): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/users/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to update status');
  return response.json();
};

const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch(`${API_URL}/stats`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
};

const getPendingTeachers = async (): Promise<UserProfile[]> => {
  const response = await fetch(`${API_URL}/teachers/pending`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch pending teachers');
  return response.json();
};

const getOpenHelpRequests = async (): Promise<AdminHelpRequest[]> => {
  const response = await fetch(`${API_URL}/requests/open`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch open requests');
  return response.json();
};

const assignTeacher = async ({ requestId, teacherId }: { requestId: number; teacherId: number }): Promise<void> => {
  const response = await fetch(`${API_URL}/requests/${requestId}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ teacherId }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to assign teacher');
};

// React query hooks
export const useGetAllUsers = (role?: string) => {
  return useQuery({
    queryKey: [USERS_KEY, role],
    queryFn: () => getAllUsers(role),
  });
};

export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.setQueryData([USERS_KEY, data.id], data);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
      queryClient.setQueryData([USERS_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
      queryClient.invalidateQueries({ queryKey: [PENDING_TEACHERS_KEY] });
    },
  });
};

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: [STATS_KEY],
    queryFn: getDashboardStats,
  });
};

export const useGetPendingTeachers = () => {
  return useQuery({
    queryKey: [PENDING_TEACHERS_KEY],
    queryFn: getPendingTeachers,
  });
};

export const useGetOpenHelpRequests = () => {
  return useQuery({
    queryKey: [OPEN_REQUESTS_KEY],
    queryFn: getOpenHelpRequests,
  });
};

export const useAssignTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OPEN_REQUESTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [STATS_KEY] });
    },
  });
};