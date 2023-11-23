import { useNavigate } from 'react-router-dom';
import { Stack, Skeleton, Typography } from '@mui/material';
import PresenterCard from '../../components/presenters/PresenterCard.jsx';
import usePresenterPage from './usePresentersPage.js';
import '../../css/Presenters.css';

export default function PresenterPage() {
  const { teachers } = usePresenterPage();
  const navigate = useNavigate();

  const navToPresenterDetailPage = (id) => () => {
    navigate(`${id}`, {
      state: {
        teachersArray: teachers,
      },
    });
  };

  if (teachers) {
    return (
      <Stack>
        <Typography variant="h1" fontSize="60px" sx={{ textAlign: 'center', pb: 5 }}>
          Invited Speakers
        </Typography>
        <Stack
          useFlexGap
          flexWrap="wrap"
          direction="row"
          justifyContent="center"
          className="presenters-container"
          gap={5}
        >
          {teachers.map((item, index) => (
            <PresenterCard
              key={index}
              name={item.name}
              desc={item.workplace}
              photo={item.pic}
              logo={item.workplace_logo}
              onClick={navToPresenterDetailPage(item.id)}
            />
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack>
      <Typography variant="h1" fontSize="60px" sx={{ textAlign: 'center', pb: 5 }}>
        Invited Speakers
      </Typography>
      <Stack useFlexGap flexWrap="wrap" direction="row" justifyContent="center" gap={2}>
        {new Array(8).fill(
          <Skeleton
            variant="rounded"
            animation="wave"
            width={330}
            height={360}
            // sx={{ bgcolor: 'rgba(64,64,64,0.5)', borderRadius: 10 }}
            sx={{ bgColor: 'var(--background-color-lighter-20)', borderRadius: 10 }}
          />,
        )}
      </Stack>
    </Stack>
  );
}
