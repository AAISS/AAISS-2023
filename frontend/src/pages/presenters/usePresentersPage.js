import { useEffect, useState } from 'react';
import { useAPI } from '../../providers/APIProvider/APIProvider';

export default function usePresenterPage() {
  const { teachersData, getTeachersData, presenterData, getPresenterData } = useAPI();
  const [renderedData, setRenderedData] = useState();
  useEffect(() => {
    getTeachersData();
    getPresenterData()
  }, [getPresenterData, getTeachersData]);

  useEffect(() => {
    if (teachersData == null || presenterData == null) return;
    setRenderedData(teachersData.concat(presenterData));
  }, [presenterData, teachersData]);

  return {
    renderedData,
  };
}
