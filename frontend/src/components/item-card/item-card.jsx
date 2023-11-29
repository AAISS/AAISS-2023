import React, { useState } from 'react';
import { CreditCard, Person, SignalCellularAlt } from '@mui/icons-material';
import { Button, Card, CardActions, CardContent, CardHeader, Chip, Divider, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { Helper } from '../../utils/Helper.js';
import MoreInfoModal from './more-info-modal';

export const Presenter = ({ presenterName }) => (
  <Stack flexDirection="row" alignItems="center" gap={1}>
    <Person />
    <Typography variant="body1" sx={{ fontSize: 14 }} color="text.secondary">
      {presenterName}
    </Typography>
  </Stack>
);

export const Cost = ({ cost }) => (
  <Stack flexDirection="row" alignItems="center" gap={1}>
    <CreditCard />
    <Typography variant="overline" sx={{ fontSize: 14 }} color="text.secondary">
      {cost} T
    </Typography>
  </Stack>
);

const CapacityChip = ({ capacity, isFull, remainingCapacity }) => (
  <Chip
    color={isFull ? 'error' : 'success'}
    size="small"
    label={isFull ? 'Capacity Full' : `Capacity ${remainingCapacity}/${capacity}`}
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

export const levelComponentMapping = {
  Elementary: <Level name="elementary" color="success.light" />,
  Intermediate: <Level name="intermediate" color="secondary.main" />,
  Advanced: <Level name="advanced" color="warning.light" />,
};

const ItemCard = ({
  title,
  isWorkshop = true,
  description,
  startDate,
  endDate,
  presenterName,
  level,
  cost = 50000,
  purchaseState = 0, // 0 -> not purchased, 1 -> in cart, 2 -> purchased
  hasProject = true,
  prerequisites,
  syllabus,
  remainingCapacity = 50,
  capacity = 50,
  isFull = false,
  addToCalendarLink,
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
        presenterName={presenterName}
        cost={cost}
        purchaseState={purchaseState}
        description={description}
        level={level}
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
          maxHeight: 530,
          minHeight: 330,
          bgcolor: 'var(--background-color-lighter-20)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title={title}
          subheader={isWorkshop ? 'workshop' : 'presentation'}
          titleTypographyProps={{ variant: 'subtitle1' }}
          subheaderTypographyProps={{ variant: 'overline' }}
          sx={{ bgcolor: isFull && !hasBought ? 'action.disabledBackground' : 'var(--background-color-lighter-60)' }}
        />
        <CardContent>
          <Typography variant="body2" gutterBottom>
            {Helper.omitLongString(description, 50)}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: 14 }} color="text.secondary">
            From: {new Date(startDate).toLocaleString('fa-IR-u-nu-latn')}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: 14 }} color="text.secondary">
            To: {new Date(endDate).toLocaleString('fa-IR-u-nu-latn')}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Presenter presenterName={presenterName} />
          {levelComponentMapping[level]}
          {!hasBought && <Cost cost={cost} />}
          {!hasBought && <CapacityChip isFull={isFull} remainingCapacity={remainingCapacity} capacity={capacity} />}
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
  remainingCapacity: PropTypes.number,
};

export default ItemCard;
