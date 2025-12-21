import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  type LoginRequest,
  type RegisterTeacherRequest,
  type RegisterStudentRequest,
  type UserProfile,
} from '../../../common/types';

const AUTH_USER_KEY = 'authUser';
const API_URL = 'http://localhost:3000/api/auth'; // local backend used for now

// Requests to our API endpoints
const login = async (credentials: LoginRequest): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();
  return data.user;
};

const registerTeacher = async (data: RegisterTeacherRequest): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, role: 'Teacher' }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  const resData = await response.json();
  return resData.user;
};

const registerStudent = async (data: RegisterStudentRequest): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, role: 'Student' }),
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  const resData = await response.json();
  return resData.user;
};

const logout = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

const deleteUser = async (userId: number): Promise<void> => {
  throw new Error('Delete user not implemented in backend');
};

const checkSession = async (): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  const data = await response.json();
  return data.user;
};

// React query hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData([AUTH_USER_KEY], data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
};

export const useRegisterTeacher = () => {
  return useMutation({
    mutationFn: registerTeacher,
    onSuccess: (data) => {
      console.log('Teacher registration successful:', data);
    }
  });
};

export const useRegisterStudent = () => {
  return useMutation({
    mutationFn: registerStudent,
    onSuccess: (data) => {
      console.log('Student registration successful:', data);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData([AUTH_USER_KEY], null);
      queryClient.clear();
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AUTH_USER_KEY] });
    }
  });
};

export const useAuthSession = () => {
  return useQuery({
    queryKey: [AUTH_USER_KEY],
    queryFn: checkSession,
    retry: false,
  });
};