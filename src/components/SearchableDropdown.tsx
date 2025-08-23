// src/components/SearchableDropdown.tsx
'use client';
import { useState } from 'react';
import { Combobox } from '@headlessui/react';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import clsx from 'clsx';

// Generic type for items, they must have an `_id` and a `name`
interface Item {
  _id: string;
  name: string;
  [key: string]: any; // Allows for other properties like 'phone'
}

interface SearchableDropdownProps {
  items: Item[];
  selected: Item | null;
  setSelected: (item: Item | null) => void;
  placeholder: string;
  displayValue: (item: Item) => string;
}

export default function SearchableDropdown({ items, selected, setSelected, placeholder, displayValue }: SearchableDropdownProps) {
  const [query, setQuery] = useState('');

  const filteredItems =
    query === ''
      ? items
      : items.filter((item) => {
          return displayValue(item).toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative">
        <Combobox.Input
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm text-slate-800"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(item: Item) => (item ? displayValue(item) : '')}
          placeholder={placeholder}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <FiChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredItems.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <Combobox.Option
                key={item._id}
                value={item}
                className={({ active }) =>
                  clsx(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-blue-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={clsx('block truncate', selected && 'font-semibold')}>
                        {displayValue(item)}
                    </span>
                    {selected && (
                      <span
                        className={clsx(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-blue-600'
                        )}
                      >
                        <FiCheck className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}