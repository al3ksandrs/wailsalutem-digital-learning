import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLogin, useRegisterTeacher, useRegisterStudent, useLogout, useAuthSession } from '../../services/authService';
import { Role, UserStatus } from '@common/types';

const API_URL = 'http://localhost:3000/api/auth';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';
const TEACHER_ROLE = 'Teacher';
const STUDENT_ROLE = 'Student';
const USER_ID = 1;
const TEACHER_ID = 2;
const STUDENT_ID = 3;
const UNAUTHORIZED_STATUS = 401;

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

describe('authService', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('useLogin performs login successfully', async () => {
        const mockUser = { id: USER_ID, email: TEST_EMAIL, role: Role.Student };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser }),
        });

        const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

        result.current.mutate({ email: TEST_EMAIL, password: TEST_PASSWORD });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockUser);
        expect(globalThis.fetch).toHaveBeenCalledWith(`${API_URL}/login`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
        }));
    });

    test('useLogin handles invalid credentials', async () => {
        const errorMessage = 'Invalid credentials';
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: errorMessage }),
        });

        const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() });

        result.current.mutate({ email: TEST_EMAIL, password: TEST_PASSWORD });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toEqual(new Error(errorMessage));
    });

    test('useRegisterTeacher registers a teacher successfully', async () => {
        const mockTeacher = { id: TEACHER_ID, email: TEST_EMAIL, role: Role.Teacher, status: UserStatus.Pending };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockTeacher }),
        });

        const { result } = renderHook(() => useRegisterTeacher(), { wrapper: createWrapper() });

        const registerData = {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            name: 'John Doe',
            expertise: 'Mathematics',
            subjects: ['Math'],
            role: Role.Teacher
        };

        result.current.mutate(registerData);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(`${API_URL}/register`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ ...registerData, role: TEACHER_ROLE }),
        }));
    });

    test('useRegisterStudent registers a student successfully', async () => {
        const mockStudent = { id: STUDENT_ID, email: TEST_EMAIL, role: Role.Student };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockStudent }),
        });

        const { result } = renderHook(() => useRegisterStudent(), { wrapper: createWrapper() });

        const registerData = {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            firstName: 'Jane',
            lastName: 'Doe',
            educationLevel: 'VWO',
            year: 4,
        };

        result.current.mutate(registerData as any);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(`${API_URL}/register`, expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ ...registerData, role: STUDENT_ROLE }),
        }));
    });

    test('useLogout logs out successfully', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() });

        result.current.mutate();

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(globalThis.fetch).toHaveBeenCalledWith(`${API_URL}/logout`, expect.any(Object));
    });

    test('useAuthSession fetches current user', async () => {
        const mockUser = { id: USER_ID, name: 'Session User' };
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ user: mockUser }),
        });

        const { result } = renderHook(() => useAuthSession(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockUser);
        expect(globalThis.fetch).toHaveBeenCalledWith(`${API_URL}/me`, expect.objectContaining({ method: 'GET' }));
    });

    test('useAuthSession handles unauthenticated state', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: false,
            status: UNAUTHORIZED_STATUS,
        });

        const { result } = renderHook(() => useAuthSession(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error).toBeDefined();
    });
});