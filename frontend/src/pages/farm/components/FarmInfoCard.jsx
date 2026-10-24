import { MdAgriculture, MdCheckCircle, MdGridView, MdLocationOn } from 'react-icons/md';

import Surface from '../../../components/app/Surface';
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
        capacity != null ? `${Number(capacity).toLocaleString()} chickens` : 'Not specified',
    },
  ];

  return (
    <Surface padding="none" className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-cream-deep md:aspect-auto md:min-h-[280px] md:w-[40%]">
          {imageUrl ? (
            <img
              alt={`${farmName || 'Farm'} photo`}
              className="absolute inset-0 h-full w-full object-cover"
              src={thumbnailSrc(imageUrl)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage-soft to-cream-deep text-sage-dark">
              <MdAgriculture className="text-5xl opacity-80" aria-hidden="true" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" />

          {isActive && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-sage-dark shadow-sm ring-1 ring-sage/15 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-sage-dark" aria-hidden="true" />
              Active scanning farm
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6 md:p-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-olive">Farm profile</p>
          <h2 className="mt-2 break-words font-display text-[1.75rem] font-medium leading-tight tracking-[-0.025em] text-ink sm:text-[2rem]">
            {farmName || 'Unnamed farm'}
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex min-w-0 items-start gap-3 rounded-2xl border border-ink/10 bg-cream-deep/45 p-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper text-sage-dark">
                  <Icon className="text-lg" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
                  <p className="mt-1 break-words text-[12.5px] font-semibold leading-relaxed text-ink">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {isActive && (
            <p className="mt-4 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-sage-dark">
              <MdCheckCircle className="text-base" aria-hidden="true" />
              New scans are saved to this farm.
            </p>
          )}
        </div>
      </div>
    </Surface>
  );
}
