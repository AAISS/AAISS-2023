import React from 'react';
import { Box, Button, Card, CardActions, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import '../../css/PresenterCard.css';
import URL from '../../providers/APIProvider/URL.js';
import Image from '../image/Image.jsx';

const PresenterCard = ({ name, photo, desc, logo, onClick, showButton = true, role, containerHeight }) => {
  return (
    <Box className="presenter-card">
      <Card
        sx={{
          height: containerHeight || 430,
          minWidth: 275,
          maxWidth: 300,
          bgcolor: 'var(--background-color-lighter-20)',
          borderRadius: '10px',
          cursor: onClick && 'pointer',
          display: 'flex',
          flexDirection: 'column',
        }}
        raised
        onClick={onClick}
      >
        <CardContent>
          <Stack alignItems="center" justifyContent="space-between" gap={1} sx={{ height: '100%' }}>
            <Stack flexDirection="column" alignItems="center">
              <Image
                src={`${URL.baseURL}${photo}`}
                style={{
                  width: '190px',
                  height: '190px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
              <Typography
                sx={{
                  textAlign: 'center',
                  width: '100%',
                  pt: 1,
                }}
                variant="h5"
              >
                {name}
              </Typography>
            </Stack>
            {role && <Chip label={role} />}
            {logo && (
              <Stack
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={1}
                sx={{
                  bgcolor: '#3f579a',
                  padding: '10px',
                  boxSizing: 'border-box',
                  borderRadius: '10px',
                  width: '100%',
                  minHeight: '115px',
                  position: 'relative',
                }}
              >
                <Image
                  src={`${URL.baseURL}${logo}`}
                  style={{
                    width: 'fit-content',
                    height: '40px',
                    borderRadius: '10px',
                    objectFit: 'fit',
                    objectPosition: 'center',
                  }}
                />
                <Typography
                  fontSize="15px"
                  sx={{
                    fontWeight: 'lighter',
                    textWrap: 'balance',
                    textAlign: 'center',
                  }}
                >
                  {desc}
                </Typography>
              </Stack>
            )}
          </Stack>
        </CardContent>
        {showButton && (
          <CardActions sx={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Button>View Details</Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

PresenterCard.propTypes = {
  name: PropTypes.string,
  photo: PropTypes.string,
  desc: PropTypes.string,
  onClick: PropTypes.func,
  showButton: PropTypes.bool,
  role: PropTypes.string,
  containerHeight: PropTypes.number,
};

export default PresenterCard;
