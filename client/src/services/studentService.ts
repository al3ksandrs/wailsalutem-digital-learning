import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_API_DELAY_MS, MOCK_USERS } from './mockData';
import { type Student, Role } from '../../../common/types';

const STUDENTS_KEY = 'students';
const STUDENT_PROFILE_KEY = 'studentProfile';

// Mock data fetching until real routes are complete
const fetchStudents = async (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const students = MOCK_USERS.filter(u => u.role === Role.Student) as Student[];
      resolve(students);
    }, MOCK_API_DELAY_MS);
  });
};

const fetchStudentById = async (studentId: number): Promise<Student> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = MOCK_USERS.find(u => u.id === studentId && u.role === Role.Student);
      if (student) {
        resolve(student as Student);
      } else {
        reject(new Error('Student not found'));
      }
    }, MOCK_API_DELAY_MS);
  });
};

const updateStudentProfile = async (data: Partial<Student>): Promise<Student> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_USERS.findIndex(u => u.id === data.id);
      if (index > -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...data } as Student;
        resolve(MOCK_USERS[index] as Student);
      } else {
        reject(new Error('Student not found'));
      }
    }, MOCK_API_DELAY_MS);
  });
};

const deleteStudent = async (studentId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_USERS.findIndex(u => u.id === studentId && u.role === Role.Student);
      if (index > -1) {
        MOCK_USERS.splice(index, 1);
        resolve();
      } else {
        reject(new Error('Student not found'));
      }
    }, MOCK_API_DELAY_MS);
  });
};

// React query hooks
export const useGetStudents = () => {
  return useQuery({
    queryKey: [STUDENTS_KEY],
    queryFn: fetchStudents,
  });
};

export const useGetStudentById = (studentId: number) => {
  return useQuery({
    queryKey: [STUDENT_PROFILE_KEY, studentId],
    queryFn: () => fetchStudentById(studentId),
    enabled: !!studentId,
  });
};

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: (data) => {
      queryClient.setQueryData([STUDENT_PROFILE_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
    }
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: (_, variables) => {
      queryClient.removeQueries({ queryKey: [STUDENT_PROFILE_KEY, variables] });
      queryClient.invalidateQueries({ queryKey: [STUDENTS_KEY] });
    }
  });
};