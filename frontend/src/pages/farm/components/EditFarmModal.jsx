import { useState } from 'react';
import { MdClose, MdImage, MdRefresh } from 'react-icons/md';

import FarmLocationSelect from './FarmLocationSelect';
import { useFarmLocation, composeFarmAddress } from '../hooks/useFarmLocation';

export default function EditFarmModal({ farm, onClose, onSave, saving, error }) {
  const [farmName, setFarmName] = useState(farm?.farm_name ?? '');
  const [capacity, setCapacity] = useState(farm?.capacity ?? '');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(farm?.image_url ?? null);
  const [locationError, setLocationError] = useState(null);

  const location = useFarmLocation();

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

  return (
    <div className="fixed inset-0 z-[60] bg-[#10231A]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto no-scrollbar bg-white rounded-2xl shadow-modal">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4ECE7]">
          <h3 className="text-sm font-bold text-[#10231A]">{farm ? 'Edit Farm' : 'Add Farm'}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-[#F7FAF8] text-[#4B6357] transition-colors">
            <MdClose className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4B6357]">Farm Image (optional)</label>
            <label
              htmlFor="farm-image-input"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed border-[#C5D6CC] text-sm text-[#4B6357] cursor-pointer hover:bg-[#F7FAF8] hover:border-[#14532D] transition-all"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <span className="w-10 h-10 rounded-lg bg-[#E9F4EE] flex items-center justify-center flex-shrink-0">
                  <MdImage className="text-[#14532D] text-lg" />
                </span>
              )}
              <span>{imageFile ? imageFile.name : previewUrl ? 'Change image' : 'Upload an image'}</span>
            </label>
            <input
              id="farm-image-input"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4B6357]">Farm Name</label>
            <input
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              required
              className="px-3 py-2.5 rounded-xl border border-[#E4ECE7] text-sm text-[#10231A] focus:outline-none focus:ring-2 focus:ring-[#14532D]/30"
            />
          </div>

          {/* Cascading Philippine location selector (PSGC Cloud) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4B6357]">Location</span>
              {farm && farm.location && (
                <span className="text-[11px] text-[#718279] truncate max-w-[16rem]" title={farm.location}>
                  Current: {farm.location}
                </span>
              )}
            </div>

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

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[#4B6357]">
                Street, Purok, or Subdivision (optional)
              </span>
              <input
                type="text"
                value={location.details}
                onChange={(e) => location.setDetails(e.target.value)}
                placeholder="House no., street, sitio / purok, etc. (optional)"
                className="px-3 py-2.5 rounded-xl border border-[#E4ECE7] text-sm text-[#10231A] focus:outline-none focus:ring-2 focus:ring-[#14532D]/30"
              />
            </div>

            {(locationError || (location.regionsState.error && !location.region)) && (
              <p className="text-xs text-[#EF4444] font-medium">
                {locationError || 'Unable to load regions. Please retry above.'}
              </p>
            )}

            {location.region && location.regionDataState.error && (
              <p className="text-xs text-[#EF4444] font-medium flex items-center gap-1.5 flex-wrap">
                {location.regionDataState.error}
                <button
                  type="button"
                  onClick={location.retryRegionData}
                  className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[#14532D] hover:underline"
                >
                  <MdRefresh className="text-sm" />
                  Retry
                </button>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#4B6357]">Capacity</label>
            <input
              type="number"
              min="0"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#E4ECE7] text-sm text-[#10231A] focus:outline-none focus:ring-2 focus:ring-[#14532D]/30"
            />
          </div>

          {error && <p className="text-xs text-[#EF4444] font-medium">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E4ECE7] text-sm font-semibold text-[#10231A] hover:bg-[#F7FAF8] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#14532D] to-[#166534] text-white text-sm font-semibold hover:from-[#166534] hover:to-[#052E16] transition-all disabled:opacity-50 shadow-md shadow-[#14532D]/25"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
