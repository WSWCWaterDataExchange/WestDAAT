import urlParameterKeys from '../../../../../hooks/url-parameters/urlParameterKeys';
import { useUrlParameters } from '../../../../../hooks/url-parameters/useUrlParameters';
import { DropdownOption } from '../../../../../data-contracts/DropdownOption';

const paramName = urlParameterKeys.homePage.analyticsGrouping;

export function useAnalyticsGroupingUrlParameter() {
  return useUrlParameters<DropdownOption | null>(paramName, null);
}
