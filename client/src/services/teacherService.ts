import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_API_DELAY_MS, MOCK_USERS } from './mockData';
import { type Teacher, Role, type Availability } from '../../../common/types';

const TEACHERS_QUERY_KEY = 'teachers';

type UpdateAvailabilityParams = {
  teacherId: number;
  availability: Availability[];
};

// Mock data fetching until real routes are complete
const fetchTeachers = async (): Promise<Teacher[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const teachers = MOCK_USERS.filter(u => u.role === Role.Teacher) as Teacher[];
      resolve(teachers);
    }, MOCK_API_DELAY_MS);
  });
};

const updateTeacherAvailability = async (params: UpdateAvailabilityParams): Promise<Teacher> => {
  const { teacherId, availability } = params;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = MOCK_USERS.findIndex(u => u.id === teacherId);
      if (userIndex > -1 && MOCK_USERS[userIndex].role === Role.Teacher) {
        console.log(`Updating availability for teacher ${teacherId} to:`, availability);
        
        resolve(MOCK_USERS[userIndex] as Teacher);
      } else {
        reject(new Error('Teacher not found'));
      }
    }, MOCK_API_DELAY_MS);
  });
};

// React query hooks
export const useGetTeachers = () => {
  return useQuery({
    queryKey: [TEACHERS_QUERY_KEY],
    queryFn: fetchTeachers,
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
    }
  });
};