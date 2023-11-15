import { Link, Skeleton, Stack, Typography } from '@mui/material';
import '../../css/PresenterCard.css';
import URL from '../../providers/APIProvider/URL.js';
import Image from '../image/Image.jsx';

export default function PresenterCard({ name, photo, link, desc, isLoading }) {
  if (isLoading) {
    return (
      <Stack className="presenter-card" gap={2} style={{ overflowWrap: 'break-word' }}>
        {/* <Image
          src={`${URL.baseURL}${photo}`}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
          }}
        /> */}
        <Skeleton variant="circle" width={200} height={200} />
        <Skeleton variant="rectangular" width={300} height={300} />
        {/* <Stack style={{ width: 300 }} className="animate-color">
          <Link href={link} variant="h4" color="inherit" underline="none">
            {name}
          </Link>
          <Typography>{desc}</Typography>
        </Stack> */}
      </Stack>
    );
  }

  return (
    <Stack className="presenter-card" gap={2} style={{ overflowWrap: 'break-word' }}>
      <Image
        src={`${URL.baseURL}${photo}`}
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
        }}
      />
      <Stack style={{ width: 300 }} className="animate-color">
        <Link href={link} variant="h4" color="inherit" underline="none">
          {name}
        </Link>
        <Typography>{desc}</Typography>
      </Stack>
    </Stack>
  );
}
