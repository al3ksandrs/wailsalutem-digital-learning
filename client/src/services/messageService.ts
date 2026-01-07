import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Message } from '../../../common/types';

const MESSAGES_KEY = 'messages';
const INBOX_KEY = 'inbox';
const API_URL = 'http://localhost:3000/api/messages';
const REFRESH_INTERVAL_MS = 5000;

type SendMessageParams = {
  receiverId: number;
  content: string;
  attachments?: string[];
};

const getInbox = async (): Promise<any[]> => {
  const response = await fetch(`${API_URL}/inbox`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch inbox');
  return response.json();
};

const getConversation = async (otherUserId: number): Promise<Message[]> => {
  const response = await fetch(`${API_URL}/${otherUserId}`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch conversation');
  return response.json();
};

const sendMessage = async (data: SendMessageParams): Promise<Message> => {
  const response = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

// React query hooks
export const useGetInbox = () => {
  return useQuery({
    queryKey: [INBOX_KEY],
    queryFn: getInbox,
  });
};

export const useGetConversation = (otherUserId: number) => {
  return useQuery({
    queryKey: [MESSAGES_KEY, otherUserId],
    queryFn: () => getConversation(otherUserId),
    enabled: !!otherUserId,
    refetchInterval: REFRESH_INTERVAL_MS, 
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (newMessage) => {
      queryClient.invalidateQueries({ 
        queryKey: [MESSAGES_KEY, newMessage.receiverId] 
      });
      queryClient.invalidateQueries({ queryKey: [INBOX_KEY] });
    },
  });
};