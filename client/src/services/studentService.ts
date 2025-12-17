import { useQuery } from '@tanstack/react-query';
import { MOCK_API_DELAY_MS, MOCK_USERS } from './mockData';
import { type Student, Role } from '../../../common/types';

const STUDENT_PROFILE_KEY = 'studentProfile';

type FetchStudentProfileParams = {
  studentId: number;
};

// Mock data fetching until real routes are complete

const fetchStudentProfile = async (params: FetchStudentProfileParams): Promise<Student> => {
  const { studentId } = params;
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

// React query hooks
export const useStudentProfile = (studentId: number) => {
  return useQuery({
    queryKey: [STUDENT_PROFILE_KEY, studentId],
    queryFn: () => fetchStudentProfile({ studentId }),
    enabled: !!studentId,
  });
};