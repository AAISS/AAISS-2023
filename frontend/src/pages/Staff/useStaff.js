import { useEffect, useState } from 'react';
import { useAPI } from '../../providers/APIProvider/APIProvider';

export default function usePresenterPage() {
  const { staffData, getStaffData } = useAPI();
  const [staff, setStaff] = useState();
  useEffect(() => {
    getStaffData();
  }, []);

  useEffect(() => {
    if (staffData === null) return;
    setStaff(staffData);
  }, [staffData]);

  return {
    staff,
  };
}
