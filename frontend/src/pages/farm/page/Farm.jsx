import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdAgriculture,
  MdArrowBack,
  MdDeleteOutline,
  MdEdit,
  MdErrorOutline,
  MdInsights,
  MdRefresh,
} from 'react-icons/md';

import { useFarm } from '../hooks/useFarm';
import { useSaveFarm } from '../hooks/useCreateFarm';
import { useActiveFarm } from '../../../context/activeFarmContext';
import { deleteFarm } from '../api/farmApi';
import {
  DeleteFarmModal,
  EditFarmModal,
  FarmInfoCard,
  RecentScansTable,
} from '../components/index';
import {
  BottomNav,
  Footer,
  PoultraScanLoader,
  TopNav,
} from '../../../components/index';

export default function FarmDetails() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { activeFarmId } = useActiveFarm();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const { farm, loading, error, refetch } = useFarm(farmId);
  const { save, loading: saving, error: saveError } = useSaveFarm();

  const handleOpenModal = () => {
    setEditOpen(true);
  };

  const handleSaveFarm = async (data) => {
    try {
      await save(data, farm?.id);
      setEditOpen(false);
      refetch();
    } catch {
      // saveError already set by the hook; modal stays open so user sees it
    }
  };

  const handleDeleteFarm = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteFarm(farm.id);
      navigate('/farm');
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete farm. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

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
          <button
            type="button"
            onClick={() => navigate('/farm')}
            className="transition-colors hover:text-[#1E4A38]"
          >
            Farms
          </button>
          <span aria-hidden="true">/</span>
          <span
            className="max-w-[22rem] truncate font-semibold text-[#1E4A38]"
            title={farm?.farm_name || undefined}
          >
            {farm?.farm_name || 'Farm details'}
          </span>
        </nav>

        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={() => navigate('/farm')}
              aria-label="Back to farms"
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DFE6E0] bg-white text-[#56665C] transition-colors hover:border-[#C2D2C8] hover:text-[#1E4A38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A38]/35"
            >
              <MdArrowBack className="text-lg" />
            </button>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7D8B82]">
                Farm profile
              </p>
              <h1 className="mt-1 break-words text-[24px] font-bold leading-tight tracking-tight text-[#1B2922] sm:text-[30px]">
                {farm?.farm_name || 'Farm details'}
              </h1>
              <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-[#65746B] sm:text-sm">
                Manage operations and monitor flock health for this farm.
              </p>
            </div>
          </div>

          <div className="flex w-full shrink-0 gap-2 sm:w-auto">
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E4A38] px-4 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(40,92,69,0.8)] transition-colors hover:bg-[#173D2D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A38]/35 sm:flex-none"
            >
              <MdEdit className="text-lg" />
              {farm ? 'Edit farm' : 'Add farm'}
            </button>
            {farm && (
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#F3CBC7] bg-white px-4 text-sm font-semibold text-[#B42318] transition-colors hover:bg-[#FEF3F2] hover:border-[#EFB7B1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B42318]/25 sm:flex-none"
              >
                <MdDeleteOutline className="text-lg" />
                Delete
              </button>
            )}
          </div>
        </header>

        {loading && (
          <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-[#DFE6E0] bg-white py-16">
            <PoultraScanLoader size={48} label="Loading farm details..." />
          </div>
        )}

        {error && !loading && (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-[#FECACA] bg-white px-5 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#B42318]">
              <MdErrorOutline className="text-2xl" />
            </span>
            <h2 className="mt-3 text-[15px] font-bold text-[#1B2922]">
              Could not load this farm
            </h2>
            <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[#65746B]">
              {error}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={refetch}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#DFE6E0] bg-white px-3.5 text-[13px] font-semibold text-[#1E4A38] transition-colors hover:bg-[#ECF1ED]"
              >
                <MdRefresh className="text-base" />
                Try again
              </button>
              <button
                type="button"
                onClick={() => navigate('/farm')}
                className="inline-flex h-10 items-center rounded-lg px-3.5 text-[13px] font-semibold text-[#65746B] transition-colors hover:bg-[#ECF1ED] hover:text-[#1B2922]"
              >
                Back to farms
              </button>
            </div>
          </div>
        )}

        {!loading && !error && farm && (
          <div className="mt-6 space-y-4 sm:mt-7 sm:space-y-5">
            <FarmInfoCard
              farmName={farm.farm_name}
              location={farm.location}
              capacity={farm.capacity}
              imageUrl={farm.image_url}
              isActive={farm.id === activeFarmId}
            />

            <section
              aria-labelledby="flock-health-heading"
              className="rounded-2xl border border-[#DFE6E0] bg-white p-4 shadow-[0_1px_2px_rgba(38,53,47,0.03)] sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7F0E2] text-[#8A6B2F]">
                  <MdInsights className="text-xl" />
                </span>
                <div className="min-w-0">
                  <h2
                    id="flock-health-heading"
                    className="text-[14px] font-bold text-[#1B2922]"
                  >
                    Flock health overview
                  </h2>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-[#65746B]">
                    Flock stats will appear once scan data is available.
                  </p>
                </div>
              </div>
            </section>

            <RecentScansTable farmId={farm.id} />
          </div>
        )}

        {!loading && !error && !farm && (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-[#DFE6E0] bg-white px-5 py-14 text-center sm:py-16">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F1EA] text-[#1E4A38]">
              <MdAgriculture className="text-[28px]" />
            </span>
            <h2 className="mt-4 text-[17px] font-bold tracking-tight text-[#1B2922]">
              No farm added yet
            </h2>
            <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-[#65746B]">
              Add a farm to start tracking its flock health.
            </p>
            <button
              type="button"
              onClick={handleOpenModal}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1E4A38] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(40,92,69,0.8)] transition-colors hover:bg-[#173D2D]"
            >
              Add your farm
            </button>
          </div>
        )}
      </main>

      {editOpen && (
        <EditFarmModal
          farm={farm}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveFarm}
          saving={saving}
          error={saveError}
        />
      )}

      {deleteOpen && farm && (
        <DeleteFarmModal
          farmName={farm.farm_name}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDeleteFarm}
          deleting={deleting}
          error={deleteError}
        />
      )}

      <Footer />
    </div>
  );
}
