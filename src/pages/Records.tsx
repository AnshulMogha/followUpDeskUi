import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { recordService } from '../services/recordService';
import type { Record, RecordFilters } from '../services/recordService';
import { DashboardLayout } from '../components/DashboardLayout';
import { RecordTable } from '../components/RecordTable';
import { RecordFilters as FiltersComponent } from '../components/RecordFilters';
import { UploadModal } from '../components/UploadModal';
import { UpdateRecordModal } from '../components/UpdateRecordModal';
import { ViewRecordModal } from '../components/ViewRecordModal';
import {
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export const Records = () => {
  const { isAdmin } = useAuth();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<RecordFilters>({ page: 1, limit: 20 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Check if user is authenticated before making request
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Please login to view records');
        return;
      }
      
      const response = await recordService.getRecords(filters);
      setRecords(response.records);
      setPagination(response.pagination);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to load records';
      setError(errorMessage);
      
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load records if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (token) {
      loadRecords();
    } else {
      setError('Please login to view records');
      setLoading(false);
    }
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<RecordFilters>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    setSuccess('Records uploaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
    loadRecords();
  };

  const handleViewClick = (record: Record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleUpdateClick = (record: Record) => {
    setSelectedRecord(record);
    setShowUpdateModal(true);
  };

  const handleUpdateSuccess = () => {
    setShowUpdateModal(false);
    setSelectedRecord(null);
    setSuccess('Record updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
    loadRecords();
  };

  const handleDownload = async () => {
    try {
      setError('');
      
      // Check if filters are active
      const hasActiveFilters = 
        filters.ledger || 
        filters.phoneNo || 
        filters.search || 
        filters.paymentExpected !== undefined ||
        filters.paymentExpectedDateFrom ||
        filters.paymentExpectedDateTo;
      
      // Download with current filters (if any)
      const blob = await recordService.downloadRecords(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      // Create filename with filter info if filters are active
      let filename = `records_${new Date().toISOString().split('T')[0]}`;
      if (hasActiveFilters) {
        filename += '_filtered';
      }
      filename += '.xlsx';
      
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      const message = hasActiveFilters 
        ? `Filtered records downloaded successfully! (${pagination.total} records)`
        : 'All records downloaded successfully!';
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download records');
    }
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 20 });
    setShowFilters(false);
  };

  const hasActiveFilters = 
    filters.ledger || 
    filters.phoneNo || 
    filters.search || 
    filters.paymentExpected !== undefined ||
    filters.paymentExpectedDateFrom ||
    filters.paymentExpectedDateTo;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Records Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage all records ({pagination.total} total)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`btn-secondary flex items-center space-x-2 ${
                  hasActiveFilters ? 'bg-primary-50 text-primary-700 border-primary-200' : ''
                }`}
              >
                <FunnelIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-primary-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                    Active
                  </span>
                )}
              </button>
              {isAdmin && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <DocumentArrowUpIcon className="h-5 w-5" />
                  <span className="hidden sm:inline">Upload Excel</span>
                </button>
              )}
              <button
                onClick={handleDownload}
                className="btn-secondary flex items-center space-x-2"
                title={hasActiveFilters ? `Download ${pagination.total} filtered records` : 'Download all records'}
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span className="hidden sm:inline">
                  {hasActiveFilters ? `Download (${pagination.total})` : 'Download All'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-700 hover:text-green-900">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <FiltersComponent
              filters={filters}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
              isAdmin={isAdmin}
            />
          </div>
        )}

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading records...</p>
              </div>
            </div>
          ) : (
            <RecordTable
              records={records}
              pagination={pagination}
              onPageChange={handlePageChange}
              onViewClick={handleViewClick}
              onUpdateClick={isAdmin ? handleUpdateClick : undefined}
            />
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadModal
            onClose={() => setShowUploadModal(false)}
            onSuccess={handleUploadSuccess}
          />
        )}

        {/* View Modal */}
        {showViewModal && selectedRecord && (
          <ViewRecordModal
            record={selectedRecord}
            onClose={() => {
              setShowViewModal(false);
              setSelectedRecord(null);
            }}
          />
        )}

        {/* Update Modal */}
        {showUpdateModal && selectedRecord && (
          <UpdateRecordModal
            record={selectedRecord}
            onClose={() => {
              setShowUpdateModal(false);
              setSelectedRecord(null);
            }}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
