import { Box, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import '../../css/PresenterCard.css';
import URL from '../../providers/APIProvider/URL.js';
import Image from '../image/Image.jsx';

const PresenterCard = ({ name, photo, desc, onClick }) => {
  return (
    <Box className="presenter-card">
      <Card
        sx={{
          height: 430,
          minWidth: 275,
          maxWidth: 300,
          bgcolor: 'var(--background-color-lighter-20)',
          borderRadius: '10px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
        raised
        onClick={onClick}
      >
        <CardContent>
          <Stack alignItems="center" justifyContent="center" gap={1}>
            <Image
              src={`${URL.baseURL}${photo}`}
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
              }}
            />
            <Typography sx={{ textAlign: 'center' }} variant="h5">
              {name}
            </Typography>
            <Typography sx={{ textAlign: 'center' }} color="text.secondary">
              {desc}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button>View Details</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

PresenterCard.propTypes = {
  name: PropTypes.string,
  photo: PropTypes.string,
  desc: PropTypes.string,
  onClick: PropTypes.func,
};

export default PresenterCard;
