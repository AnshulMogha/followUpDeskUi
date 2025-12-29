import api from './api';

export interface Remark {
  id: number;
  recordId: number;
  remark: string;
  isInitial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RemarksResponse {
  remarks: Remark[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AddRemarkData {
  remark: string;
}

export const remarkService = {
  getRemarks: async (recordId: number, page: number = 1, limit: number = 20): Promise<RemarksResponse> => {
    const response = await api.get(`/records/${recordId}/remarks`, {
      params: { page, limit },
    });
    return response.data.data;
  },

  addRemark: async (recordId: number, data: AddRemarkData): Promise<Remark> => {
    const response = await api.post(`/records/${recordId}/remarks`, data);
    return response.data.data;
  },

  updateRemark: async (recordId: number, remarkId: number, data: AddRemarkData): Promise<Remark> => {
    const response = await api.patch(`/records/${recordId}/remarks/${remarkId}`, data);
    return response.data.data;
  },

  deleteRemark: async (recordId: number, remarkId: number): Promise<void> => {
    await api.delete(`/records/${recordId}/remarks/${remarkId}`);
  },
};

