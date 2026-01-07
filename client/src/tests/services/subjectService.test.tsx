import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGetSubjects, useGetSubjectById, useCreateSubject, useDeleteSubject } from '../../services/subjectService';

const MOCK_SUBJECT = { id: 1, name: 'Math' };

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
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('useGetSubjects fetches all subjects', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [MOCK_SUBJECT],
        });

        const { result } = renderHook(() => useGetSubjects(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([MOCK_SUBJECT]);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/subjects'),
            expect.anything()
        );
    });

    test('useGetSubjectById fetches a specific subject', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => MOCK_SUBJECT,
        });

        const { result } = renderHook(() => useGetSubjectById(1), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(MOCK_SUBJECT);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/subjects/1'),
            expect.anything()
        );
    });

    test('useCreateSubject POSTs a new subject', async () => {
        const newSubject = { id: 2, name: 'Physics' };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => newSubject,
        });

        const { result } = renderHook(() => useCreateSubject(), { wrapper: createWrapper() });

        result.current.mutate('Physics');

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(newSubject);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/subjects'),
            expect.objectContaining({ method: 'POST', body: expect.stringContaining('Physics') })
        );
    });

    test('useDeleteSubject DELETEs a subject', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        const { result } = renderHook(() => useDeleteSubject(), { wrapper: createWrapper() });

        result.current.mutate(1);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/subjects/1'),
            expect.objectContaining({ method: 'DELETE' })
        );
    });
});