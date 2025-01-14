import React, { useState } from 'react';
import {Box, Button, Chip, CircularProgress, Divider, Stack, Tab, Tabs, TextField, Typography} from '@mui/material';
import ItemCard from '../../components/item-card/item-card.jsx';
import Toast from '../../components/toast/Toast.jsx';
import useMyAccount from './useMyAccount.js';


const TAB_ITEMS = ['Workshops', 'Presentations', 'Cart'];
const DISCOUNT = 0.25;
const MIN_TOTAL_PRICE_TO_GET_DISCOUNT = 200000;

const MyAccount = () => {
  const {
    talks,
    workshops,
    handleBuyCart,
    buyButtonLoading,
    cart,
    removeFromCartHandler,
    toastData,
    openToast,
    offCode,
    handleOffCodeInputHandler,
    setOpenToast,
  } = useMyAccount();
  const [tabValue, setTabValue] = useState(TAB_ITEMS[2]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const getList = () => {
    switch (tabValue) {
      case 'Workshops':
        if (workshops) {
          if (workshops.length === 0) {
            return (
              <Stack alignItems="center">
                <Typography>You are not registered in any workshop!</Typography>
              </Stack>
            );
          }
          return <List type="Workshops" items={workshops} />;
        }
        break;
      case 'Presentations':
        if (talks) {
          if (talks.length === 0) {
            return (
              <Stack alignItems="center">
                <Typography>You are not registered in any presentation!</Typography>
              </Stack>
            );
          }
          return <List type="Talks" items={talks} />;
        }
        break;
      case 'Cart':
        if (cart) {
          if (cart.length === 0) {
            return (
              <Stack alignItems="center">
                <Typography>Your cart is empty!</Typography>
              </Stack>
            );
          }
          return <List type="Cart" items={cart} />;
        }
        break;
      default:
        return null;
    }
    return <CircularProgress />;
  };

  const List = ({ type, items }) => {
    if (items == null) return;
    return items.map((item, index) => (
      <ItemCard
        key={index}
        isWorkshop={item.type === 'workshop'}
        purchaseState={type === 'Cart' ? 1 : 2}
        title={item.name}
        description={item.desc}
        level={item.level}
        startDate={item.start_date}
        endDate={item.end_date}
        presenterName={item.presenters?.join(', ') ?? item.teachers?.join(', ')}
        cost={item.cost}
        hasProject={item.has_project}
        certificateLink={item.certificateLink}
        prerequisites={item.prerequisites}
        syllabus={item.syllabus}
        capacity={item.capacity}
        remainingCapacity={item.remaining_capacity}
        isFull={item.remaining_capacity === 0}
        addToCalendarLink={item.google_calendar_link}
        onClickAddToCart={() => {}}
        onClickRemoveFromCart={() => removeFromCartHandler({ id: item.id, type: item.type })}
      />
    ));
  };

  const calculateTotalCost = () => {
    if (!cart) return 0;
    let total = 0;
    cart.forEach(({ cost }) => {
      total += cost;
    });

    if (total >= MIN_TOTAL_PRICE_TO_GET_DISCOUNT) {
      const orgPrice = total;
      total -= DISCOUNT * total;

      return {
        total: orgPrice,
        discountedPrice: total,
      };
    }

    return {
      total,
      discountedPrice: null,
    };
  };

  const renderTotalPrice = () => {
    const { total, discountedPrice } = calculateTotalCost();
    if (discountedPrice) {
      return (
        <Stack flexDirection="row" alignItems="center" gap={1}>
          <Typography variant="overline" sx={{ fontSize: 14 }} color="text.secondary">
            Total:{' '}
          </Typography>
          <Typography variant="overline" sx={{ fontSize: 14, textDecoration: 'line-through' }} color="text.secondary">
            {total} T
          </Typography>
          <Chip label="-25%" size="small" color="error" />
          <Typography variant="overline" sx={{ fontSize: 15, fontWeight: 'bolder', color: 'var(--error-color)' }}>
            {discountedPrice} T
          </Typography>
        </Stack>
      );
    }

    return (
      <Typography variant="overline" sx={{ fontSize: 14 }} color="text.secondary">
        Total: {total} T
      </Typography>
    );
  };

  return (
    <Stack alignItems="center">
      <Toast open={openToast} setOpen={setOpenToast} alertType={toastData?.alertType} message={toastData?.message} />
      <Box sx={{ bgcolor: 'var(--background-color)', px: 4, pb: 8, borderRadius: '30px', width: '80%' }}>
        <Box sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={handleChangeTab} centered>
            {TAB_ITEMS.map((item, index) => (
              <Tab key={index} value={item} label={item} sx={{ color: 'var(--light-text-color)' }} />
            ))}
          </Tabs>
        </Box>
        <Stack
          flexDirection="row"
          gap={4}
          justifyContent="center"
          alignItems="flex-start"
          marginTop={4}
          flexWrap="wrap"
        >
          {getList()}
        </Stack>
        {tabValue === 'Cart' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack alignItems="center" gap={1}>
              <br />
              {/* Have a Discount Code? */}
              {/* <TextField
                  id={"off-input-field"}
                  label={"Discount Code Here!"}
                  variant={"outlined"}
                  onChange={handleOffCodeInputHandler}
                  value={offCode}
              /> */}
              <br />
              {renderTotalPrice()}
              <Button
                onClick={handleBuyCart}
                variant="contained"
                sx={{ px: 4 }}
                disabled={buyButtonLoading || calculateTotalCost() === 0}
              >
                {!buyButtonLoading && 'Buy'}
                {buyButtonLoading && <CircularProgress />}
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default MyAccount;
