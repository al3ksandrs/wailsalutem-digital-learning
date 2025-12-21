import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect } from 'vitest';
import { useGetSubjects, useGetSubjectById, useCreateSubject, useUpdateSubject, useDeleteSubject } from '../../services/subjectService';
import { MOCK_SUBJECTS } from '../../services/mockData';

const FIRST_SUBJECT_ID = 1;
const NEW_SUBJECT_NAME = 'Philosophy';
const UPDATED_SUBJECT_NAME = 'Advanced Math';

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

describe('subjectService', () => {
    test('useGetSubjects fetches subjects', async () => {
        const { result } = renderHook(() => useGetSubjects(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        expect(result.current.data?.length).toBeGreaterThan(0);
    });

    test('useGetSubjectById fetches a specific subject', async () => {
        const { result } = renderHook(() => useGetSubjectById(FIRST_SUBJECT_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        expect(result.current.data?.id).toBe(FIRST_SUBJECT_ID);
    });

    test('useCreateSubject adds a new subject', async () => {
        const { result } = renderHook(() => useCreateSubject(), { wrapper: createWrapper() });

        result.current.mutate(NEW_SUBJECT_NAME);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.name).toBe(NEW_SUBJECT_NAME);
        
        const exists = MOCK_SUBJECTS.find(s => s.name === NEW_SUBJECT_NAME);
        expect(exists).toBeDefined();
    });

    test('useUpdateSubject updates an existing subject', async () => {
        const { result } = renderHook(() => useUpdateSubject(), { wrapper: createWrapper() });

        result.current.mutate({ id: FIRST_SUBJECT_ID, name: UPDATED_SUBJECT_NAME });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.name).toBe(UPDATED_SUBJECT_NAME);
        
        const updated = MOCK_SUBJECTS.find(s => s.id === FIRST_SUBJECT_ID);
        expect(updated?.name).toBe(UPDATED_SUBJECT_NAME);
    });

    test('useDeleteSubject removes a subject', async () => {
        const { result } = renderHook(() => useDeleteSubject(), { wrapper: createWrapper() });
        const subjectToDelete = MOCK_SUBJECTS.at(-1)!;

        result.current.mutate(subjectToDelete.id);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        
        const exists = MOCK_SUBJECTS.find(s => s.id === subjectToDelete.id);
        expect(exists).toBeUndefined();
    });
});