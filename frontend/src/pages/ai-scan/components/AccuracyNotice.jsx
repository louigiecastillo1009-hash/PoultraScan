import { Notice } from '../../../components/index';

export default function AccuracyNotice() {
  return (
    <Notice
      tone="warning"
      title="AI results are estimates, not measurements."
      className="mb-5"
    >
      Counting, weight, oil yield, and visible condition can be inaccurate. The scanner does not
      diagnose disease or prescribe treatment. Confirm weight with a scale before selling, and
      consult a licensed poultry professional for any health concern.
    </Notice>
  );
}
