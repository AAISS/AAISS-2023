import { useEffect, useState } from 'react';
import { useAPI } from '../../providers/APIProvider/APIProvider';

export default function usePresenterPage() {
  const { teachersData, getTeachersData } = useAPI();
  const [teachers, setTeachers] = useState();
  useEffect(() => {
    getTeachersData();
  }, []);

  useEffect(() => {
    if (teachersData == null) return;
    setTeachers(teachersData);
    console.log(teachersData);
  }, [teachersData]);

  return {
    teachers,
  };
}
