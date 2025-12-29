import { useState, useEffect } from 'react';
import type { RecordFilters as RecordFiltersType } from '../services/recordService';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface RecordFiltersProps {
  filters: RecordFiltersType;
  onFilterChange: (filters: Partial<RecordFiltersType>) => void;
  onClear: () => void;
  isAdmin: boolean;
}

export const RecordFilters = ({ filters, onFilterChange, onClear }: RecordFiltersProps) => {
  const [localFilters, setLocalFilters] = useState({
    ledger: filters.ledger || '',
    phoneNo: filters.phoneNo || '',
    search: filters.search || '',
    paymentExpected: filters.paymentExpected,
    paymentExpectedDateFrom: filters.paymentExpectedDateFrom || '',
    paymentExpectedDateTo: filters.paymentExpectedDateTo || '',
  });

  useEffect(() => {
    setLocalFilters({
      ledger: filters.ledger || '',
      phoneNo: filters.phoneNo || '',
      search: filters.search || '',
      paymentExpected: filters.paymentExpected,
      paymentExpectedDateFrom: filters.paymentExpectedDateFrom || '',
      paymentExpectedDateTo: filters.paymentExpectedDateTo || '',
    });
  }, [filters]);

  const handleApply = () => {
    onFilterChange(localFilters);
  };

  const handleClear = () => {
    const cleared = {
      ledger: '',
      phoneNo: '',
      search: '',
      paymentExpected: undefined,
      paymentExpectedDateFrom: '',
      paymentExpectedDateTo: '',
    };
    setLocalFilters(cleared);
    onClear();
  };

  const hasActiveFilters = 
    localFilters.ledger ||
    localFilters.phoneNo ||
    localFilters.search ||
    localFilters.paymentExpected !== undefined ||
    localFilters.paymentExpectedDateFrom ||
    localFilters.paymentExpectedDateTo;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <span>Filter Records</span>
          {hasActiveFilters && (
            <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs font-semibold">
              Active
            </span>
          )}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
          >
            <XMarkIcon className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search (Person Name)
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Search by name..."
              value={localFilters.search}
              onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ledger
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Filter by ledger..."
              value={localFilters.ledger}
              onChange={(e) => setLocalFilters({ ...localFilters, ledger: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="Filter by phone..."
              value={localFilters.phoneNo}
              onChange={(e) => setLocalFilters({ ...localFilters, phoneNo: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Expected
            </label>
            <select
              className="input-field"
              value={localFilters.paymentExpected === undefined ? '' : String(localFilters.paymentExpected)}
              onChange={(e) => {
                const value = e.target.value;
                setLocalFilters({
                  ...localFilters,
                  paymentExpected: value === '' ? undefined : value === 'true',
                });
              }}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date From
            </label>
            <input
              type="date"
              className="input-field"
              value={localFilters.paymentExpectedDateFrom}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, paymentExpectedDateFrom: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date To
            </label>
            <input
              type="date"
              className="input-field"
              value={localFilters.paymentExpectedDateTo}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, paymentExpectedDateTo: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button onClick={handleClear} className="btn-secondary">
            Clear
          </button>
          <button onClick={handleApply} className="btn-primary">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

