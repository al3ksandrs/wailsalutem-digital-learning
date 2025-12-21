import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect } from 'vitest';
import { useGetMessages, useSendMessage, useUpdateMessage, useDeleteMessage } from '../../services/messageService';
import { MOCK_MESSAGES } from '../../services/mockData';

const SENDER_ID = 2;
const RECEIVER_ID = 1;
const EXISTING_MESSAGE_ID = 1;
const NEW_MESSAGE_CONTENT = 'Hello Teacher!';
const UPDATED_CONTENT = 'Edited message content';

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
    test('useGetMessages fetches conversation between two users', async () => {
        const { result } = renderHook(() => useGetMessages(SENDER_ID, RECEIVER_ID), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toBeDefined();

        const correctConversation = result.current.data?.every(m => 
            (m.senderId === SENDER_ID && m.receiverId === RECEIVER_ID) ||
            (m.senderId === RECEIVER_ID && m.receiverId === SENDER_ID)
        );
        expect(correctConversation).toBe(true);
    });

    test('useSendMessage sends a new message', async () => {
        const { result } = renderHook(() => useSendMessage(), { wrapper: createWrapper() });

        result.current.mutate({
            senderId: SENDER_ID,
            receiverId: RECEIVER_ID,
            content: NEW_MESSAGE_CONTENT
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.content).toBe(NEW_MESSAGE_CONTENT);

        const exists = MOCK_MESSAGES.find(m => m.content === NEW_MESSAGE_CONTENT);
        expect(exists).toBeDefined();
    });

    test('useUpdateMessage edits a message', async () => {
        const { result } = renderHook(() => useUpdateMessage(), { wrapper: createWrapper() });

        result.current.mutate({ messageId: EXISTING_MESSAGE_ID, content: UPDATED_CONTENT });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.content).toBe(UPDATED_CONTENT);

        const updated = MOCK_MESSAGES.find(m => m.id === EXISTING_MESSAGE_ID);
        expect(updated?.content).toBe(UPDATED_CONTENT);
    });

    test('useDeleteMessage deletes a message', async () => {
        const { result } = renderHook(() => useDeleteMessage(), { wrapper: createWrapper() });
        const messageToDelete = MOCK_MESSAGES[0];

        result.current.mutate(messageToDelete.id);

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const exists = MOCK_MESSAGES.find(m => m.id === messageToDelete.id);
        expect(exists).toBeUndefined();
    });
});