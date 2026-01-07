import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type HelpRequest, type RequestStatus } from '../../../common/types';

const REQUESTS_KEY = 'requests';
const STUDENT_API = 'http://localhost:3000/api/student';
const TEACHER_API = 'http://localhost:3000/api/teacher';

type CreateRequestParams = {
  subjectId: number;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
};

type UpdateRequestParams = {
  requestId: number;
  data: Partial<CreateRequestParams>;
};

type UpdateStatusParams = {
  requestId: number;
  status: RequestStatus;
};

// Student endpoints
const fetchMyRequests = async (subjectId?: number): Promise<HelpRequest[]> => {
    const query = subjectId ? `?subjectId=${subjectId}` : '';
    const response = await fetch(`${STUDENT_API}/my-requests${query}`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
};

const fetchPendingRequests = async (): Promise<HelpRequest[]> => {
    const response = await fetch(`${STUDENT_API}/pending-requests`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch pending requests');
    return response.json();
};

const createRequest = async (data: CreateRequestParams): Promise<HelpRequest> => {
    const response = await fetch(`${STUDENT_API}/help-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to create request');
    return response.json();
};

const updateRequest = async ({ requestId, data }: UpdateRequestParams): Promise<HelpRequest> => {
    const response = await fetch(`${STUDENT_API}/help-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update request');
    return response.json();
};

const deleteRequest = async (requestId: number): Promise<void> => {
    const response = await fetch(`${STUDENT_API}/help-requests/${requestId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to delete request');
};

// Teacher endpoints
const fetchTeacherHelpRequests = async (): Promise<HelpRequest[]> => {
    const response = await fetch(`${TEACHER_API}/help-requests`, { credentials: 'include' });
    if (!response.ok) throw new Error('Failed to fetch teacher requests');
    return response.json();
};

const updateRequestStatus = async ({ requestId, status }: UpdateStatusParams): Promise<HelpRequest> => {
    const response = await fetch(`${TEACHER_API}/help-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update request status');
    return response.json();
};

// React query hooks
export const useGetMyRequests = (subjectId?: number) => {
    return useQuery({
        queryKey: [REQUESTS_KEY, 'student-my', subjectId],
        queryFn: () => fetchMyRequests(subjectId),
    });
};

export const useGetPendingRequests = () => {
    return useQuery({
        queryKey: [REQUESTS_KEY, 'student-pending'],
        queryFn: fetchPendingRequests,
    });
};

export const useGetTeacherRequests = () => {
    return useQuery({
        queryKey: [REQUESTS_KEY, 'teacher-assigned'],
        queryFn: fetchTeacherHelpRequests,
    });
};

export const useCreateRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [REQUESTS_KEY] });
        }
    });
};

export const useUpdateRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [REQUESTS_KEY] });
        }
    });
};

export const useDeleteRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [REQUESTS_KEY] });
        }
    });
};

export const useUpdateRequestStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRequestStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [REQUESTS_KEY] });
        }
    });
};