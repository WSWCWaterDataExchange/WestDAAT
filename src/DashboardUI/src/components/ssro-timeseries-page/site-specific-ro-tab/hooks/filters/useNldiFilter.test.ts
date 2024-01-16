import { renderHook } from '@testing-library/react-hooks'
import { useNldiFilter } from './useNldiFilter';
import * as SiteSpecificProvider from '../../Provider';
import * as NldiQueries from "../../../../../hooks/queries/useNldiQuery";
import { DataPoints, Directions } from '../../../../../data-contracts/nldi';

let currFilters = {...SiteSpecificProvider.defaultFilters}
let differentNldiFilters = {
   latitude: 30,
   longitude: -90,
   directions: Directions.Downsteam,
   dataPoints: DataPoints.Epa,
  }
let mockSetFilters = jest.fn((a) => currFilters = a());
let mockSetNldiIds = jest.fn();

beforeEach(() =>{
  jest.spyOn(SiteSpecificProvider, 'useSiteSpecificContext')
    .mockImplementation(() => ({
      ...SiteSpecificProvider.defaultState,
      filters: currFilters,
      setFilters: mockSetFilters,
      nldiIds: [],
      setNldiIds: mockSetNldiIds,
    }));
  jest.spyOn(NldiQueries, 'useNldiFeatures')
    .mockImplementation(() => ({data: undefined} as any));
})

// Cleanup mock
afterEach(() => {
  mockSetFilters.mockReset();
  mockSetFilters.mockReset();
});

describe('setNldiMapActiveStatus', () => {
  test.each([
    [false, undefined, false, undefined],
    [false, undefined, true, SiteSpecificProvider.defaultNldiFilters],
    [false, SiteSpecificProvider.defaultNldiFilters, false, SiteSpecificProvider.defaultNldiFilters],
    [false, SiteSpecificProvider.defaultNldiFilters, true, SiteSpecificProvider.defaultNldiFilters],
    [false, differentNldiFilters, false, differentNldiFilters],
    [false, differentNldiFilters, true, differentNldiFilters],
    [true, undefined, false, undefined],
    [true, undefined, true, SiteSpecificProvider.defaultNldiFilters],
    [true, SiteSpecificProvider.defaultNldiFilters, false, SiteSpecificProvider.defaultNldiFilters],
    [true, SiteSpecificProvider.defaultNldiFilters, true, SiteSpecificProvider.defaultNldiFilters],
    [true, differentNldiFilters, false, differentNldiFilters],
    [true, differentNldiFilters, true, differentNldiFilters],
  ])
  ('set', (initialIsActive, initialNldiData, setValue, expectedNldiData) =>{
    currFilters = {
      ...SiteSpecificProvider.defaultFilters,
      isNldiFilterActive: initialIsActive,
      nldiFilterData: initialNldiData
    }
    const {result: {current: {setNldiMapActiveStatus}}} = renderHook(() => useNldiFilter());

    setNldiMapActiveStatus(setValue)

    expect(mockSetFilters).toBeCalledTimes(1);
    expect(mockSetFilters.mock.calls[0][0](currFilters)).toEqual({
      ...SiteSpecificProvider.defaultFilters,
      isNldiFilterActive: setValue,
      nldiFilterData: expectedNldiData
    })
  })
})

describe('setLatLong', () => {
  test.each([
    [false, undefined, null, null, SiteSpecificProvider.defaultNldiFilters],
    [false, undefined, 20, null, {...SiteSpecificProvider.defaultNldiFilters, latitude: 20}],
    [false, undefined, null, -80, {...SiteSpecificProvider.defaultNldiFilters, longitude: -80}],
    [false, undefined, 20, -80, {...SiteSpecificProvider.defaultNldiFilters, latitude: 20, longitude: -80}],
    [false, SiteSpecificProvider.defaultNldiFilters, null, null, SiteSpecificProvider.defaultNldiFilters],
    [false, SiteSpecificProvider.defaultNldiFilters, 20, null, {...SiteSpecificProvider.defaultNldiFilters, latitude: 20}],
    [false, SiteSpecificProvider.defaultNldiFilters, null, -80, {...SiteSpecificProvider.defaultNldiFilters, longitude: -80}],
    [false, SiteSpecificProvider.defaultNldiFilters, 20, -80, {...SiteSpecificProvider.defaultNldiFilters, latitude: 20, longitude: -80}],
    [false, differentNldiFilters, null, null, {...differentNldiFilters, latitude: null, longitude: null}],
    [false, differentNldiFilters, 20, null, {...differentNldiFilters, latitude: 20, longitude: null}],
    [false, differentNldiFilters, null, -80, {...differentNldiFilters, latitude: null, longitude: -80}],
    [false, differentNldiFilters, 20, -80, {...differentNldiFilters, latitude: 20, longitude: -80}],
    [true, undefined, null, null, SiteSpecificProvider.defaultNldiFilters],
    [true, undefined, 20, null, {...SiteSpecificProvider.defaultNldiFilters, latitude: 20}],
    [true, undefined, null, -80, {...SiteSpecificProvider.defaultNldiFilters, longitude: -80}],
    [true, undefined, 20, -80, {...SiteSpecificProvider.defaultNldiFilters, latitude: 20, longitude: -80}],
    [true, SiteSpecificProvider.defaultNldiFilters, null, null, SiteSpecificProvider.defaultNldiFilters],
    [true, SiteSpecificProvider.defaultNldiFilters, 20, null, {...SiteSpecificProvider.defaultNldiFilters, latitude: 20}],
    [true, SiteSpecificProvider.defaultNldiFilters, null, -80, {...SiteSpecificProvider.defaultNldiFilters, longitude: -80}],
    [true, SiteSpecificProvider.defaultNldiFilters, 20, -80, {...SiteSpecificProvider.defaultNldiFilters, latitude: 20, longitude: -80}],
    [true, differentNldiFilters, null, null, {...differentNldiFilters, latitude: null, longitude: null}],
    [true, differentNldiFilters, 20, null, {...differentNldiFilters, latitude: 20, longitude: null}],
    [true, differentNldiFilters, null, -80, {...differentNldiFilters, latitude: null, longitude: -80}],
    [true, differentNldiFilters, 20, -80, {...differentNldiFilters, latitude: 20, longitude: -80}],
  ])
  ('set', (initialIsActive, initialNldiData, setLat, setLng, expectedNldiData) =>{
    currFilters = {
      ...SiteSpecificProvider.defaultFilters,
      isNldiFilterActive: initialIsActive,
      nldiFilterData: initialNldiData
    }
    const {result: {current: {setLatLong}}} = renderHook(() => useNldiFilter());

    setLatLong(setLat, setLng);

    expect(mockSetFilters).toBeCalledTimes(1);
    expect(mockSetFilters.mock.calls[0][0](currFilters)).toEqual({
      ...SiteSpecificProvider.defaultFilters,
      isNldiFilterActive: initialIsActive,
      nldiFilterData: expectedNldiData
    })
  })
})