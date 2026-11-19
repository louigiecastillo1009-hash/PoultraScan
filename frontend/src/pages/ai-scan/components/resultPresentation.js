// Presentation only: keep persisted/provider states intact.
export function presentChicken(chicken) {
  const inconclusive = chicken.disease === 'Assessment inconclusive';
  const uncertain = inconclusive || chicken.assessable === false || ['UNKNOWN', 'CANNOT_ASSESS'].includes(chicken.disease);
  const unavailable = chicken.assessment_status === 'UNAVAILABLE' || chicken.model_version === 'n/a';
  return {
    ...chicken,
    assessable: uncertain ? false : chicken.assessable,
    disease: uncertain
      ? (unavailable ? 'Analysis temporarily unavailable' : inconclusive ? 'Assessment inconclusive — review needed' : 'Retake photo — assessment inconclusive')
      : chicken.disease,
    breed: chicken.breed?.toUpperCase() === 'UNKNOWN' ? 'Breed not identified from this photo' : chicken.breed,
  };
}
