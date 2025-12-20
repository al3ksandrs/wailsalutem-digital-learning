import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MOCK_API_DELAY_MS, MOCK_REQUESTS } from './mockData';
import { type HelpRequest, type RequestStatus } from '../../../common/types';

const REQUESTS_KEY = 'requests';
const REQUEST_DETAIL_KEY = 'requestDetail';

type CreateRequestParams = Omit<HelpRequest, 'id' | 'status'>;
type UpdateStatusParams = { requestId: number; status: RequestStatus };
type UpdateRequestParams = { requestId: number; description: string };

// Mock data fetching until real routes are complete
const fetchRequests = async (userId: number): Promise<HelpRequest[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const requests = MOCK_REQUESTS.filter(r => 
                r.studentId === userId || r.assignedTeacherId === userId
            );
            resolve(requests);
        }, MOCK_API_DELAY_MS);
    });
};

const fetchAllRequests = async (): Promise<HelpRequest[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_REQUESTS);
        }, MOCK_API_DELAY_MS);
    });
};

const fetchRequestById = async (requestId: number): Promise<HelpRequest> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const request = MOCK_REQUESTS.find(r => r.id === requestId);
            if (request) {
                resolve(request);
            } else {
                reject(new Error('Request not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

const createRequest = async (data: CreateRequestParams): Promise<HelpRequest> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newRequest: HelpRequest = {
                ...data,
                id: Math.floor(Math.random() * 10000),
                status: 'pending' as RequestStatus
            };
            MOCK_REQUESTS.push(newRequest);
            resolve(newRequest);
        }, MOCK_API_DELAY_MS);
    });
};

const updateRequestStatus = async ({ requestId, status }: UpdateStatusParams): Promise<HelpRequest> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const request = MOCK_REQUESTS.find(r => r.id === requestId);
            if (request) {
                request.status = status;
                resolve(request);
            } else {
                reject(new Error('Request not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

const updateRequest = async ({ requestId, description }: UpdateRequestParams): Promise<HelpRequest> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const request = MOCK_REQUESTS.find(r => r.id === requestId);
            if (request) {
                request.description = description;
                resolve(request);
            } else {
                reject(new Error('Request not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

const deleteRequest = async (requestId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = MOCK_REQUESTS.findIndex(r => r.id === requestId);
            if (index > -1) {
                MOCK_REQUESTS.splice(index, 1);
                resolve();
            } else {
                reject(new Error('Request not found'));
            }
        }, MOCK_API_DELAY_MS);
    });
};

// React query hooks
export const useGetRequests = (userId: number) => {
    return useQuery({
        queryKey: [REQUESTS_KEY, userId],
        queryFn: () => fetchRequests(userId),
        enabled: !!userId
    });
};

export const useGetAllRequests = () => {
    return useQuery({
        queryKey: [REQUESTS_KEY, 'all'],
        queryFn: fetchAllRequests,
    });
};

export const useGetRequestById = (requestId: number) => {
    return useQuery({
        queryKey: [REQUEST_DETAIL_KEY, requestId],
        queryFn: () => fetchRequestById(requestId),
        enabled: !!requestId
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

export const useUpdateRequestStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRequestStatus,
        onSuccess: (updatedRequest) => {
            queryClient.invalidateQueries({ queryKey: [REQUESTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [REQUEST_DETAIL_KEY, updatedRequest.id] });
        }
    });
};

export const useUpdateRequest = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRequest,
        onSuccess: (updatedRequest) => {
            queryClient.invalidateQueries({ queryKey: [REQUESTS_KEY] });
            queryClient.invalidateQueries({ queryKey: [REQUEST_DETAIL_KEY, updatedRequest.id] });
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