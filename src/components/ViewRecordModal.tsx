import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Record } from '../services/recordService';
import { RemarksSection } from './RemarksSection';
import { format } from 'date-fns';

interface ViewRecordModalProps {
  record: Record;
  onClose: () => void;
}

export const ViewRecordModal = ({ record, onClose }: ViewRecordModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Record Details #{record.serialNumber}
            </h2>
            <p className="text-sm text-gray-500 mt-1">View complete record information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Record Details */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Serial Number</span>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                #{record.serialNumber}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Ledger</span>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                {record.ledger}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Person Name</span>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                {record.personName}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Phone Number</span>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                {record.phoneNo}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Outstanding Amount</span>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                ₹{record.outstanding.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Payment Expected</span>
              <div className="mt-1">
                {record.paymentExpected !== undefined ? (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      record.paymentExpected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {record.paymentExpected ? 'Yes' : 'No'}
                  </span>
                ) : (
                  <span className="text-gray-400">Not set</span>
                )}
              </div>
            </div>

            {record.paymentExpectedDate && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-500">Payment Expected Date</span>
                <div className="text-lg font-semibold text-gray-900 mt-1">
                  {format(new Date(record.paymentExpectedDate), 'dd MMM yyyy')}
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Created At</span>
              <div className="text-sm text-gray-900 mt-1">
                {format(new Date(record.createdAt), 'dd MMM yyyy, HH:mm')}
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-500">Last Updated</span>
              <div className="text-sm text-gray-900 mt-1">
                {format(new Date(record.updatedAt), 'dd MMM yyyy, HH:mm')}
              </div>
            </div>
          </div>
        </div>

        {/* Remarks Section */}
        <div className="mt-6 border-t pt-6">
          <RemarksSection recordId={record.id} />
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6 pt-6 border-t">
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

