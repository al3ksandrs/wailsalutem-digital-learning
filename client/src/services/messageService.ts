import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_API_DELAY_MS, MOCK_MESSAGES } from './mockData';
import { type Message } from '../../../common/types';

// when we have the API points we will use websockets instead of polling for messages
const MESSAGES_KEY = 'messages';
const MESSAGE_DETAIL_KEY = 'messageDetail';
const REFRESH_INTERVAL_MS = 5000;
const ID_RANGE_MULTIPLIER = 10000;

type SendMessageParams = Omit<Message, 'id' | 'timestamp'>;
type UpdateMessageParams = { messageId: number; content: string };

// Mock data fetching until real routes are complete
const fetchMessages = async (userId: number, otherId: number): Promise<Message[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const messages = MOCK_MESSAGES.filter(m => 
                (m.senderId === userId && m.receiverId === otherId) ||
                (m.senderId === otherId && m.receiverId === userId)
            );
            
            messages.sort((a, b) => 
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            resolve(messages);
        }, MOCK_API_DELAY_MS);
    });
};

const fetchAllMessages = async (): Promise<Message[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_MESSAGES);
        }, MOCK_API_DELAY_MS);
    });
};

const fetchMessageById = async (messageId: number): Promise<Message> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const message = MOCK_MESSAGES.find(m => m.id === messageId);
            if (message) {
                resolve(message);
            } else {
                reject(new Error('Message not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

const sendMessage = async (data: SendMessageParams): Promise<Message> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newMessage: Message = {
                ...data,
                id: Math.floor(Math.random() * ID_RANGE_MULTIPLIER),
                timestamp: new Date().toISOString()
            };
            MOCK_MESSAGES.push(newMessage);
            resolve(newMessage);
        }, MOCK_API_DELAY_MS);
    });
};

const updateMessage = async ({ messageId, content }: UpdateMessageParams): Promise<Message> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const message = MOCK_MESSAGES.find(m => m.id === messageId);
            if (message) {
                message.content = content;
                resolve(message);
            } else {
                reject(new Error('Message not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

const deleteMessage = async (messageId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_MESSAGES.findIndex(m => m.id === messageId);
            if (index > -1) {
                MOCK_MESSAGES.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Message not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

// React query hooks
export const useGetMessages = (userId: number, otherId: number) => {
    return useQuery({
        queryKey: [MESSAGES_KEY, userId, otherId],
        queryFn: () => fetchMessages(userId, otherId),
        enabled: !!userId && !!otherId,
        refetchInterval: REFRESH_INTERVAL_MS 
    });
};

export const useGetAllMessages = () => {
    return useQuery({
        queryKey: [MESSAGES_KEY, 'all'],
        queryFn: fetchAllMessages,
    });
};

export const useGetMessageById = (messageId: number) => {
    return useQuery({
        queryKey: [MESSAGE_DETAIL_KEY, messageId],
        queryFn: () => fetchMessageById(messageId),
        enabled: !!messageId
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: sendMessage,
        onSuccess: (newMessage) => {
            queryClient.invalidateQueries({ 
                queryKey: [MESSAGES_KEY, newMessage.senderId, newMessage.receiverId] 
            });
            queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY, 'all'] });
        }
    });
};

export const useUpdateMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateMessage,
        onSuccess: (updatedMessage) => {
            queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
            queryClient.invalidateQueries({ queryKey: [MESSAGE_DETAIL_KEY, updatedMessage.id] });
        }
    });
};

export const useDeleteMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMessage,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [MESSAGES_KEY] });
            queryClient.invalidateQueries({ queryKey: [MESSAGE_DETAIL_KEY] });
        }
    });
};