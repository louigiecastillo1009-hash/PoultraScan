import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdAgriculture,
  MdClose,
  MdErrorOutline,
  MdGridView,
  MdRefresh,
  MdSearch,
  MdTrendingUp,
} from 'react-icons/md';

import { useFarms } from '../hooks/useFarms';
import { useSaveFarm } from '../hooks/useCreateFarm';
import { useActiveFarm } from '../../../context/activeFarmContext';
import { TopNav, BottomNav } from '../../../components/index';

import { EditFarmModal, FarmCard, StatPill } from '../components/index';

export default function FarmsList() {
  const navigate = useNavigate();

  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { farms, loading, error, refetch } = useFarms();
  const { save, loading: saving, error: saveError } = useSaveFarm();
  const { activeFarmId, setActiveFarmId } = useActiveFarm();

  const totalCapacity =
    farms?.reduce((sum, f) => sum + (Number(f.capacity) || 0), 0) ?? 0;
  const activeFarm = farms?.find((f) => f.id === activeFarmId);

  const filteredFarms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return farms;
    return farms?.filter(
      (f) =>
        f.farm_name?.toLowerCase().includes(q) ||
        f.location?.toLowerCase().includes(q)
    );
  }, [farms, query]);

  const handleAddFarm = async (data) => {
    try {
      await save(data, null);
      setAddOpen(false);
      refetch();
    } catch {
      // saveError already set by the hook; modal stays open so user sees it
    }
  };

  const hasFarms = farms?.length > 0;

  return (
    <div className="flex min-h-dvh flex-col bg-[#F4F6F2] text-[#1B2922] antialiased">
      <TopNav />

      <div className="md:hidden">
        <BottomNav />
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-grow px-4 pb-[calc(env(safe-area-inset-bottom)+6.5rem)] pt-[calc(env(safe-area-inset-top)+5.25rem)] sm:px-6 md:pb-14 md:pt-24 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 hidden items-center gap-2 text-[11px] font-medium text-[#7D8B82] sm:flex"
        >
          <span>Workspace</span>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-[#1E4A38]">Farms</span>
        </nav>

        {/* Page hero */}
        <section
          aria-labelledby="farms-title"
          className="relative isolate overflow-hidden rounded-2xl bg-[#143528] shadow-[0_24px_55px_-32px_rgba(20,53,40,0.75)] sm:rounded-3xl"
        >
          <img
            src="/img/hero1.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#102B20]/95 via-[#102B20]/78 to-[#102B20]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#102B20]/65 via-[#102B20]/10 to-transparent sm:bg-none" />
          <div className="ps-grid-overlay absolute inset-0 opacity-10" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#F3E8D2] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C7A76C]" />
                Farm management
              </span>
              <h1
                id="farms-title"
                className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-white sm:text-[34px]"
              >
                My farms
              </h1>
              <p className="mt-1.5 max-w-lg text-[13px] leading-relaxed text-white/75 sm:text-sm">
                Manage your farm profiles and choose which farm receives new
                scans.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F3E8D2] px-5 text-sm font-semibold text-[#173D2D] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.45)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F3E8D2]/60 sm:w-auto"
            >
              <MdAdd className="text-lg" />
              Add new farm
            </button>
          </div>
        </section>

        {/* Summary */}
        <section
          aria-label="Farm summary"
          className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-3"
        >
          <StatPill
            label="Total farms"
            value={farms?.length ?? 0}
            icon={MdGridView}
            caption="Profiles under your account"
            loading={loading}
          />
          <StatPill
            label="Total capacity"
            value={totalCapacity.toLocaleString()}
            icon={MdTrendingUp}
            tone="gold"
            caption="Birds across all farms"
            loading={loading}
          />
          <div className="col-span-2 lg:col-span-1">
            <StatPill
              label="Active scanning farm"
              value={activeFarm?.farm_name || 'None selected'}
              icon={MdAgriculture}
              tone={activeFarm ? 'green' : 'muted'}
              valueClassName="text-[15px] sm:text-[17px]"
              caption={
                activeFarm
                  ? 'New scans are saved to this farm.'
                  : 'Choose a farm below to start saving scans.'
              }
              loading={loading}
            />
          </div>
        </section>

        {/* Farm records */}
        <section aria-labelledby="farm-records-heading" className="mt-7 sm:mt-9">
          <div className="mb-3.5 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h2
                id="farm-records-heading"
                className="text-[17px] font-bold tracking-tight text-[#1B2922]"
              >
                All farms
              </h2>
              {hasFarms && (
                <span className="rounded-full bg-[#ECF1ED] px-2.5 py-1 text-[11px] font-semibold text-[#65746B]">
                  {farms.length} total
                </span>
              )}
            </div>

            {hasFarms && (
              <div className="relative w-full sm:w-[19rem]">
                <MdSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#7D8B82]" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search farms or locations..."
                  aria-label="Search farms"
                  className="h-11 w-full rounded-xl border border-[#DFE6E0] bg-white py-0 pl-10 pr-10 text-[16px] text-[#1B2922] placeholder:text-[#8F9B93] transition-colors focus:border-[#1E4A38] sm:text-sm [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#7D8B82] transition-colors hover:bg-[#ECF1ED] hover:text-[#1B2922]"
                  >
                    <MdClose className="text-base" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse flex-row overflow-hidden rounded-2xl border border-[#DFE6E0] bg-white sm:flex-col"
                >
                  <div className="w-[96px] shrink-0 self-stretch bg-[#ECF1ED] sm:aspect-[16/9] sm:w-full sm:self-auto" />
                  <div className="flex-1 space-y-3 p-3.5 sm:p-5">
                    <div className="h-3.5 w-3/4 rounded bg-[#ECF1ED]" />
                    <div className="h-3 w-full rounded bg-[#F0F4F1]" />
                    <div className="h-3 w-2/3 rounded bg-[#F0F4F1]" />
                    <div className="mt-4 h-9 w-full rounded-lg bg-[#F0F4F1]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="flex flex-col items-center rounded-2xl border border-[#FECACA] bg-white px-5 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#B42318]">
                <MdErrorOutline className="text-2xl" />
              </span>
              <h3 className="mt-3 text-[15px] font-bold text-[#1B2922]">
                Could not load your farms
              </h3>
              <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[#65746B]">
                {error}
              </p>
              <button
                type="button"
                onClick={refetch}
                className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DFE6E0] bg-white px-3.5 text-[13px] font-semibold text-[#1E4A38] transition-colors hover:bg-[#ECF1ED]"
              >
                <MdRefresh className="text-base" />
                Try again
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && hasFarms && filteredFarms?.length > 0 && (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {filteredFarms.map((farm) => (
                <FarmCard
                  key={farm.id}
                  farm={farm}
                  isActive={farm.id === activeFarmId}
                  onSelectActive={() => setActiveFarmId(farm.id)}
                  onOpenDetails={() => navigate(`/farm/${farm.id}`)}
                />
              ))}
            </div>
          )}

          {/* No search matches */}
          {!loading && !error && hasFarms && filteredFarms?.length === 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-[#DFE6E0] bg-white px-5 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECF1ED] text-[#56665C]">
                <MdSearch className="text-2xl" />
              </span>
              <h3 className="mt-3 text-[15px] font-bold text-[#1B2922]">
                No farms match “{query}”
              </h3>
              <p className="mt-1 text-[13px] text-[#65746B]">
                Try a different farm name or location.
              </p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DFE6E0] bg-white px-3.5 text-[13px] font-semibold text-[#1E4A38] transition-colors hover:bg-[#ECF1ED]"
              >
                <MdClose className="text-base" />
                Clear search
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && !hasFarms && (
            <div className="flex flex-col items-center rounded-2xl border border-[#DFE6E0] bg-white px-5 py-14 text-center sm:py-16">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F1EA] text-[#1E4A38]">
                <MdAgriculture className="text-[28px]" />
              </span>
              <h3 className="mt-4 text-[17px] font-bold tracking-tight text-[#1B2922]">
                No farms yet
              </h3>
              <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[#65746B]">
                Add your first farm to start saving scans and tracking flock
                records.
              </p>
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1E4A38] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(40,92,69,0.8)] transition-colors hover:bg-[#173D2D]"
              >
                <MdAdd className="text-lg" />
                Add your first farm
              </button>
            </div>
          )}
        </section>
      </main>

      {addOpen && (
        <EditFarmModal
          farm={null}
          onClose={() => setAddOpen(false)}
          onSave={handleAddFarm}
          saving={saving}
          error={saveError}
        />
      )}
    </div>
  );
}
