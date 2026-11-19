// Presentation only: keep persisted/provider states intact.
export function presentChicken(chicken) {
  const unavailable =
    chicken.assessment_status === 'UNAVAILABLE' || chicken.model_version === 'n/a';
  const retake = chicken.assessable === false || chicken.disease === 'CANNOT_ASSESS';

  let disease = chicken.disease;
  if (retake) disease = 'Retake photo';
  else if (unavailable) disease = 'Analysis temporarily unavailable';
  else if (disease === 'UNKNOWN') disease = 'No clear signs detected';

  // User corrections win over AI estimates; the original estimate stays on
  // the object so the card can still show what the scan produced.
  const weight =
    chicken.effective_weight ?? chicken.measured_weight_kg ?? chicken.estimated_weight ?? null;
  const oil =
    chicken.effective_oil_ml ?? chicken.measured_oil_ml ?? chicken.estimated_oil_ml ?? null;
  const weightSource =
    chicken.weight_source ??
    (chicken.measured_weight_kg != null ? 'user' : chicken.estimated_weight != null ? 'ai' : null);
  const oilSource =
    chicken.oil_source ??
    (chicken.measured_oil_ml != null ? 'user' : chicken.estimated_oil_ml != null ? 'ai' : null);

  return {
    ...chicken,
    assessable: !retake && !unavailable,
    disease,
    display_weight: weight == null ? null : Number(weight),
    display_oil_ml: oil == null ? null : Number(oil),
    weight_source: weightSource,
    oil_source: oilSource,
    market_ready_label:
      chicken.market_ready_label ?? (chicken.market_ready ? 'Market ready' : 'Check weight'),
    breed: chicken.breed?.toUpperCase() === 'UNKNOWN' ? null : chicken.breed,
  };
}
