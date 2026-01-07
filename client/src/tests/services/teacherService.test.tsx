import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTeacherDashboard, useSuggestedMatches, useAcceptMatch, useRemoveStudent } from '../../services/teacherService';

const MOCK_DASHBOARD = {
    activeStudents: 5,
    pendingRequests: 2
};

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
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('useTeacherDashboard fetches dashboard data', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => MOCK_DASHBOARD,
        });

        const { result } = renderHook(() => useTeacherDashboard(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(MOCK_DASHBOARD);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/teacher/dashboard'),
            expect.anything()
        );
    });

    test('useSuggestedMatches fetches suggestions', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        const { result } = renderHook(() => useSuggestedMatches(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/teacher/suggested-matches'),
            expect.anything()
        );
    });

    test('useAcceptMatch posts acceptance', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        const { result } = renderHook(() => useAcceptMatch(), { wrapper: createWrapper() });

        result.current.mutate(123); // request ID

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/teacher/suggested-matches/123/accept'),
            expect.objectContaining({ method: 'POST' })
        );
    });

    test('useRemoveStudent deletes student connection', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        const { result } = renderHook(() => useRemoveStudent(), { wrapper: createWrapper() });

        result.current.mutate(55); // student ID

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/teacher/students/55'),
            expect.objectContaining({ method: 'DELETE' })
        );
    });
});