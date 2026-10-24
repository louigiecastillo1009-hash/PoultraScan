import { useState, useEffect, useCallback } from 'react';
import { getScanHistory, deleteScanSummary } from '../api/scanHistoryApi';

const PAGE_SIZE = 10;

export function useScanHistory() {
  const [scans, setScans] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState({ search: '', farmId: '', dateFrom: '', dateTo: '' });

  const fetchPage = useCallback(async (pageNum, currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const skip = (pageNum - 1) * PAGE_SIZE;
      const data = await getScanHistory({ skip, limit: PAGE_SIZE, ...currentFilters });
      setScans(data);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError(err.message || 'Failed to load scan history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(page, filters);
  }, [page, filters, fetchPage]);

  const updateFilters = useCallback((newFilters) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const nextPage = () => {
    if (hasMore) setPage((p) => p + 1);
  };

  const prevPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const removeScan = async (summaryId) => {
    const prevScans = scans;
    setScans((s) => s.filter((item) => item.summary_id !== summaryId));
    try {
      await deleteScanSummary(summaryId);
    } catch (err) {
      setScans(prevScans);
      setError(err.message || 'Failed to delete scan.');
    }
  };

  return {
    scans,
    page,
    hasMore,
    loading,
    error,
    filters,
    updateFilters,
    nextPage,
    prevPage,
    removeScan,
    refetch: () => fetchPage(page, filters),
  };
}