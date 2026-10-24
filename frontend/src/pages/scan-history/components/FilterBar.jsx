import { useEffect, useState } from 'react';
import { MdCalendarMonth, MdSearch } from 'react-icons/md';

import { Button, Surface } from '../../../components/index';
import { getMyFarms } from '../../farm/api/farmApi';

export default function FilterBar({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search);
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    getMyFarms()
      .then(setFarms)
      .catch(() => setFarms([]));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== filters.search) onChange({ search });
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, filters.search, onChange]);

  const hasFilters = filters.search || filters.farmId || filters.dateFrom || filters.dateTo;

  return (
    <Surface padding="sm" className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full sm:min-w-[200px] sm:flex-1">
        <MdSearch
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-muted"
          aria-hidden="true"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by farm name..."
          aria-label="Search scans by farm name"
          className="input-field h-11 pl-10 text-[16px] sm:text-sm"
        />
      </div>

      <div className="relative w-full sm:w-[190px]">
        <MdCalendarMonth
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-muted"
          aria-hidden="true"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onChange({ dateTo: event.target.value })}
          aria-label="Show scans up to this date"
          className="input-field h-11 pl-10 pr-2 text-[16px] sm:text-sm"
        />
      </div>

      <select
        value={filters.farmId}
        onChange={(event) => onChange({ farmId: event.target.value })}
        aria-label="Filter by farm"
        className="input-field h-11 w-full cursor-pointer sm:w-[180px]"
      >
        <option value="">All farms</option>
        {farms.map((farm) => (
          <option key={farm.id} value={farm.id}>
            {farm.farm_name}
          </option>
        ))}
      </select>

      {hasFilters && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-11 w-full sm:w-auto"
          onClick={() => {
            setSearch('');
            onChange({ search: '', farmId: '', dateFrom: '', dateTo: '' });
          }}
        >
          Clear filters
        </Button>
      )}
    </Surface>
  );
}
