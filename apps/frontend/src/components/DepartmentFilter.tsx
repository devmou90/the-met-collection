import { Fragment, useMemo, useState } from 'react';
import {
  Button,
  Combobox,
  ComboboxOption,
  ComboboxOptions,
  Label,
  Transition
} from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  XMarkIcon
} from '@heroicons/react/20/solid';
import type { Department } from '../types/api';

interface DepartmentFilterProps {
  departments: Department[];
  value: number | null;
  onChange: (departmentId: number | null) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const normalize = (value: string) => value.trim().toLowerCase();

export const DepartmentFilter = ({
  departments,
  value,
  onChange,
  isLoading = false,
  disabled = false
}: DepartmentFilterProps) => {
  const selectedDepartment = useMemo(() => {
    return (
      departments.find(department => department.departmentId === value) ?? null
    );
  }, [departments, value]);

  const [query, setQuery] = useState('');

  const filteredDepartments = useMemo(() => {
    if (!query) {
      return departments;
    }

    const normalized = normalize(query);
    return departments.filter(department =>
      normalize(department.displayName).includes(normalized)
    );
  }, [departments, query]);

  const handleChange = (department: Department | null) => {
    onChange(department ? department.departmentId : null);
  };

  return (
    <Combobox
      value={selectedDepartment}
      onChange={handleChange}
      disabled={disabled || isLoading}
      by="departmentId"
    >
      <Label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
        Department
      </Label>
      <div className="relative mt-1">
        <div className="relative flex items-center">
          <Combobox.Input
            className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 pr-9 text-sm text-slate-700 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-emerald-400 dark:focus:ring-emerald-500/30"
            displayValue={(department: Department | null) =>
              department?.displayName ?? ''
            }
            onChange={event => setQuery(event.target.value)}
            placeholder={
              isLoading ? 'Loading departments…' : 'Filter by department'
            }
          />
          {selectedDepartment ? (
            <button
              type="button"
              onClick={() => handleChange(null)}
              className="absolute inset-y-0 right-8 flex items-center px-2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear department filter"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          ) : null}
          <Button className="absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
            <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <ComboboxOptions className="absolute z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg focus:outline-none dark:border-slate-700 dark:bg-slate-900">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                Loading departments…
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                No departments match “{query}”.
              </div>
            ) : (
              filteredDepartments.map(department => (
                <ComboboxOption
                  key={department.departmentId}
                  value={department}
                  className={({ active }) =>
                    `flex cursor-pointer items-center gap-2 px-3 py-2 text-sm ${
                      active
                        ? 'bg-emerald-500 text-white'
                        : 'text-slate-700 dark:text-slate-200'
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`flex h-4 w-4 items-center justify-center ${
                          selected ? 'text-white' : 'text-transparent'
                        }`}
                      >
                        <CheckIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span
                        className={`flex-1 ${
                          selected && !active
                            ? 'font-semibold text-emerald-600 dark:text-emerald-300'
                            : ''
                        }`}
                      >
                        {department.displayName}
                      </span>
                    </>
                  )}
                </ComboboxOption>
              ))
            )}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};
