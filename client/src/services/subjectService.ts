import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_API_DELAY_MS, MOCK_SUBJECTS } from './mockData';
import { type Subject } from '../../../common/types';

const SUBJECTS_KEY = 'subjects';
const SUBJECT_DETAIL_KEY = 'subjectDetail';

type UpdateSubjectParams = { id: number; name: string };

// Mock data fetching until real routes are complete
const fetchSubjects = async (): Promise<Subject[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_SUBJECTS);
        }, MOCK_API_DELAY_MS);
    });
};

const fetchSubjectById = async (id: number): Promise<Subject> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const subject = MOCK_SUBJECTS.find(s => s.id === id);
            if (subject) {
                resolve(subject);
            } else {
                reject(new Error('Subject not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

const createSubject = async (name: string): Promise<Subject> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newSubject: Subject = {
                id: MOCK_SUBJECTS.length > 0 ? Math.max(...MOCK_SUBJECTS.map(s => s.id)) + 1 : 1,
                name
            };
            MOCK_SUBJECTS.push(newSubject);
            resolve(newSubject);
        }, MOCK_API_DELAY_MS);
    });
};

const updateSubject = async ({ id, name }: UpdateSubjectParams): Promise<Subject> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const subject = MOCK_SUBJECTS.find(s => s.id === id);
            if (subject) {
                subject.name = name;
                resolve(subject);
            } else {
                reject(new Error('Subject not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

const deleteSubject = async (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_SUBJECTS.findIndex(s => s.id === id);
            if (index > -1) {
                MOCK_SUBJECTS.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Subject not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

// React query hooks
export const useGetSubjects = () => {
    return useQuery({
        queryKey: [SUBJECTS_KEY],
        queryFn: fetchSubjects,
        staleTime: Infinity 
    });
};

export const useGetSubjectById = (id: number) => {
    return useQuery({
        queryKey: [SUBJECT_DETAIL_KEY, id],
        queryFn: () => fetchSubjectById(id),
        enabled: !!id
    });
};

export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUBJECTS_KEY] });
        }
    });
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSubject,
        onSuccess: (updatedSubject) => {
            queryClient.invalidateQueries({ queryKey: [SUBJECTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [SUBJECT_DETAIL_KEY, updatedSubject.id] });
        }
    });
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SUBJECTS_KEY] });
        }
    });
};