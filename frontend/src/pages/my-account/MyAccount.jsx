import React, { useState } from 'react';
import { Box, Button, CircularProgress, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import ItemCard from '../../components/item-card/item-card.jsx';
import Toast from '../../components/toast/Toast.jsx';
import { Helper } from '../../utils/Helper.js';
import useMyAccount from './useMyAccount.js';

const TAB_ITEMS = ['Workshops', 'Presentations', 'Cart'];

const MyAccount = () => {
  const { talks, workshops, cart, removeFromCartHandler, toastData, openToast, setOpenToast } = useMyAccount();
  const [tabValue, setTabValue] = useState(TAB_ITEMS[0]);

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
    return items?.map((item, index) => (
      <ItemCard
        key={index}
        isWorkshop={type === 'Workshops'}
        purchaseState={type === 'Cart' ? 1 : 2}
        title={item.name}
        description={Helper.omitLongString(item.desc, 100)}
        level={item.level}
        startDate={item.start_date}
        endDate={item.end_date}
        presenterName={item.presenters?.[0]}
        cost={item.cost}
        hasProject={item.hasProject}
        prerequisites={item.prerequisites}
        syllabus={item.syllabus}
        capacity={item.capacity}
        isFull={item.isFull}
        addToCalendarLink={item.addToCalendarLink}
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
    return total;
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
              <Typography>Total: {calculateTotalCost()} T</Typography>
              <Button variant="contained" sx={{ px: 4 }} disabled={calculateTotalCost() === 0}>
                Buy
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Stack>
  );
};

export default MyAccount;
