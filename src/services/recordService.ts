import api from './api';

export interface Record {
  id: number;
  serialNumber: number;
  ledger: string;
  outstanding: number;
  personName: string;
  phoneNo: string;
  paymentExpected?: boolean;
  paymentExpectedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordFilters {
  ledger?: string;
  phoneNo?: string;
  paymentExpected?: boolean;
  paymentExpectedDateFrom?: string;
  paymentExpectedDateTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface RecordsResponse {
  records: Record[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UpdateRecordData {
  paymentExpected?: boolean;
  paymentExpectedDate?: string;
}

export const recordService = {
  getRecords: async (filters: RecordFilters = {}): Promise<RecordsResponse> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get(`/records?${params.toString()}`);
    return response.data.data;
  },

  getRecordById: async (id: number): Promise<Record> => {
    const response = await api.get(`/records/${id}`);
    return response.data.data;
  },

  updateRecord: async (id: number, data: UpdateRecordData): Promise<Record> => {
    const response = await api.patch(`/records/${id}`, data);
    return response.data.data;
  },

  uploadExcel: async (file: File): Promise<{ count: number; records: Record[] }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/records/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  downloadRecords: async (filters: RecordFilters = {}): Promise<Blob> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get(`/records/download?${params.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  },
};

