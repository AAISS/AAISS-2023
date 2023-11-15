import { Stack, Skeleton } from '@mui/material';
import PresenterCard from '../../components/presenters/PresenterCard.jsx';
import usePresenterPage from './usePresentersPage.js';
import '../../css/Presenters.css';

export default function PresenterPage() {
  const { teachers } = usePresenterPage();

  if (teachers) {
    return (
      <Stack useFlexGap flexWrap="wrap" direction="row" justifyContent="center" className="presenters-container">
        {teachers.map((item, index) => (
          <PresenterCard key={index} name={item.name} desc={item.workplace} photo={item.pic} />
        ))}
      </Stack>
    );
  }

  return (
    <Stack useFlexGap flexWrap="wrap" direction="row" justifyContent="center" gap={2}>
      {new Array(8).fill(
        <Skeleton
          variant="rounded"
          animation="wave"
          width={330}
          height={360}
          sx={{ bgcolor: 'rgba(64,64,64,0.5)', borderRadius: 10 }}
        />,
      )}
    </Stack>
  );
}
