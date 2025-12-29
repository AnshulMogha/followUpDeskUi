import { useState, useEffect } from 'react';
import { remarkService, type Remark } from '../services/remarkService';
import { useAuth } from '../context/AuthContext';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface RemarksSectionProps {
  recordId: number;
}

export const RemarksSection = ({ recordId }: RemarksSectionProps) => {
  const { isAdmin } = useAuth();
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRemark, setNewRemark] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRemarks = async (page: number = 1) => {
    if (!recordId) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await remarkService.getRemarks(recordId, page, pagination.limit);
      setRemarks(response.remarks);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load remarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (recordId) {
      loadRemarks(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  const handleAddRemark = async () => {
    if (!newRemark.trim()) {
      setError('Please enter a remark');
      return;
    }

    try {
      setError('');
      await remarkService.addRemark(recordId, { remark: newRemark.trim() });
      setNewRemark('');
      setShowAddForm(false);
      setSuccess('Remark added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadRemarks(1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add remark');
    }
  };

  const handleStartEdit = (remark: Remark) => {
    setEditingId(remark.id);
    setEditText(remark.remark);
    setError('');
  };

  const handleUpdateRemark = async (remarkId: number) => {
    if (!editText.trim()) {
      setError('Please enter a remark');
      return;
    }

    try {
      setError('');
      await remarkService.updateRemark(recordId, remarkId, { remark: editText.trim() });
      setEditingId(null);
      setEditText('');
      setSuccess('Remark updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadRemarks(pagination.page);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update remark');
    }
  };

  const handleDeleteRemark = async (remarkId: number) => {
    if (!confirm('Are you sure you want to delete this remark?')) {
      return;
    }

    try {
      setError('');
      await remarkService.deleteRemark(recordId, remarkId);
      setSuccess('Remark deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      loadRemarks(pagination.page);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete remark');
    }
  };

  const handlePageChange = (page: number) => {
    loadRemarks(page);
  };

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Remarks History</h3>
          <p className="text-xs text-gray-500 mt-1">
            {pagination.total > 0 
              ? `${pagination.total} remark${pagination.total !== 1 ? 's' : ''} total`
              : 'No remarks yet'}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center space-x-2 text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Remark</span>
          </button>
        )}
      </div>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add Remark Form */}
      {showAddForm && isAdmin && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Remark <span className="text-gray-400">(Max 1000 characters)</span>
          </label>
          <textarea
            className="input-field w-full"
            rows={3}
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
            placeholder="Enter your remark..."
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {newRemark.length}/1000 characters
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewRemark('');
                }}
                className="btn-secondary text-sm"
              >
                Cancel
              </button>
              <button onClick={handleAddRemark} className="btn-primary text-sm">
                Add Remark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remarks List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : remarks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No remarks yet. {isAdmin && 'Add the first remark to get started.'}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {remarks.map((remark) => (
              <div
                key={remark.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {remark.isInitial && (
                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                          Initial Remark
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {format(new Date(remark.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    {editingId === remark.id ? (
                      <div className="space-y-2">
                        <textarea
                          className="input-field w-full"
                          rows={3}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          maxLength={1000}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {editText.length}/1000 characters
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditText('');
                              }}
                              className="btn-secondary text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateRemark(remark.id)}
                              className="btn-primary text-sm"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-900 whitespace-pre-wrap">{remark.remark}</p>
                    )}
                  </div>
                  {isAdmin && editingId !== remark.id && (
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleStartEdit(remark)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit remark"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      {!remark.isInitial && (
                        <button
                          onClick={() => handleDeleteRemark(remark.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete remark"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} remarks
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="btn-secondary disabled:opacity-50 text-sm"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn-secondary disabled:opacity-50 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

