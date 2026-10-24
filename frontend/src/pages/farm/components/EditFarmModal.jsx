import { useEffect, useState } from 'react';
import { MdEdit, MdImage, MdRefresh } from 'react-icons/md';

import { Button, Notice, TextField } from '../../../components/index';
import FarmLocationSelect from './FarmLocationSelect';
import FarmModalShell from './FarmModalShell';
import { useFarmLocation, composeFarmAddress } from '../hooks/useFarmLocation';
import { thumbnailSrc } from '../../../utils/thumbnailSrc';

const FORM_ID = 'farm-details-form';

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

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

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

  const provinceKnown = !location.regionDataState.loading && !location.regionDataState.error;
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
            <Notice tone="error" title={footerError} />
          )}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form={FORM_ID} disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-cream/35 border-t-cream"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : farm ? (
                'Save changes'
              ) : (
                'Add farm'
              )}
            </Button>
          </div>
        </div>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <section aria-labelledby="farm-photo-heading" className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <span
              id="farm-photo-heading"
              className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-olive"
            >
              Farm photo
            </span>
            <span className="text-[10.5px] text-muted">Optional</span>
          </div>

          <label
            htmlFor="farm-image-input"
            className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-line-strong bg-cream-deep/35 p-3 transition-colors hover:border-sage hover:bg-cream-deep/60 focus-within:border-sage"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage-soft text-sage-dark">
                <MdImage className="text-xl" aria-hidden="true" />
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-semibold text-ink">
                {imageFile ? imageFile.name : previewUrl ? 'Change farm photo' : 'Upload a farm photo'}
              </span>
              <span className="mt-0.5 block text-[10.5px] text-muted">PNG, JPG or WebP</span>
            </span>

            <span className="hidden shrink-0 rounded-full border border-line bg-paper px-3 py-1.5 text-[10.5px] font-semibold text-soft group-hover:border-line-strong sm:block">
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
          <h3 id="farm-details-heading" className="font-display text-lg font-medium text-ink">
            Farm details
          </h3>

          <TextField
            label={
              <>
                Farm name <span className="text-critical">*</span>
              </>
            }
            id="farm-name"
            type="text"
            value={farmName}
            onChange={(event) => setFarmName(event.target.value)}
            required
            autoComplete="organization"
            placeholder="e.g. San Isidro Poultry Farm"
          />

          <TextField
            label="Capacity"
            id="farm-capacity"
            type="number"
            min="0"
            value={capacity}
            onChange={(event) => setCapacity(event.target.value)}
            inputMode="numeric"
            placeholder="Number of chickens"
            hint="Optional. You can update this as your flock grows."
          />
        </section>

        <section
          aria-labelledby="farm-location-heading"
          className="space-y-3 border-t border-ink/10 pt-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 id="farm-location-heading" className="font-display text-lg font-medium text-ink">
                Location <span className="text-critical">*</span>
              </h3>
              <p className="mt-0.5 text-[10.5px] text-muted">
                Select from region down to barangay.
              </p>
            </div>
            {farm?.location && (
              <p
                className="max-w-full rounded-xl bg-cream-deep px-2.5 py-1.5 text-[10.5px] leading-relaxed text-soft sm:max-w-[19rem]"
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
                cityNeedsProvince ? 'Select a province first' : 'Select city / municipality'
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

          <TextField
            label="Street, purok, or subdivision"
            id="farm-street"
            type="text"
            value={location.details}
            onChange={(event) => location.setDetails(event.target.value)}
            placeholder="House no., street, sitio / purok, etc. (optional)"
          />

          {location.regionsState.error && !location.region && (
            <Notice
              tone="error"
              action={
                <Button variant="danger-ghost" size="sm" onClick={location.retryRegionData}>
                  <MdRefresh className="text-sm" aria-hidden="true" />
                  Retry
                </Button>
              }
            >
              Unable to load regions. Please retry.
            </Notice>
          )}

          {location.region && location.regionDataState.error && (
            <Notice
              tone="error"
              action={
                <Button variant="danger-ghost" size="sm" onClick={location.retryRegionData}>
                  <MdRefresh className="text-sm" aria-hidden="true" />
                  Retry
                </Button>
              }
            >
              {location.regionDataState.error}
            </Notice>
          )}
        </section>
      </form>
    </FarmModalShell>
  );
}
