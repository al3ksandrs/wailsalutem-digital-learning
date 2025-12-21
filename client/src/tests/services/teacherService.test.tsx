import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect } from 'vitest';
import { useGetTeachers, useGetTeacherById, useGetAvailability, useUpdateTeacherProfile, useUpdateAvailability, useDeleteTeacher } from '../../services/teacherService';
import { MOCK_USERS, MOCK_AVAILABILITY } from '../../services/mockData';
import { Role, DayOfWeek } from '@common/types';

const TEACHER_ROLE = Role.Teacher;
const EXISTING_TEACHER_ID = 1;
const NEW_BIO = 'Updated bio for testing';

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

describe('teacherService', () => {
    test('useGetTeachers fetches only teachers', async () => {
        const { result } = renderHook(() => useGetTeachers(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        
        const allAreTeachers = result.current.data?.every(u => u.role === TEACHER_ROLE);
        expect(allAreTeachers).toBe(true);
    });

    test('useGetTeacherById fetches correct teacher', async () => {
        const { result } = renderHook(() => useGetTeacherById(EXISTING_TEACHER_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.id).toBe(EXISTING_TEACHER_ID);
        expect(result.current.data?.role).toBe(TEACHER_ROLE);
    });

    test('useGetAvailability fetches availability for teacher', async () => {
        const { result } = renderHook(() => useGetAvailability(EXISTING_TEACHER_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        
        const forTeacher = result.current.data?.every(a => a.teacherId === EXISTING_TEACHER_ID);
        expect(forTeacher).toBe(true);
    });

    test('useUpdateTeacherProfile updates teacher info', async () => {
        const { result } = renderHook(() => useUpdateTeacherProfile(), { wrapper: createWrapper() });

        result.current.mutate({ id: EXISTING_TEACHER_ID, bio: NEW_BIO });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.bio).toBe(NEW_BIO);
    });

    test('useUpdateAvailability updates availability slots', async () => {
        const { result } = renderHook(() => useUpdateAvailability(), { wrapper: createWrapper() });

        const newAvailability = [{
            id: 999,
            teacherId: EXISTING_TEACHER_ID,
            dayOfWeek: DayOfWeek.Friday,
            startTime: '10:00',
            endTime: '12:00',
            isBooked: false
        }];

        result.current.mutate({ teacherId: EXISTING_TEACHER_ID, availability: newAvailability });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const updatedSlots = MOCK_AVAILABILITY.filter(a => a.teacherId === EXISTING_TEACHER_ID);
        // Expecting only the new slot as the service replaces them
        expect(updatedSlots).toHaveLength(1);
        expect(updatedSlots[0].dayOfWeek).toBe(DayOfWeek.Friday);
    });

    test('useDeleteTeacher removes a teacher', async () => {
        const { result } = renderHook(() => useDeleteTeacher(), { wrapper: createWrapper() });
        const teacherToDelete = MOCK_USERS.find(u => u.role === TEACHER_ROLE);
        
        if (!teacherToDelete) throw new Error('No teacher found to delete');

        result.current.mutate(teacherToDelete.id);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        
        const exists = MOCK_USERS.find(u => u.id === teacherToDelete.id);
        expect(exists).toBeUndefined();
    });
});