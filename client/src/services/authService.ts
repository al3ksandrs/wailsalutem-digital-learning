import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_API_DELAY_MS, MOCK_USERS } from './mockData';
import { 
    type LoginRequest, 
    type RegisterTeacherRequest, 
    type RegisterStudentRequest, 
    type UserProfile,
    Role,
    UserStatus
} from '../../../common/types';

// Mock auth user key
const AUTH_USER_KEY = 'authUser';

// Mock data fetching until real routes are complete
const mockLogin = async (credentials: LoginRequest): Promise<UserProfile> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === credentials.email);
      
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, MOCK_API_DELAY_MS);
  });
};

const mockRegisterTeacher = async (data: RegisterTeacherRequest): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: UserProfile = {
        id: Math.floor(Math.random() * 10000),
        email: data.email,
        name: data.name,
        status: UserStatus.Pending,
        role: Role.Teacher,
        expertise: data.expertise,
      } as any; 
      
      MOCK_USERS.push(newUser);
      resolve(newUser);
    }, MOCK_API_DELAY_MS);
  });
};

const mockRegisterStudent = async (data: RegisterStudentRequest): Promise<UserProfile> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: UserProfile = {
        id: Math.floor(Math.random() * 10000),
        email: data.email,
        name: data.name,
        status: UserStatus.Pending,
        role: Role.Student,
        education: data.education,
        schoolYear: data.schoolYear,
      } as any;
      
      MOCK_USERS.push(newUser);
      resolve(newUser);
    }, MOCK_API_DELAY_MS);
  });
};

// React query hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mockLogin,
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
    mutationFn: mockRegisterTeacher,
    onSuccess: (data) => {
      console.log('Teacher registration successful:', data);
    }
  });
};

export const useRegisterStudent = () => {
  return useMutation({
    mutationFn: mockRegisterStudent,
    onSuccess: (data) => {
      console.log('Student registration successful:', data);
    }
  });
};