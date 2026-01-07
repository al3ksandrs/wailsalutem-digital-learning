import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGetInbox, useGetConversation, useSendMessage } from '../../services/messageService';

const SENDER_ID = 2;
const RECEIVER_ID = 1;
const NEW_MESSAGE_CONTENT = 'Hello Teacher!';

const MOCK_MESSAGE_RESPONSE = {
    id: 101,
    senderId: SENDER_ID,
    receiverId: RECEIVER_ID,
    content: NEW_MESSAGE_CONTENT,
    timestamp: new Date().toISOString(),
    read: false
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

describe('messageService', () => {
    beforeEach(() => {
        globalThis.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('useGetInbox fetches inbox messages', async () => {
        const mockInbox = [MOCK_MESSAGE_RESPONSE];
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockInbox,
        });

        const { result } = renderHook(() => useGetInbox(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockInbox);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/messages/inbox'),
            expect.objectContaining({ credentials: 'include' })
        );
    });

    test('useGetConversation fetches messages between users', async () => {
        const mockConversation = [MOCK_MESSAGE_RESPONSE];
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockConversation,
        });

        const { result } = renderHook(() => useGetConversation(RECEIVER_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockConversation);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/messages/${RECEIVER_ID}`),
            expect.anything()
        );
    });

    test('useSendMessage sends a new message via POST', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => MOCK_MESSAGE_RESPONSE,
        });

        const { result } = renderHook(() => useSendMessage(), { wrapper: createWrapper() });

        result.current.mutate({
            receiverId: RECEIVER_ID,
            content: NEW_MESSAGE_CONTENT
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(MOCK_MESSAGE_RESPONSE);
        expect(globalThis.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/messages'),
            expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining(NEW_MESSAGE_CONTENT)
            })
        );
    });
});