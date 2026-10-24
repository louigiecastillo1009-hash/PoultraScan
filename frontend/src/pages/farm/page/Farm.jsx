import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdAgriculture, MdDeleteOutline, MdEdit, MdRefresh } from 'react-icons/md';

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
  Button,
  EmptyState,
  Notice,
  PageHeader,
  PoultraScanLoader,
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
    <div>
      <PageHeader
        eyebrow="Farm profile"
        backTo="/farm"
        backLabel="All farms"
        title={farm?.farm_name || 'Farm details'}
        description="Manage operations and monitor flock health for this farm."
        actions={
          <>
            <Button onClick={handleOpenModal}>
              <MdEdit className="text-lg" aria-hidden="true" />
              {farm ? 'Edit farm' : 'Add farm'}
            </Button>
            {farm && (
              <Button variant="danger-ghost" onClick={() => setDeleteOpen(true)}>
                <MdDeleteOutline className="text-lg" aria-hidden="true" />
                Delete
              </Button>
            )}
          </>
        }
      />

      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center rounded-[1.5rem] border border-ink/10 bg-paper py-20">
          <PoultraScanLoader size={48} label="Loading farm details..." />
        </div>
      )}

      {error && !loading && (
        <Notice
          tone="error"
          title="Could not load this farm"
          className="mt-8"
          action={
            <div className="flex flex-wrap gap-2">
              <Button variant="danger-ghost" size="sm" onClick={refetch}>
                <MdRefresh className="text-base" aria-hidden="true" />
                Try again
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/farm')}>
                Back to farms
              </Button>
            </div>
          }
        >
          {error}
        </Notice>
      )}

      {!loading && !error && farm && (
        <div className="mt-8 space-y-5">
          <FarmInfoCard
            farmName={farm.farm_name}
            location={farm.location}
            capacity={farm.capacity}
            imageUrl={farm.image_url}
            isActive={farm.id === activeFarmId}
          />

          <RecentScansTable farmId={farm.id} />
        </div>
      )}

      {!loading && !error && !farm && (
        <EmptyState
          icon={MdAgriculture}
          title="No farm added yet"
          description="Add a farm to start tracking its flock health."
          className="mt-8"
          action={
            <Button onClick={handleOpenModal}>
              <MdAgriculture className="text-lg" aria-hidden="true" />
              Add your farm
            </Button>
          }
        />
      )}

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
    </div>
  );
}
