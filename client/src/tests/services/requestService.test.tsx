import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect } from 'vitest';
import { useGetRequests, useGetAllRequests, useGetRequestById, useCreateRequest, useUpdateRequestStatus, useDeleteRequest } from '../../services/requestService';
import { MOCK_REQUESTS } from '../../services/mockData';
import { RequestStatus } from '@common/types';

const TEST_USER_ID = 2; // Student ID
const EXISTING_REQUEST_ID = 1;
const NEW_DESCRIPTION = 'Help with Physics';

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
    test('useGetRequests fetches requests for a specific user', async () => {
        const { result } = renderHook(() => useGetRequests(TEST_USER_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();
        
        const userRequests = result.current.data?.every(r => r.studentId === TEST_USER_ID || r.assignedTeacherId === TEST_USER_ID);
        expect(userRequests).toBe(true);
    });

    test('useGetAllRequests fetches all requests', async () => {
        const { result } = renderHook(() => useGetAllRequests(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.length).toBeGreaterThanOrEqual(1);
    });

    test('useGetRequestById fetches correct request', async () => {
        const { result } = renderHook(() => useGetRequestById(EXISTING_REQUEST_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.id).toBe(EXISTING_REQUEST_ID);
    });

    test('useCreateRequest adds a new request', async () => {
        const { result } = renderHook(() => useCreateRequest(), { wrapper: createWrapper() });

        const newRequest = {
            studentId: TEST_USER_ID,
            assignedTeacherId: 1,
            subjectId: 2,
            description: NEW_DESCRIPTION,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString()
        };

        result.current.mutate(newRequest);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.description).toBe(NEW_DESCRIPTION);
        expect(result.current.data?.status).toBe('pending');
    });

    test('useUpdateRequestStatus updates status', async () => {
        const { result } = renderHook(() => useUpdateRequestStatus(), { wrapper: createWrapper() });

        result.current.mutate({ requestId: EXISTING_REQUEST_ID, status: RequestStatus.Accepted });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.status).toBe(RequestStatus.Accepted);
        
        const updated = MOCK_REQUESTS.find(r => r.id === EXISTING_REQUEST_ID);
        expect(updated?.status).toBe(RequestStatus.Accepted);
    });

    test('useDeleteRequest removes a request', async () => {
        const { result } = renderHook(() => useDeleteRequest(), { wrapper: createWrapper() });
        const requestToDelete = MOCK_REQUESTS[0];

        result.current.mutate(requestToDelete.id);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        
        const exists = MOCK_REQUESTS.find(r => r.id === requestToDelete.id);
        expect(exists).toBeUndefined();
    });
});