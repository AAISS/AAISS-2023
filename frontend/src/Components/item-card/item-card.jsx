import React, { useState } from 'react';
import { CreditCard, Person, SignalCellularAlt } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import MoreInfoModal from './more-info-modal';

const Presenter = ({ presenterName }) => (
  <Stack flexDirection="row" alignItems="center" gap={1}>
    <Person />
    <Typography variant="body1" sx={{ fontSize: 14 }} color="text.secondary">
      {presenterName}
    </Typography>
  </Stack>
);

// TODO: format cost with commas
const Cost = ({ cost }) => (
  <Stack flexDirection="row" alignItems="center" gap={1}>
    <CreditCard />
    <Typography variant="overline" sx={{ fontSize: 14 }} color="text.secondary">
      {cost} T
    </Typography>
  </Stack>
);

const CapacityChip = ({ capacity, isFull }) => (
  <Chip
    color={isFull ? 'error' : 'success'}
    size="small"
    label={isFull ? 'Capacity Full' : `Capacity ${capacity}`}
    sx={{
      mt: 1,
    }}
  />
);

const Level = ({ name, color }) => (
  <Stack flexDirection="row" alignItems="center" gap={1}>
    <SignalCellularAlt />
    <Typography variant="overline" sx={{ fontSize: 14 }} color={color}>
      {name}
    </Typography>
  </Stack>
);

const levelComponentMapping = {
  Elementary: <Level name="elementary" color="success.light" />,
  Intermediate: <Level name="intermediate" color="secondary.main" />,
  Advanced: <Level name="advanced" color="warning.light" />,
};

const ItemCard = ({
  title = 'Title',
  isWorkshop = true,
  description = 'Default Description',
  startDate = '2021-08-27 06:00',
  endDate = '2021-08-31 18:00',
  presenterName = 'Presenter Name',
  level = 'elementary',
  cost = 50000,
  purchaseState = 0, // 0 -> not purchased, 1 -> in cart, 2 -> purchased
  hasProject = true,
  prerequisites = 'List of prerequisites',
  syllabus = 'List of syllabus',
  capacity = 50,
  isFull = false,
  addToCalendarLink = 'https://google.com',
  onClickAddToCart = () => {},
  onClickRemoveFromCart = () => {},
}) => {
  const [moreInfoModalVisibility, setMoreInfoModalVisibility] = useState(false);
  const hasBought = purchaseState === 2;

  const handleClickOnMoreInfo = () => {
    setMoreInfoModalVisibility(true);
  };

  const getActionComponent = () => {
    switch (purchaseState) {
      case 0:
        return (
          <Button variant="outlined" size="small" disabled={isFull} onClick={onClickAddToCart}>
            Add to Cart
          </Button>
        );
      case 1:
        return (
          <Button variant="text" color="error" size="small" disabled={isFull} onClick={onClickRemoveFromCart}>
            Remove
          </Button>
        );
      case 2:
        return (
          <Button size="small" href={addToCalendarLink} target="_blank">
            Add to calendar
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <MoreInfoModal
        visibility={moreInfoModalVisibility}
        onVisibilityChange={() => setMoreInfoModalVisibility(false)}
        title={title}
        purchaseState={purchaseState}
        hasProject={hasProject}
        prerequisites={prerequisites}
        syllabus={syllabus}
        isFull={isFull}
        addToCalendarLink={addToCalendarLink}
        onClickAddToCart={onClickAddToCart}
        onClickRemoveFromCart={onClickRemoveFromCart}
      />
      <Card
        raised
        sx={{
          minWidth: 275,
          maxWidth: 300,
          maxHeight: 500,
          minHeight: 300,
          bgcolor: 'var(--background-color-lighter-20)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title={title}
          subheader={isWorkshop ? 'workshop' : 'talk'}
          titleTypographyProps={{ variant: 'subtitle1' }}
          subheaderTypographyProps={{ variant: 'overline' }}
          sx={{ bgcolor: isFull && !hasBought ? 'action.disabledBackground' : 'var(--background-color-lighter-60)' }}
        />
        <CardContent>
          <Typography variant="body2" gutterBottom>
            {description}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: 14 }} color="text.secondary">
            From: {startDate}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: 14 }} color="text.secondary">
            To: {endDate}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Presenter presenterName={presenterName} />
          {levelComponentMapping[level]}
          {!hasBought && <Cost cost={cost} />}
          {!hasBought && <CapacityChip isFull={isFull} capacity={capacity} />}
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            gap: 1,
            marginTop: 'auto',
          }}
        >
          <Button size="small" onClick={handleClickOnMoreInfo}>
            More Info
          </Button>
          {getActionComponent()}
        </CardActions>
      </Card>
    </>
  );
};

ItemCard.propTypes = {
  title: PropTypes.string,
  isWorkshop: PropTypes.bool,
  description: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  presenterName: PropTypes.string,
  level: PropTypes.string,
  cost: PropTypes.number,
  purchaseState: PropTypes.number,
  hasProject: PropTypes.bool,
  prerequisites: PropTypes.string,
  syllabus: PropTypes.string,
  capacity: PropTypes.number,
  isFull: PropTypes.bool,
  addToCalendarLink: PropTypes.string,
  onClickAddToCart: PropTypes.func,
};

export default ItemCard;
