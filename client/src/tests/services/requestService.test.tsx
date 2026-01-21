import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
    useGetMyRequests, 
    useGetPendingRequests, 
    useGetTeacherRequests, 
    useCreateRequest, 
    useUpdateRequestStatus,
    useUpdateRequest,
    useDeleteRequest
} from '../../services/requestService';
import { RequestStatus } from '@common/types';

const TEST_UPDATE_ID = 1;
const TEST_DELETE_ID = 1;
const TEST_SUBJECT_FILTER_ID = 5;
const REQUEST_ID = 1;
const STUDENT_ID = 2;
const SUBJECT_ID = 101;
const NEW_SUBJECT_ID = 2;

const MOCK_REQUEST = {
    id: REQUEST_ID,
    studentId: STUDENT_ID,
    subjectId: SUBJECT_ID,
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

    test('useGetMyRequests fetches requests filtered by subjectId', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [MOCK_REQUEST],
        });

        const { result } = renderHook(() => useGetMyRequests(TEST_SUBJECT_FILTER_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/student/my-requests?subjectId=${TEST_SUBJECT_FILTER_ID}`),
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
            subjectId: NEW_SUBJECT_ID,
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

    test('useUpdateRequest PUTs a request update', async () => {
        const updatedData = { description: 'Updated Description' };
        const updatedRequest = { ...MOCK_REQUEST, ...updatedData };
        
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => updatedRequest,
        });

        const { result } = renderHook(() => useUpdateRequest(), { wrapper: createWrapper() });

        result.current.mutate({ 
            requestId: TEST_UPDATE_ID, 
            data: updatedData as any 
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(updatedRequest);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/student/help-requests/${TEST_UPDATE_ID}`),
            expect.objectContaining({ 
                method: 'PUT',
                body: expect.stringContaining('Updated Description')
            })
        );
    });

    test('useDeleteRequest DELETEs a request', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const { result } = renderHook(() => useDeleteRequest(), { wrapper: createWrapper() });

        result.current.mutate(TEST_DELETE_ID);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/student/help-requests/${TEST_DELETE_ID}`),
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    test('useUpdateRequestStatus PUTs a status update', async () => {
        const updatedRequest = { ...MOCK_REQUEST, status: 'Accepted' };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => updatedRequest,
        });

        const { result } = renderHook(() => useUpdateRequestStatus(), { wrapper: createWrapper() });

        result.current.mutate({ requestId: REQUEST_ID, status: RequestStatus.Accepted });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.status).toBe('Accepted');
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/teacher/help-requests/${REQUEST_ID}`),
            expect.objectContaining({ method: 'PUT' })
        );
    });
});