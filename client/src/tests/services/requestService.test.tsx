import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
    useGetMyRequests, 
    useGetPendingRequests, 
    useGetTeacherRequests, 
    useCreateRequest, 
    useUpdateRequestStatus 
} from '../../services/requestService';
import { RequestStatus } from '@common/types';

const MOCK_REQUEST = {
    id: 1,
    studentId: 2,
    subjectId: 101,
    description: 'Help needed',
    status: 'pending'
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

describe('requestService', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('useGetMyRequests fetches student requests', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [MOCK_REQUEST],
        });

        const { result } = renderHook(() => useGetMyRequests(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([MOCK_REQUEST]);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/student/my-requests'),
            expect.anything()
        );
    });

    test('useGetPendingRequests fetches pending requests', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [MOCK_REQUEST],
        });

        const { result } = renderHook(() => useGetPendingRequests(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/student/pending-requests'),
            expect.anything()
        );
    });

    test('useGetTeacherRequests fetches assigned requests for teacher', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [MOCK_REQUEST],
        });

        const { result } = renderHook(() => useGetTeacherRequests(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/teacher/help-requests'),
            expect.anything()
        );
    });

    test('useCreateRequest POSTs a new request', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => MOCK_REQUEST,
        });

        const { result } = renderHook(() => useCreateRequest(), { wrapper: createWrapper() });

        const newRequest = {
            subjectId: 2,
            description: 'New Help',
            location: 'Room 1',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString()
        };

        result.current.mutate(newRequest);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/student/help-requests'),
            expect.objectContaining({ method: 'POST' })
        );
    });

    test('useUpdateRequestStatus PUTs a status update', async () => {
        const updatedRequest = { ...MOCK_REQUEST, status: 'Accepted' };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => updatedRequest,
        });

        const { result } = renderHook(() => useUpdateRequestStatus(), { wrapper: createWrapper() });

        result.current.mutate({ requestId: 1, status: RequestStatus.Accepted });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.status).toBe('Accepted');
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/teacher/help-requests/1'),
            expect.objectContaining({ method: 'PUT' })
        );
    });
});