import { MdAgriculture } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { Button, EmptyState } from '../../../components/index';

export default function NoActiveFarmNotice() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={MdAgriculture}
      title="No farm selected"
      description="Choose which farm this scan belongs to before continuing."
      action={<Button onClick={() => navigate('/farm')}>Go to my farms</Button>}
    />
  );
}
