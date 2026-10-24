import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAdd, MdHealthAndSafety, MdRefresh } from 'react-icons/md';

import {
  Button,
  EmptyState,
  Notice,
  PageHeader,
  PoultraScanLoader,
  Surface,
} from '../../../components/index';
import { useScanHistory } from '../hooks/useScanHistory';
import { FilterBar, Pagination, ScanCard, ScanDetailModal, ScanRow } from '../components/index';

export default function ScanHistory() {
  const navigate = useNavigate();

  const [selectedScan, setSelectedScan] = useState(null);
  const {
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
    refetch,
  } = useScanHistory();

  return (
    <div>
      <PageHeader
        eyebrow="Records"
        title="Scan history"
        description="Review and manage past AI diagnostic scans across all facilities."
        actions={
          <Button onClick={() => navigate('/scan')}>
            <MdAdd className="text-lg" aria-hidden="true" />
            New scan
          </Button>
        }
      />

      <div className="mt-8">
        <FilterBar filters={filters} onChange={updateFilters} />

        {error && (
          <Notice
            tone="error"
            title="Could not load scan history"
            className="mb-5"
            action={
              <Button variant="danger-ghost" size="sm" onClick={refetch}>
                <MdRefresh className="text-base" aria-hidden="true" />
                Try again
              </Button>
            }
          >
            {error}
          </Notice>
        )}

        <Surface padding="none">
          <div className="p-3 sm:p-4 md:p-6">
            {loading ? (
              <div className="py-16">
                <PoultraScanLoader size={48} label="Loading scan history..." />
              </div>
            ) : scans.length === 0 ? (
              <EmptyState
                icon={MdHealthAndSafety}
                title="No scans yet"
                description="Run your first scan to see it here."
                className="border-0 bg-transparent"
                action={
                  <Button onClick={() => navigate('/scan')}>
                    <MdAdd className="text-lg" aria-hidden="true" />
                    Run a scan
                  </Button>
                }
              />
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[720px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-ink/10">
                        <th className="pb-3 pl-2 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
                          Image
                        </th>
                        <th className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
                          Date &amp; time
                        </th>
                        <th className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
                          Farm / location
                        </th>
                        <th className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
                          Health
                        </th>
                        <th className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
                          Market ready
                        </th>
                        <th className="px-3 pb-3 text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
                          Status
                        </th>
                        <th className="pb-3 pr-2 text-right text-[9px] font-bold uppercase tracking-[0.14em] text-olive">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {scans.map((scan) => (
                        <ScanRow
                          key={scan.summary_id}
                          scan={scan}
                          onDelete={removeScan}
                          onView={setSelectedScan}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 md:hidden">
                  {scans.map((scan) => (
                    <ScanCard
                      key={scan.summary_id}
                      scan={scan}
                      onDelete={removeScan}
                      onView={setSelectedScan}
                    />
                  ))}
                </div>

                <Pagination
                  page={page}
                  hasMore={hasMore}
                  onPrev={prevPage}
                  onNext={nextPage}
                  count={scans.length}
                />
              </>
            )}
          </div>
        </Surface>
      </div>

      <ScanDetailModal scan={selectedScan} onClose={() => setSelectedScan(null)} />
    </div>
  );
}
