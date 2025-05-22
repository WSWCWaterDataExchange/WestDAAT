import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { DropdownOption } from '../../../../../data-contracts/DropdownOption';

export const useAnalyticsGroupingUrlParameter = () => {
  const location = useLocation();

  const getParameter = useCallback(() => {
    const query = new URLSearchParams(location.search);
    const groupingParam = query.get('analyticsGrouping');

    if (groupingParam) {
      try {
        return JSON.parse(decodeURIComponent(groupingParam)) as DropdownOption;
      } catch (e) {
        console.error('Error parsing analyticsGrouping parameter', e);
      }
    }
    return null;
  }, [location.search]);

  const setParameter = useCallback(
    (analyticsGroupingOption: DropdownOption | null) => {
      // Create a new URL search params instance
      const query = new URLSearchParams(location.search);

      if (analyticsGroupingOption) {
        const serialized = encodeURIComponent(JSON.stringify(analyticsGroupingOption));
        query.set('analyticsGrouping', serialized);
      } else {
        query.delete('analyticsGrouping');
      }

      // Update URL without using history directly
      window.history.replaceState(
        {},
        '',
        `${location.pathname}${query.toString() ? `?${query.toString()}` : ''}`
      );
    },
    [location]
  );

  return { getParameter, setParameter };
};
