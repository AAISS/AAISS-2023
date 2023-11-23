import { useCallback } from 'react';

export default function useNavItem() {
  const getVariant = useCallback((path, sect) => {
    return path !== sect ? 'text' : 'contained';
  }, []);

  return {
    getVariant,
  };
}
