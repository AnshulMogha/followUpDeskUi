import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { recordService } from '../services/recordService';
import type { Record, UpdateRecordData } from '../services/recordService';
import { RemarksSection } from './RemarksSection';

interface UpdateRecordModalProps {
  record: Record;
  onClose: () => void;
  onSuccess: () => void;
}

export const UpdateRecordModal = ({ record, onClose, onSuccess }: UpdateRecordModalProps) => {
  const [formData, setFormData] = useState<UpdateRecordData>({
    paymentExpected: record.paymentExpected,
    paymentExpectedDate: record.paymentExpectedDate
      ? record.paymentExpectedDate.split('T')[0]
      : '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [remarksKey, setRemarksKey] = useState(0); // Key to force remarks refresh

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await recordService.updateRecord(record.id, formData);
      // Refresh remarks section
      setRemarksKey(prev => prev + 1);
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.error) {
        setErrors({ submit: err.response.data.error });
      } else {
        setErrors({ submit: 'Failed to update record. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Update Record #{record.serialNumber}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Edit record details • View and manage remarks below
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Read-only info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Ledger:</span>
              <div className="font-medium text-gray-900">{record.ledger}</div>
            </div>
            <div>
              <span className="text-gray-500">Person:</span>
              <div className="font-medium text-gray-900">{record.personName}</div>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <div className="font-medium text-gray-900">{record.phoneNo}</div>
            </div>
            <div>
              <span className="text-gray-500">Outstanding:</span>
              <div className="font-medium text-gray-900">
                ₹{record.outstanding.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Expected <span className="text-gray-400">*</span>
              </label>
              <select
                className={`input-field ${errors.paymentExpected ? 'border-red-300' : ''}`}
                value={formData.paymentExpected === undefined ? '' : String(formData.paymentExpected)}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    paymentExpected: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined,
                  });
                  if (errors.paymentExpected) {
                    setErrors({ ...errors, paymentExpected: '' });
                  }
                }}
                required
              >
                <option value="">Select...</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              {errors.paymentExpected && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentExpected}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Expected Date
              </label>
              <input
                type="date"
                className={`input-field ${errors.paymentExpectedDate ? 'border-red-300' : ''}`}
                value={formData.paymentExpectedDate || ''}
                onChange={(e) => {
                  setFormData({ ...formData, paymentExpectedDate: e.target.value });
                  if (errors.paymentExpectedDate) {
                    setErrors({ ...errors, paymentExpectedDate: '' });
                  }
                }}
              />
              {errors.paymentExpectedDate && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentExpectedDate}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 min-w-[120px]"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Record'
              )}
            </button>
          </div>
        </form>

        {/* Remarks Section */}
        <div className="mt-6 border-t pt-6">
          <RemarksSection key={remarksKey} recordId={record.id} />
        </div>
      </div>
    </div>
  );
};
