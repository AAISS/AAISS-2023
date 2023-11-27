import { useCallback, useEffect, useState } from 'react';
import { useAPI } from '../../providers/APIProvider/APIProvider.jsx';

export default function useWorkshopsPage() {
  const {
    getWorkshopsData,
    workshopsData,
    getPresentationsData,
    presentationsData,
    addToCartResponse,
    addItemToCart,
    teachersData,
    getTeachersData,
    presenterData,
    getPresenterData,
    setAddToCartResponse,
  } = useAPI();

  const [parsedItemsList, setParsedItemsList] = useState();
  const [gridTemplateColumnsValue, setGridTemplateColumnsValue] = useState('');
  const [toastData, setToastData] = useState(false);
  const [openToast, setOpenToast] = useState(false);

  useEffect(() => {
    const func = () => {
      setGridTemplateColumnsValue('1fr '.repeat(Math.floor(window.innerWidth / 400)));
    };
    func();
    window.addEventListener('resize', func);
  }, []);

  useEffect(() => {
    if (addToCartResponse == null) return;

    const toastDataTemp = {};
    switch (addToCartResponse.status) {
      case 200:
        toastDataTemp.type = 'success';
        toastDataTemp.message = 'Item Successfully Added to Cart!';
        break;
      case 400:
        toastDataTemp.type = 'error';
        toastDataTemp.message = 'Failed to Add Item to Cart: Item Is Already In Your Cart!';
        break;
      case 401:
        toastDataTemp.type = 'error';
        toastDataTemp.message = 'Failed to Add Item to Cart: You Should Login First!';
    }
    setToastData(toastDataTemp);
    setOpenToast(true);
    setAddToCartResponse(null);
  }, [addToCartResponse]);

  useEffect(() => {
    getWorkshopsData();
    getPresentationsData();
    getTeachersData();
    getPresenterData();
  }, [getPresentationsData, getWorkshopsData]);

  useEffect(() => {
    if (workshopsData == null || presentationsData == null || teachersData == null || presenterData == null) return;

    const parsedData = workshopsData
      .concat(presentationsData)
      .map((workshop) => {
        if ('is_full' in workshop && !('id' in workshop)) return null;
        if (workshop.year < 2023) return;
        const item = {};

        const presenters = [];
        if (workshop.teachers) {
          workshop.teachers.forEach((item) => {
            presenters.push(teachersData.filter((el) => el.id === item)[0].name);
          });
        } else {
          workshop.presenters.forEach((item) => {
            presenters.push(presenterData.filter((el) => el.id === item)[0].name);
          });
        }
        item.presenters = presenters;

        item['id'] = workshop.id;
        item['name'] = workshop.name;
        item['start_date'] = workshop.start_date;
        item['end_date'] = workshop.end_date;
        item['level'] = workshop.level;
        item['desc'] = workshop.desc;
        item['cost'] = workshop.cost;
        item['capacity'] = workshop.capacity;
        item['isWorkshop'] = !('presenters' in workshop);
        return item;
      })
      .filter((e) => e != null);
    setParsedItemsList(parsedData);
  }, [workshopsData, presentationsData, presenterData, teachersData]);

  const addToCart = useCallback(
    ({ id, type }) => {
      addItemToCart({
        id,
        type,
      });
    },
    [addItemToCart],
  );

  return {
    parsedItemsList,
    addToCart,
    gridTemplateColumnsValue,
    toastData,
    setOpenToast,
    openToast,
  };
}
