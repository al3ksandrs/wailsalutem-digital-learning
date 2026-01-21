import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useStudentDashboard, useStudentMatches, useStudentConnections } from '../../services/studentService';

const MOCK_DASHBOARD = {
    pendingRequests: 2,
    totalSessions: 5,
    upcomingSessions: 1
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

describe('studentService', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('useStudentDashboard fetches dashboard stats', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => MOCK_DASHBOARD,
        });

        const { result } = renderHook(() => useStudentDashboard(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(MOCK_DASHBOARD);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/student/dashboard'),
            expect.anything()
        );
    });

    test('useStudentMatches fetches matches', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        const { result } = renderHook(() => useStudentMatches(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/student/matches'),
            expect.anything()
        );
    });

    test('useStudentConnections fetches connections', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        const { result } = renderHook(() => useStudentConnections(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/student/connections'),
            expect.anything()
        );
    });
});