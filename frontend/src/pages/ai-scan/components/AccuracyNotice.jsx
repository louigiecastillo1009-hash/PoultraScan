import { Notice } from '../../../components/index';

export default function AccuracyNotice() {
  return (
    <Notice
      tone="warning"
      title="AI results are estimates, not diagnoses."
      className="mb-5"
    >
      This system can occasionally be wrong on disease detection, weight, or count. For sick or
      high-value flocks, please confirm with a licensed poultry veterinarian before acting on these
      results.
    </Notice>
  );
}
