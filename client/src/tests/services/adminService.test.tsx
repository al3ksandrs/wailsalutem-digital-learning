import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    useGetAllUsers,
    useGetUserById,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
    useUpdateUserStatus
} from '../../services/adminService';

const TEST_USER_ID = 1;
const TEST_EMAIL = 'test@example.com';
const TEST_ROLE = 'Student';
const TEST_STATUS = 'Active';
const TEST_PASSWORD = 'securePassword123';
const API_BASE_URL = 'http://localhost:3000/api/admin';

const MOCK_USER = {
    id: TEST_USER_ID,
    email: TEST_EMAIL,
    role: TEST_ROLE,
    status: 'Pending'
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

describe('adminService', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('useGetAllUsers fetches all users', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [MOCK_USER],
        });

        const { result } = renderHook(() => useGetAllUsers(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([MOCK_USER]);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`${API_BASE_URL}/users`),
            expect.objectContaining({ credentials: 'include' })
        );
    });

    test('useGetAllUsers fetches users filtered by role', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => [MOCK_USER],
        });

        const { result } = renderHook(() => useGetAllUsers(TEST_ROLE), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`role=${TEST_ROLE}`),
            expect.anything()
        );
    });

    test('useGetUserById fetches a specific user', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => MOCK_USER,
        });

        const { result } = renderHook(() => useGetUserById(TEST_USER_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(MOCK_USER);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`${API_BASE_URL}/users/${TEST_USER_ID}`),
            expect.objectContaining({ credentials: 'include' })
        );
    });

    test('useCreateUser POSTs a new user', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => MOCK_USER,
        });

        const { result } = renderHook(() => useCreateUser(), { wrapper: createWrapper() });

        const newUser = {
            email: TEST_EMAIL,
            role: TEST_ROLE,
            password: TEST_PASSWORD,
            name: 'New User'
        };

        result.current.mutate(newUser as any);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`${API_BASE_URL}/users`),
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining(TEST_EMAIL)
            })
        );
    });

    test('useUpdateUser PUTs user updates', async () => {
        const updatedUser = { ...MOCK_USER, name: 'Updated Name' };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => updatedUser,
        });

        const { result } = renderHook(() => useUpdateUser(), { wrapper: createWrapper() });

        result.current.mutate({
            id: TEST_USER_ID,
            data: { name: 'Updated Name' }
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(updatedUser);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`${API_BASE_URL}/users/${TEST_USER_ID}`),
            expect.objectContaining({
                method: 'PUT',
                body: expect.stringContaining('Updated Name')
            })
        );
    });

    test('useDeleteUser DELETEs a user', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        const { result } = renderHook(() => useDeleteUser(), { wrapper: createWrapper() });

        result.current.mutate(TEST_USER_ID);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`${API_BASE_URL}/users/${TEST_USER_ID}`),
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    test('useUpdateUserStatus PATCHes user status', async () => {
        const activeUser = { ...MOCK_USER, status: TEST_STATUS };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => activeUser,
        });

        const { result } = renderHook(() => useUpdateUserStatus(), { wrapper: createWrapper() });

        result.current.mutate({
            id: TEST_USER_ID,
            status: TEST_STATUS
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.status).toBe(TEST_STATUS);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`${API_BASE_URL}/users/${TEST_USER_ID}/status`),
            expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({ status: TEST_STATUS })
            })
        );
    });
});