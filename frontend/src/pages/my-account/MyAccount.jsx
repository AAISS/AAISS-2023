import React, { useState } from 'react';
import { Box, Button, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import ItemCard from '../../components/item-card/item-card.jsx';
import useMyAccount from './useMyAccount.js';

const TAB_ITEMS = ['Workshops', 'Talks', 'Cart'];

const MyAccount = () => {
  const { talks, workshops, cart } = useMyAccount();
  const [tabValue, setTabValue] = useState(TAB_ITEMS[0]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const getList = () => {
    switch (tabValue) {
      case 'Workshops':
        return <List type="Workshops" items={workshops} />;
      case 'Talks':
        return <List type="Talks" items={talks} />;
      case 'Cart':
        return <List type="Cart" items={cart} />;
      default:
        return null;
    }
  };

  const List = ({ type, items }) => {
    return items.map((item, index) => (
      <ItemCard
        key={index}
        isWorkshop={type === 'Workshops'}
        purchaseState={type === 'Cart' ? 1 : 2}
        title={item.name}
        description={item.desc}
        level={item.level}
        startDate={item.start_date}
        endDate={item.end_date}
        presenterName={item.presenters[0]}
        cost={item.cost}
        hasProject={item.hasProject}
        prerequisites={item.prerequisites}
        syllabus={item.syllabus}
        capacity={item.capacity}
        isFull={item.isFull}
        addToCalendarLink={item.addToCalendarLink}
        onClickAddToCart={() => {}}
        onClickRemoveFromCart={() => {}}
      />
    ));
  };

  const calculateTotalCost = () => {
    let total = 0;
    cart.forEach(({ cost }) => {
      console.log(cost);
      total += cost;
    });
    return total;
  };

  return (
    <Stack alignItems="center">
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
              <Button variant="contained" sx={{ px: 4 }}>
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
