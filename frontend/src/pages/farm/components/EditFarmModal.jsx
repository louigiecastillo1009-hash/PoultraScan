import { useEffect, useState } from 'react';
import { MdEdit, MdImage, MdRefresh } from 'react-icons/md';

import FarmLocationSelect from './FarmLocationSelect';
import FarmModalShell from './FarmModalShell';
import { useFarmLocation, composeFarmAddress } from '../hooks/useFarmLocation';
import { thumbnailSrc } from '../../../utils/thumbnailSrc';

const FORM_ID = 'farm-details-form';

const FIELD_CLASSES =
  'h-11 w-full rounded-xl border border-[#DFE6E0] bg-white px-3.5 text-sm text-[#1B2922] placeholder:text-[#8F9B93] transition-colors focus:border-[#1E4A38]';

const LABEL_CLASSES = 'text-[12px] font-semibold text-[#56665C]';

export default function EditFarmModal({ farm, onClose, onSave, saving, error }) {
  const existingPreview = farm?.image_url ? thumbnailSrc(farm.image_url) : null;

  const [farmName, setFarmName] = useState(farm?.farm_name ?? '');
  const [capacity, setCapacity] = useState(farm?.capacity ?? '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(existingPreview);
  const [locationError, setLocationError] = useState(null);

  const location = useFarmLocation();

  // Revoke object URLs created for local previews so they don't leak when the
  // modal closes or a different photo is selected.
  useEffect(
    () => () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let locationValue;
    setLocationError(null);

    if (location.region) {
      // The user started a fresh selection — it must be completed or fully
      // cleared before submitting, so no half-chosen address is saved.
      if (!location.isComplete) {
        setLocationError('Please complete the location selection or clear the region.');
        return;
      }
      locationValue = composeFarmAddress(location);
    } else if (farm) {
      // Edit mode, picker untouched: keep the previously saved address as-is
      // so existing records stay compatible.
      locationValue = farm.location ?? '';
    } else {
      setLocationError('Please select the farm location from the dropdowns.');
      return;
    }

    onSave({
      farm_name: farmName,
      location: locationValue,
      capacity: capacity === '' ? null : Number(capacity),
      image: imageFile,
    });
  };

  const provinceKnown =
    !location.regionDataState.loading && !location.regionDataState.error;
  const provinceNotApplicable = Boolean(
    location.region && provinceKnown && !location.provincesApplicable
  );
  const cityNeedsProvince = location.provincesApplicable && !location.province;
  const footerError = locationError || error;

  return (
    <FarmModalShell
      title={farm ? 'Edit farm' : 'Add a new farm'}
      description={
        farm
          ? 'Update the farm profile and scan location.'
          : 'Create a farm profile so scans and flock records have a home.'
      }
      icon={farm ? MdEdit : MdImage}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3">
          {footerError && (
            <p
              role="alert"
              className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] font-medium leading-relaxed text-[#B42318]"
            >
              {footerError}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[#DFE6E0] bg-white px-4 text-sm font-semibold text-[#56665C] transition-colors hover:bg-[#ECF1ED] hover:text-[#1B2922] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A38]/35"
            >
              Cancel
            </button>
            <button
              type="submit"
              form={FORM_ID}
              disabled={saving}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1E4A38] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(40,92,69,0.65)] transition-colors hover:bg-[#173D2D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4A38]/35 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Saving...
                </>
              ) : farm ? (
                'Save changes'
              ) : (
                'Add farm'
              )}
            </button>
          </div>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-5">
        <section aria-labelledby="farm-photo-heading" className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span id="farm-photo-heading" className={LABEL_CLASSES}>
              Farm photo
            </span>
            <span className="text-[11px] text-[#65746B]">Optional</span>
          </div>

          <label
            htmlFor="farm-image-input"
            className="group flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#C9D7CE] bg-[#FBFCFA] p-3 transition-colors hover:border-[#1E4A38] hover:bg-[#F4F6F2] focus-within:border-[#1E4A38]"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt=""
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E6F1EA] text-[#1E4A38]">
                <MdImage className="text-xl" />
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-semibold text-[#1B2922]">
                {imageFile ? imageFile.name : previewUrl ? 'Change farm photo' : 'Upload a farm photo'}
              </span>
              <span className="mt-0.5 block text-[11px] text-[#65746B]">
                PNG, JPG or WebP
              </span>
            </span>

            <span className="hidden shrink-0 rounded-lg border border-[#DFE6E0] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-[#56665C] group-hover:border-[#C2D2C8] sm:block">
              Browse
            </span>
          </label>
          <input
            id="farm-image-input"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
        </section>

        <section aria-labelledby="farm-details-heading" className="space-y-4">
          <h3 id="farm-details-heading" className="text-[13px] font-bold text-[#1B2922]">
            Farm details
          </h3>

          <div className="space-y-1.5">
            <label htmlFor="farm-name" className={LABEL_CLASSES}>
              Farm name <span className="text-[#B42318]">*</span>
            </label>
            <input
              id="farm-name"
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              required
              autoComplete="organization"
              placeholder="e.g. San Isidro Poultry Farm"
              className={FIELD_CLASSES}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="farm-capacity" className={LABEL_CLASSES}>
              Capacity
            </label>
            <input
              id="farm-capacity"
              type="number"
              min="0"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              inputMode="numeric"
              placeholder="Number of birds"
              className={FIELD_CLASSES}
            />
            <p className="text-[11px] leading-relaxed text-[#65746B]">
              Optional. You can update this as your flock grows.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="farm-location-heading"
          className="space-y-3 border-t border-[#ECF1ED] pt-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 id="farm-location-heading" className="text-[13px] font-bold text-[#1B2922]">
                Location <span className="text-[#B42318]">*</span>
              </h3>
              <p className="mt-0.5 text-[11px] text-[#65746B]">
                Select from region down to barangay.
              </p>
            </div>
            {farm?.location && (
              <p
                className="max-w-full rounded-lg bg-[#ECF1ED] px-2.5 py-1.5 text-[11px] leading-relaxed text-[#56665C] sm:max-w-[19rem]"
                title={farm.location}
              >
                Current: {farm.location}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FarmLocationSelect
              label="Region"
              placeholder="Select region"
              options={location.regions}
              value={location.region}
              onSelect={location.changeRegion}
              loading={location.regionsState.loading}
              error={location.regionsState.error}
              onRetry={location.retryRegionData}
              loadingMessage="Loading regions..."
            />

            <FarmLocationSelect
              label="Province"
              placeholder="Select province"
              options={location.provinceList}
              value={location.province}
              onSelect={location.changeProvince}
              loading={location.regionDataState.loading}
              error={location.regionDataState.error}
              onRetry={location.retryRegionData}
              disabled={
                !location.region ||
                location.regionDataState.loading ||
                Boolean(location.regionDataState.error)
              }
              notApplicable={provinceNotApplicable}
              loadingMessage="Loading provinces..."
            />

            <FarmLocationSelect
              label="City / Municipality"
              placeholder={
                cityNeedsProvince
                  ? 'Select a province first'
                  : 'Select city / municipality'
              }
              options={location.cityList}
              value={location.city}
              onSelect={location.changeCity}
              loading={cityNeedsProvince ? false : location.cityState.loading}
              error={location.cityState.error}
              onRetry={location.province ? () => location.changeProvince(location.province) : null}
              disabled={
                !location.region ||
                location.regionDataState.loading ||
                Boolean(location.regionDataState.error) ||
                cityNeedsProvince
              }
              loadingMessage="Loading cities and municipalities..."
            />

            <FarmLocationSelect
              label="Barangay"
              placeholder="Select city / municipality first"
              options={location.barangayList}
              value={location.barangay}
              onSelect={location.changeBarangay}
              loading={location.barangayState.loading}
              error={location.barangayState.error}
              onRetry={location.city ? () => location.changeCity(location.city) : null}
              disabled={
                !location.city ||
                (location.provincesApplicable ? location.cityState.loading : false) ||
                location.barangayState.loading
              }
              loadingMessage="Loading barangays..."
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="farm-street" className={LABEL_CLASSES}>
              Street, purok, or subdivision
            </label>
            <input
              id="farm-street"
              type="text"
              value={location.details}
              onChange={(e) => location.setDetails(e.target.value)}
              placeholder="House no., street, sitio / purok, etc. (optional)"
              className={FIELD_CLASSES}
            />
          </div>

          {location.regionsState.error && !location.region && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2">
              <p className="text-[12px] font-medium text-[#B42318]">
                Unable to load regions. Please retry.
              </p>
              <button
                type="button"
                onClick={location.retryRegionData}
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-[#1E4A38] hover:underline"
              >
                <MdRefresh className="text-sm" />
                Retry
              </button>
            </div>
          )}

          {location.region && location.regionDataState.error && (
            <p className="flex flex-wrap items-center gap-1.5 text-[12px] font-medium text-[#B42318]">
              {location.regionDataState.error}
              <button
                type="button"
                onClick={location.retryRegionData}
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[#1E4A38] hover:underline"
              >
                <MdRefresh className="text-sm" />
                Retry
              </button>
            </p>
          )}
        </section>
      </form>
    </FarmModalShell>
  );
}
