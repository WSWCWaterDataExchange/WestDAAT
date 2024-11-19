import { renderHook } from '@testing-library/react-hooks';
import { useNldiFilter } from './useNldiFilter';
import * as WaterRightsProvider from '../../Provider';
import * as NldiQueries from '../../../../../hooks/queries/useNldiQuery';
import { DataPoints, Directions } from '../../../../../data-contracts/nldi';

let currFilters = { ...WaterRightsProvider.defaultFilters };
const differentNldiFilters = {
  latitude: 30,
  longitude: -90,
  directions: Directions.Downsteam,
  dataPoints: DataPoints.Epa,
};
const mockSetFilters = jest.fn((a) => (currFilters = a()));
const mockSetNldiIds = jest.fn();

beforeEach(() => {
  jest
    .spyOn(WaterRightsProvider, 'useWaterRightsContext')
    .mockImplementation(() => ({
      ...WaterRightsProvider.defaultState,
      filters: currFilters,
      setFilters: mockSetFilters,
      nldiIds: [],
      setNldiIds: mockSetNldiIds,
    }));
  jest
    .spyOn(NldiQueries, 'useNldiFeatures')
    .mockImplementation(() => ({ data: undefined }) as any);
});

// Cleanup mock
afterEach(() => {
  mockSetFilters.mockReset();
  mockSetFilters.mockReset();
});

describe('setNldiMapActiveStatus', () => {
  test.each([
    [false, undefined, false, undefined],
    [false, undefined, true, WaterRightsProvider.defaultNldiFilters],
    [
      false,
      WaterRightsProvider.defaultNldiFilters,
      false,
      WaterRightsProvider.defaultNldiFilters,
    ],
    [
      false,
      WaterRightsProvider.defaultNldiFilters,
      true,
      WaterRightsProvider.defaultNldiFilters,
    ],
    [false, differentNldiFilters, false, differentNldiFilters],
    [false, differentNldiFilters, true, differentNldiFilters],
    [true, undefined, false, undefined],
    [true, undefined, true, WaterRightsProvider.defaultNldiFilters],
    [
      true,
      WaterRightsProvider.defaultNldiFilters,
      false,
      WaterRightsProvider.defaultNldiFilters,
    ],
    [
      true,
      WaterRightsProvider.defaultNldiFilters,
      true,
      WaterRightsProvider.defaultNldiFilters,
    ],
    [true, differentNldiFilters, false, differentNldiFilters],
    [true, differentNldiFilters, true, differentNldiFilters],
  ])('set', (initialIsActive, initialNldiData, setValue, expectedNldiData) => {
    currFilters = {
      ...WaterRightsProvider.defaultFilters,
      isNldiFilterActive: initialIsActive,
      nldiFilterData: initialNldiData,
    };
    const {
      result: {
        current: { setNldiMapActiveStatus },
      },
    } = renderHook(() => useNldiFilter());

    setNldiMapActiveStatus(setValue);

    expect(mockSetFilters).toBeCalledTimes(1);
    expect(mockSetFilters.mock.calls[0][0](currFilters)).toEqual({
      ...WaterRightsProvider.defaultFilters,
      isNldiFilterActive: setValue,
      nldiFilterData: expectedNldiData,
    });
  });
});

describe('setLatLong', () => {
  test.each([
    [false, undefined, null, null, WaterRightsProvider.defaultNldiFilters],
    [
      false,
      undefined,
      20,
      null,
      { ...WaterRightsProvider.defaultNldiFilters, latitude: 20 },
    ],
    [
      false,
      undefined,
      null,
      -80,
      { ...WaterRightsProvider.defaultNldiFilters, longitude: -80 },
    ],
    [
      false,
      undefined,
      20,
      -80,
      {
        ...WaterRightsProvider.defaultNldiFilters,
        latitude: 20,
        longitude: -80,
      },
    ],
    [
      false,
      WaterRightsProvider.defaultNldiFilters,
      null,
      null,
      WaterRightsProvider.defaultNldiFilters,
    ],
    [
      false,
      WaterRightsProvider.defaultNldiFilters,
      20,
      null,
      { ...WaterRightsProvider.defaultNldiFilters, latitude: 20 },
    ],
    [
      false,
      WaterRightsProvider.defaultNldiFilters,
      null,
      -80,
      { ...WaterRightsProvider.defaultNldiFilters, longitude: -80 },
    ],
    [
      false,
      WaterRightsProvider.defaultNldiFilters,
      20,
      -80,
      {
        ...WaterRightsProvider.defaultNldiFilters,
        latitude: 20,
        longitude: -80,
      },
    ],
    [
      false,
      differentNldiFilters,
      null,
      null,
      { ...differentNldiFilters, latitude: null, longitude: null },
    ],
    [
      false,
      differentNldiFilters,
      20,
      null,
      { ...differentNldiFilters, latitude: 20, longitude: null },
    ],
    [
      false,
      differentNldiFilters,
      null,
      -80,
      { ...differentNldiFilters, latitude: null, longitude: -80 },
    ],
    [
      false,
      differentNldiFilters,
      20,
      -80,
      { ...differentNldiFilters, latitude: 20, longitude: -80 },
    ],
    [true, undefined, null, null, WaterRightsProvider.defaultNldiFilters],
    [
      true,
      undefined,
      20,
      null,
      { ...WaterRightsProvider.defaultNldiFilters, latitude: 20 },
    ],
    [
      true,
      undefined,
      null,
      -80,
      { ...WaterRightsProvider.defaultNldiFilters, longitude: -80 },
    ],
    [
      true,
      undefined,
      20,
      -80,
      {
        ...WaterRightsProvider.defaultNldiFilters,
        latitude: 20,
        longitude: -80,
      },
    ],
    [
      true,
      WaterRightsProvider.defaultNldiFilters,
      null,
      null,
      WaterRightsProvider.defaultNldiFilters,
    ],
    [
      true,
      WaterRightsProvider.defaultNldiFilters,
      20,
      null,
      { ...WaterRightsProvider.defaultNldiFilters, latitude: 20 },
    ],
    [
      true,
      WaterRightsProvider.defaultNldiFilters,
      null,
      -80,
      { ...WaterRightsProvider.defaultNldiFilters, longitude: -80 },
    ],
    [
      true,
      WaterRightsProvider.defaultNldiFilters,
      20,
      -80,
      {
        ...WaterRightsProvider.defaultNldiFilters,
        latitude: 20,
        longitude: -80,
      },
    ],
    [
      true,
      differentNldiFilters,
      null,
      null,
      { ...differentNldiFilters, latitude: null, longitude: null },
    ],
    [
      true,
      differentNldiFilters,
      20,
      null,
      { ...differentNldiFilters, latitude: 20, longitude: null },
    ],
    [
      true,
      differentNldiFilters,
      null,
      -80,
      { ...differentNldiFilters, latitude: null, longitude: -80 },
    ],
    [
      true,
      differentNldiFilters,
      20,
      -80,
      { ...differentNldiFilters, latitude: 20, longitude: -80 },
    ],
  ])(
    'set',
    (initialIsActive, initialNldiData, setLat, setLng, expectedNldiData) => {
      currFilters = {
        ...WaterRightsProvider.defaultFilters,
        isNldiFilterActive: initialIsActive,
        nldiFilterData: initialNldiData,
      };
      const {
        result: {
          current: { setLatLong },
        },
      } = renderHook(() => useNldiFilter());

      setLatLong(setLat, setLng);

      expect(mockSetFilters).toBeCalledTimes(1);
      expect(mockSetFilters.mock.calls[0][0](currFilters)).toEqual({
        ...WaterRightsProvider.defaultFilters,
        isNldiFilterActive: initialIsActive,
        nldiFilterData: expectedNldiData,
      });
    },
  );
});
