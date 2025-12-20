import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_API_DELAY_MS, MOCK_USERS, MOCK_AVAILABILITY } from './mockData';
import { type Teacher, Role, type Availability } from '../../../common/types';

const TEACHERS_QUERY_KEY = 'teachers';
const TEACHER_PROFILE_KEY = 'teacherProfile';
const AVAILABILITY_KEY = 'teacherAvailability';

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

const fetchTeacherById = async (id: number): Promise<Teacher> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const teacher = MOCK_USERS.find(u => u.id === id && u.role === Role.Teacher);
      if (teacher) resolve(teacher as Teacher);
      else reject(new Error('Teacher not found'));
    }, MOCK_API_DELAY_MS);
  });
};

const fetchAvailability = async (teacherId: number): Promise<Availability[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const availability = MOCK_AVAILABILITY.filter(a => a.teacherId === teacherId);
      resolve(availability);
    }, MOCK_API_DELAY_MS);
  });
};

const updateTeacherAvailability = async (params: UpdateAvailabilityParams): Promise<Teacher> => {
  const { teacherId, availability } = params;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = MOCK_USERS.findIndex(u => u.id === teacherId);
      if (userIndex > -1 && MOCK_USERS[userIndex].role === Role.Teacher) {
        
        // Removes old availability
        const existingIndices: number[] = [];
        MOCK_AVAILABILITY.forEach((a, index) => {
            if (a.teacherId === teacherId) existingIndices.push(index);
        });
        
        // Loops backwards to splice correctly
        for (let i = existingIndices.length - 1; i >= 0; i--) {
            MOCK_AVAILABILITY.splice(existingIndices[i], 1);
        }

        // Adds new availability
        MOCK_AVAILABILITY.push(...availability);

        resolve(MOCK_USERS[userIndex] as Teacher);
      } else {
        reject(new Error('Teacher not found'));
      }
    }, MOCK_API_DELAY_MS);
  });
};

const updateTeacherProfile = async (data: Partial<Teacher>): Promise<Teacher> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_USERS.findIndex(u => u.id === data.id);
      if (index > -1) {
        MOCK_USERS[index] = { ...MOCK_USERS[index], ...data } as Teacher;
        resolve(MOCK_USERS[index] as Teacher);
      } else {
        reject(new Error('Teacher not found'));
      }
    }, MOCK_API_DELAY_MS);
  });
};

const deleteTeacher = async (teacherId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_USERS.findIndex(u => u.id === teacherId && u.role === Role.Teacher);
      if (index > -1) {
        MOCK_USERS.splice(index, 1);
        resolve();
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

export const useGetTeacherById = (id: number) => {
  return useQuery({
    queryKey: [TEACHER_PROFILE_KEY, id],
    queryFn: () => fetchTeacherById(id),
    enabled: !!id
  });
};

export const useGetAvailability = (teacherId: number) => {
  return useQuery({
    queryKey: [AVAILABILITY_KEY, teacherId],
    queryFn: () => fetchAvailability(teacherId),
    enabled: !!teacherId
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [AVAILABILITY_KEY] });
    }
  });
};

export const useUpdateTeacherProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTeacherProfile,
    onSuccess: (data) => {
      queryClient.setQueryData([TEACHER_PROFILE_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
    }
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TEACHERS_QUERY_KEY] });
    }
  });
};