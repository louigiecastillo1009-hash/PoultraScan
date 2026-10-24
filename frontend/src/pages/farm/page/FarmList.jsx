import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdAgriculture,
  MdClose,
  MdGridView,
  MdRefresh,
  MdSearch,
  MdTrendingUp,
} from 'react-icons/md';

import { useFarms } from '../hooks/useFarms';
import { useSaveFarm } from '../hooks/useCreateFarm';
import { useActiveFarm } from '../../../context/activeFarmContext';
import {
  Badge,
  Button,
  EmptyState,
  Notice,
  PageHeader,
} from '../../../components/index';

import { EditFarmModal, FarmCard, StatPill } from '../components/index';

export default function FarmsList() {
  const navigate = useNavigate();

  const [addOpen, setAddOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { farms, loading, error, refetch } = useFarms();
  const { save, loading: saving, error: saveError } = useSaveFarm();
  const { activeFarmId, setActiveFarmId } = useActiveFarm();

  const totalCapacity = farms?.reduce((sum, farm) => sum + (Number(farm.capacity) || 0), 0) ?? 0;
  const activeFarm = farms?.find((farm) => farm.id === activeFarmId);

  const filteredFarms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return farms;
    return farms?.filter(
      (farm) =>
        farm.farm_name?.toLowerCase().includes(q) ||
        farm.location?.toLowerCase().includes(q)
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
    <div>
      <PageHeader
        eyebrow="Farm management"
        title="My farms"
        description="Manage your farm profiles and choose which farm receives new scans."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <MdAdd className="text-lg" aria-hidden="true" />
            Add new farm
          </Button>
        }
      />

      <section aria-label="Farm summary" className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
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
          caption="Chickens across all farms"
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

      <section aria-labelledby="farm-records-heading" className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-2.5">
            <h2
              id="farm-records-heading"
              className="font-display text-[1.5rem] font-medium tracking-[-0.02em] text-ink"
            >
              All farms
            </h2>
            {hasFarms && (
              <Badge tone="neutral" size="sm">
                {farms.length} total
              </Badge>
            )}
          </div>

          {hasFarms && (
            <div className="relative w-full sm:w-[19rem]">
              <MdSearch
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search farms or locations..."
                aria-label="Search farms"
                className="input-field h-11 pl-10 pr-10 text-[16px] sm:text-sm [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream-deep hover:text-ink"
                >
                  <MdClose className="text-base" />
                </button>
              )}
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse flex-row overflow-hidden rounded-[1.5rem] border border-ink/10 bg-paper sm:flex-col"
              >
                <div className="w-[96px] shrink-0 self-stretch bg-cream-deep sm:aspect-[16/9] sm:w-full sm:self-auto" />
                <div className="flex-1 space-y-3 p-4 sm:p-5">
                  <div className="h-3.5 w-3/4 rounded bg-cream-deep" />
                  <div className="h-3 w-full rounded bg-cream-deep/70" />
                  <div className="h-3 w-2/3 rounded bg-cream-deep/70" />
                  <div className="mt-4 h-9 w-full rounded-full bg-cream-deep/70" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <Notice
            tone="error"
            title="Could not load your farms"
            className="mt-4"
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

        {!loading && !error && hasFarms && filteredFarms?.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
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

        {!loading && !error && hasFarms && filteredFarms?.length === 0 && (
          <EmptyState
            icon={MdSearch}
            title={`No farms match “${query}”`}
            description="Try a different farm name or location."
            className="mt-4"
            action={
              <Button variant="secondary" size="sm" onClick={() => setQuery('')}>
                <MdClose className="text-base" aria-hidden="true" />
                Clear search
              </Button>
            }
          />
        )}

        {!loading && !error && !hasFarms && (
          <EmptyState
            icon={MdAgriculture}
            title="No farms yet"
            description="Add your first farm to start saving scans and tracking flock records."
            className="mt-4"
            action={
              <Button onClick={() => setAddOpen(true)}>
                <MdAdd className="text-lg" aria-hidden="true" />
                Add your first farm
              </Button>
            }
          />
        )}
      </section>

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
