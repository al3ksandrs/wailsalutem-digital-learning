import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect } from 'vitest';
import { useGetStudents, useGetStudentById, useUpdateStudentProfile, useDeleteStudent } from '../../services/studentService';
import { MOCK_USERS } from '../../services/mockData';
import { Role, type Student } from '@common/types';

const STUDENT_ROLE = Role.Student;
const EXISTING_STUDENT_ID = 2; 
const UPDATE_LOCATION = 'Utrecht';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('studentService', () => {
    test('useGetStudents fetches only students', async () => {
        const { result } = renderHook(() => useGetStudents(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        
        const allAreStudents = result.current.data?.every(u => u.role === STUDENT_ROLE);
        expect(allAreStudents).toBe(true);
    });

    test('useGetStudentById fetches correct student', async () => {
        const { result } = renderHook(() => useGetStudentById(EXISTING_STUDENT_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        expect(result.current.data?.id).toBe(EXISTING_STUDENT_ID);
        expect(result.current.data?.role).toBe(STUDENT_ROLE);
    });

    test('useUpdateStudentProfile updates student data', async () => {
        const { result } = renderHook(() => useUpdateStudentProfile(), { wrapper: createWrapper() });

        result.current.mutate({ id: EXISTING_STUDENT_ID, location: UPDATE_LOCATION });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect((result.current.data as Student)?.location).toBe(UPDATE_LOCATION);

        const updatedUser = MOCK_USERS.find(u => u.id === EXISTING_STUDENT_ID);
        expect((updatedUser as Student)?.location).toBe(UPDATE_LOCATION);
    });

    test('useDeleteStudent removes a student', async () => {
        const { result } = renderHook(() => useDeleteStudent(), { wrapper: createWrapper() });
        
        const studentToDelete = MOCK_USERS.find(u => u.role === STUDENT_ROLE);
        if (!studentToDelete) throw new Error('No student found to delete');

        result.current.mutate(studentToDelete.id);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        
        const exists = MOCK_USERS.find(u => u.id === studentToDelete.id);
        expect(exists).toBeUndefined();
    });
});