import { MdAgriculture, MdCheckCircle, MdGridView, MdLocationOn } from 'react-icons/md';

import { thumbnailSrc } from '../../../utils/thumbnailSrc';

export default function FarmInfoCard({
  farmName,
  location,
  capacity,
  imageUrl,
  isActive = false,
}) {
  const details = [
    {
      icon: MdLocationOn,
      label: 'Location',
      value: location || 'No location provided',
    },
    {
      icon: MdGridView,
      label: 'Capacity',
      value:
        capacity != null
          ? `${Number(capacity).toLocaleString()} chickens`
          : 'Not specified',
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DFE6E0] bg-white shadow-[0_1px_2px_rgba(38,53,47,0.03)]">
      <div className="flex flex-col md:flex-row">
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[#ECF1ED] md:aspect-auto md:w-[38%] md:min-h-[260px]">
          {imageUrl ? (
            <img
              alt={`${farmName || 'Farm'} photo`}
              className="absolute inset-0 h-full w-full object-cover"
              src={thumbnailSrc(imageUrl)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#EDF5EF] to-[#E6F1EA] text-[#1E4A38]">
              <MdAgriculture className="text-5xl opacity-80" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

          {isActive && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1E4A38] shadow-sm ring-1 ring-[#1E4A38]/10 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1E4A38]" />
              Active scanning farm
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6 md:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#7D8B82]">
            Farm profile
          </p>
          <h2 className="mt-1.5 break-words text-[22px] font-bold leading-tight tracking-tight text-[#1B2922] sm:text-2xl">
            {farmName || 'Unnamed farm'}
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex min-w-0 items-start gap-3 rounded-xl border border-[#ECF1ED] bg-[#FBFCFA] p-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6F1EA] text-[#1E4A38]">
                  <Icon className="text-lg" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7D8B82]">
                    {label}
                  </p>
                  <p className="mt-0.5 break-words text-[13px] font-semibold leading-relaxed text-[#1B2922]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {isActive && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#1E4A38]">
              <MdCheckCircle className="text-base" />
              New scans are saved to this farm.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
