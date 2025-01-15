import urlParameterKeys from '../../../../../hooks/url-parameters/urlParameterKeys';
import { DisplayOptions, defaultDisplayOptions } from '../components/DisplayOptions';
import { useUrlParameters } from '../../../../../hooks/url-parameters/useUrlParameters';

const paramName = urlParameterKeys.homePage.waterRightsDisplayOptions;

export function useDisplayOptionsUrlParameters() {
  return useUrlParameters<DisplayOptions>(paramName, defaultDisplayOptions);
}
