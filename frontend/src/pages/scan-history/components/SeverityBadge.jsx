import Badge from '../../../components/app/Badge';

const TONES = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
};

const LABELS = {
  NONE: 'No visible signs',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  UNKNOWN: 'Not assessed',
};

export default function SeverityBadge({ severity }) {
  if (!severity) return null;

  return (
    <Badge tone={TONES[severity] || 'neutral'} size="sm">
      {LABELS[severity] || 'No clear signs'}
    </Badge>
  );
}
