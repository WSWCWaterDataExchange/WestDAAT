import React, { createContext, FC, useContext, useEffect, useMemo, useReducer } from 'react';
import { BeneficialUseListItem } from '../../../data-contracts/BeneficialUseListItem';
import { DataPoints, Directions } from '../../../data-contracts/nldi';
import { useDisplayOptionsUrlParameters } from './hooks/url-parameters/useDisplayOptionsUrlParameters';
import { defaultDisplayOptions, DisplayOptions } from './DisplayOptions';
import { useFiltersUrlParameters } from './hooks/url-parameters/useFiltersUrlParameters';
import { useDashboardFilters } from '../../../hooks/queries/useSystemQuery';
import { UseQueryResult } from 'react-query';
import { deepCloneAndFreeze, EmptyPropsWithChildren } from '../../../HelperTypes';

// TODO unit tests wouldn't kill you

interface State {
  beneficialUsesQuery: Query<BeneficialUseListItem[]>;
  legalStatusesQuery: Query<string[]>;
  ownerClassificationsQuery: Query<string[]>;
  riverBasinsQuery: Query<string[]>;
  statesQuery: Query<string[]>;
  waterSourcesQuery: Query<string[]>;

  displayOptions: DisplayOptions;
  filters: WaterRightsFilters;
  nldiIds: string[];
}

type Action =
  | { type: 'RESET_USER_OPTIONS' }
  | { type: 'SET_BENEFICIAL_USE_NAME_FILTERS'; payload: string[] | undefined }
  | { type: 'SET_DISPLAY_OPTIONS'; payload: DisplayOptions }
  | { type: 'SET_FILTERS'; payload: WaterRightsFilters }
  | { type: 'SET_NLDI_IDS'; payload: string[] }
  | { type: 'SET_OWNER_CLASSIFICATION_FILTERS'; payload: string[] | undefined }
  | { type: 'SET_STATE_FILTERS'; payload: string[] | undefined }
  | { type: 'SET_WATER_SOURCE_TYPE_FILTERS'; payload: string[] | undefined };

interface WaterRightsContextProps {
  state: State;
  dispatch: React.Dispatch<Action>;

  // TODO this is a stopgap on the way to migrating over this provider to using a reducer
  setFilters: (filters: WaterRightsFilters) => void;
  setDisplayOptions: (displayOptions: DisplayOptions) => void;
  setNldiIds: (nldiIds: string[]) => void;
}

const WaterRightsContext = createContext<WaterRightsContextProps | undefined>(undefined);

type WaterRightsProviderProps = EmptyPropsWithChildren;

export const WaterRightsProvider: FC<WaterRightsProviderProps> = ({ children }) => {
  // Create initial state from defaults, filter queries, and url parameters.
  const { data, isLoading, isError } = useDashboardFilters();
  const displayOptionsUrlParameters = useDisplayOptionsUrlParameters();
  const filtersUrlParameters = useFiltersUrlParameters();

  const initialState = deepCloneAndFreeze(defaultState, (draft) => {
    draft.filters = filtersUrlParameters.getParameter() ?? defaultFilters;
    draft.displayOptions = displayOptionsUrlParameters.getParameter() ?? defaultDisplayOptions;
    draft.beneficialUsesQuery = { data: data?.beneficialUses, isLoading, isError };
    draft.legalStatusesQuery = { data: data?.legalStatuses, isLoading, isError };
    draft.ownerClassificationsQuery = { data: data?.ownerClassifications, isLoading, isError };
    draft.riverBasinsQuery = { data: data?.riverBasins, isLoading, isError };
    draft.statesQuery = { data: data?.states, isLoading, isError };
    draft.waterSourcesQuery = { data: data?.waterSources, isLoading, isError };

    return draft;
  });

  // TODO This is a stopgap on the way to migrating over this provider to using a reducer
  const setFilters = (filters: WaterRightsFilters) => dispatch({ type: 'SET_FILTERS', payload: filters });
  const setDisplayOptions = (displayOptions: DisplayOptions) =>
    dispatch({ type: 'SET_DISPLAY_OPTIONS', payload: displayOptions });
  const setNldiIds = (nldiIds: string[]) => dispatch({ type: 'SET_NLDI_IDS', payload: nldiIds });

  const [state, dispatch] = useReducer(reducer, initialState);

  // This will reduce unnecessary re-renders when the state has not changed.
  const value = useMemo(() => ({ state, dispatch, setDisplayOptions, setFilters, setNldiIds }), [state, dispatch]);

  // Update display options parameters in url when state changes.
  useEffect(() => {
    displayOptionsUrlParameters.setParameter(state.displayOptions);
  }, [state.displayOptions, displayOptionsUrlParameters.setParameter]);

  // Update filters parameters in url when state changes.
  useEffect(() => {
    filtersUrlParameters.setParameter(state.filters);
  }, [state.filters, filtersUrlParameters.setParameter]);

  return <WaterRightsContext.Provider value={value}>{children}</WaterRightsContext.Provider>;
};

const reducer = (state: State, action: Action): State => {
  return deepCloneAndFreeze(state, (draft) => {
    switch (action.type) {
      case 'RESET_USER_OPTIONS':
        return resetUserOptions(draft);
      case 'SET_BENEFICIAL_USE_NAME_FILTERS':
        return setBeneficialUseNameFilters(draft, action.payload);
      case 'SET_DISPLAY_OPTIONS':
        return setDisplayOptions(draft, action.payload);
      case 'SET_FILTERS':
        return setFilters(draft, action.payload);
      case 'SET_NLDI_IDS':
        return setNldiIds(draft, action.payload);
      case 'SET_OWNER_CLASSIFICATION_FILTERS':
        return setOwnerClassificationFilters(draft, action.payload);
      case 'SET_STATE_FILTERS':
        return setStateFilters(draft, action.payload);
      case 'SET_WATER_SOURCE_TYPE_FILTERS':
        return setWaterSourceTypeFilters(draft, action.payload);
      default:
        return draft;
    }
  });
};

const resetUserOptions = (draft: State): State => {
  draft.filters = defaultFilters;
  draft.displayOptions = defaultDisplayOptions;
  draft.nldiIds = [];

  return draft;
};

const setBeneficialUseNameFilters = (draft: State, beneficialUseNames: string[] | undefined): State => {
  draft.filters.beneficialUseNames = distinctSortedOrUndefined(beneficialUseNames);

  return draft;
};

const setDisplayOptions = (draft: State, displayOptions: DisplayOptions): State => {
  draft.displayOptions = displayOptions;

  return draft;
};

const setFilters = (draft: State, filters: WaterRightsFilters): State => {
  draft.filters = filters;

  return draft;
};

const setNldiIds = (draft: State, nldiIds: string[]): State => {
  draft.nldiIds = nldiIds;

  return draft;
};

const setOwnerClassificationFilters = (draft: State, ownerClassifications: string[] | undefined): State => {
  draft.filters.ownerClassifications = distinctSortedOrUndefined(ownerClassifications);

  return draft;
};

const setStateFilters = (draft: State, states: string[] | undefined): State => {
  draft.filters.states = distinctSortedOrUndefined(states);

  return draft;
};

const setWaterSourceTypeFilters = (draft: State, waterSourceTypes: string[] | undefined): State => {
  draft.filters.waterSourceTypes = distinctSortedOrUndefined(waterSourceTypes);

  return draft;
};

const distinctSortedOrUndefined = (array: string[] | undefined): string[] | undefined => {
  return array ? [...new Set(array)].sort((a, b) => a.localeCompare(b)) : undefined;
};

export interface WaterRightsFilters {
  beneficialUseNames?: string[];
  legalStatuses?: string[];
  ownerClassifications?: string[];
  riverBasinNames?: string[];
  waterSourceTypes?: string[];
  states?: string[];
  allocationOwner?: string;
  includeExempt: boolean | undefined;
  minFlow: number | undefined;
  maxFlow: number | undefined;
  minVolume: number | undefined;
  maxVolume: number | undefined;
  podPou: 'POD' | 'POU' | undefined;
  minPriorityDate: number | undefined;
  maxPriorityDate: number | undefined;
  polylines?: GeoJSON.Feature<GeoJSON.Geometry>[];
  isNldiFilterActive: boolean;
  nldiFilterData?: NldiFilters;
}

export interface NldiFilters {
  latitude: number | null;
  longitude: number | null;
  directions: Directions;
  dataPoints: DataPoints;
}

type Query<T> = Pick<UseQueryResult<T, unknown>, 'data' | 'isError' | 'isLoading'>;

const defaultQuery = { data: undefined, isError: false, isLoading: false };

export const defaultFilters: WaterRightsFilters = {
  beneficialUseNames: undefined,
  ownerClassifications: undefined,
  allocationOwner: undefined,
  waterSourceTypes: undefined,
  states: undefined,
  riverBasinNames: undefined,
  includeExempt: undefined,
  minFlow: undefined,
  maxFlow: undefined,
  minVolume: undefined,
  maxVolume: undefined,
  podPou: undefined,
  minPriorityDate: undefined,
  maxPriorityDate: undefined,
  polylines: undefined,
  isNldiFilterActive: false,
  nldiFilterData: undefined,
};

export const defaultNldiFilters = {
  latitude: null as number | null,
  longitude: null as number | null,
  directions: Directions.Upsteam | (Directions.Downsteam as Directions),
  dataPoints: DataPoints.Usgs | DataPoints.Epa | (DataPoints.Wade as DataPoints),
};

const defaultState: State = {
  beneficialUsesQuery: defaultQuery,
  displayOptions: defaultDisplayOptions,
  filters: {
    beneficialUseNames: undefined,
    ownerClassifications: undefined,
    waterSourceTypes: undefined,
    riverBasinNames: undefined,
    states: undefined,
    allocationOwner: undefined,
    includeExempt: undefined,
    minFlow: undefined,
    maxFlow: undefined,
    minVolume: undefined,
    maxVolume: undefined,
    podPou: undefined,
    minPriorityDate: undefined,
    maxPriorityDate: undefined,
    polylines: undefined,
    isNldiFilterActive: false,
    nldiFilterData: undefined,
  },
  legalStatusesQuery: defaultQuery,
  nldiIds: [],
  ownerClassificationsQuery: defaultQuery,
  riverBasinsQuery: defaultQuery,
  statesQuery: defaultQuery,
  waterSourcesQuery: defaultQuery,
};

export const useWaterRightsContext = (): WaterRightsContextProps => {
  const context = useContext(WaterRightsContext);

  if (!context) {
    throw new Error('useWaterRightsContext must be used within a WaterRightsProvider');
  }

  return context;
};
