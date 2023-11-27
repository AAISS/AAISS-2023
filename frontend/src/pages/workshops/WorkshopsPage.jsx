import { CircularProgress } from '@mui/material';
import ItemCard from '../../components/item-card/item-card.jsx';
import Toast from '../../components/toast/Toast.jsx';
import { Helper } from '../../utils/Helper.js';
import useWorkshopsPage from './useWorkshopsPage.js';

export default function WorkshopsPage() {
  const { parsedItemsList, addToCart, toastData, setOpenToast, openToast } = useWorkshopsPage();

  const getItemsList = () => {
    if (parsedItemsList) {
      return parsedItemsList.map((item, index) => (
        <ItemCard
          key={index}
          isWorkshop={item.isWorkshop}
          title={item.name}
          description={item.desc && Helper.omitLongString(item.desc, 50)}
          purchaseState={0}
          presenterName={item.presenters.join(', ')}
          startDate={new Date(item.start_date).toLocaleString()}
          endDate={new Date(item.end_date).toLocaleString()}
          level={item.level}
          onClickAddToCart={() =>
            addToCart({
              id: item.id,
              type: item.isWorkshop ? 'workshop' : 'presentation',
            })
          }
        />
      ));
    }

    return <CircularProgress />;
  };

  return (
    <section
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
      }}
    >
      {toastData && (
        <Toast open={openToast} setOpen={setOpenToast} alertType={toastData.type} message={toastData.message} />
      )}
      {getItemsList()}
    </section>
  );
}
