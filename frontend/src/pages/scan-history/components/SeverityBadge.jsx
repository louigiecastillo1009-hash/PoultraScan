import Badge from '../../../components/app/Badge';

const TONES = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
};

export default function SeverityBadge({ severity }) {
  if (!severity) return null;

  return (
    <Badge tone={TONES[severity] || 'neutral'} size="sm">
      {severity}
    </Badge>
  );
}
