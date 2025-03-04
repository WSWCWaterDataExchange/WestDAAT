import { renderHook } from '@testing-library/react';
import * as urlParameters from '../../../../../hooks/url-parameters/useUrlParameters';
import {
  NldiFilters,
  WaterRightsFilters,
  defaultWaterRightsFilters,
} from '../../sidebar-filtering/WaterRightsProvider';
import { useFiltersUrlParameters } from './useFiltersUrlParameters';
import { Optional } from '../../../../../HelperTypes';
import { BeneficialUseListItem, ConsumptionCategoryType } from '../../../../../data-contracts/BeneficialUseListItem';
import { DataPoints, Directions } from '../../../../../data-contracts/nldi';

const mockGetParameterWaterRights = jest.fn();
const mockSetParameterWaterRights = jest.fn();
const mockGetIsNldiParameterActive = jest.fn();
const mockSetIsNldiParameterActive = jest.fn();

const filtersWithUndefinedNldiActive: Optional<WaterRightsFilters, 'isNldiFilterActive'> = {
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
  isNldiFilterActive: undefined,
  nldiFilterData: undefined,
  isWaterRightsFilterActive: true,
};

const filtersWithDefinedNldiActive = {
  ...filtersWithUndefinedNldiActive,
  isNldiFilterActive: false,
};

const populatedNldiFilterData: NldiFilters = {
  latitude: 40,
  longitude: -100,
  dataPoints: DataPoints.WadeTimeseries | DataPoints.WadeRights | DataPoints.Usgs | DataPoints.Epa,
  directions: Directions.Upstream | Directions.Downstream,
};

const geoJsonDataNew: GeoJSON.Feature<GeoJSON.Geometry> = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [],
  },
  properties: {},
};
const geoJsonDataOld: GeoJSON.Feature<GeoJSON.Geometry> = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [],
  },
  properties: {},
};

beforeEach(() => {
  mockSetParameterWaterRights.mockImplementation((a) => {
    mockGetParameterWaterRights.mockReturnValue(a);
  });
  mockSetIsNldiParameterActive.mockImplementation((a) => {
    mockGetIsNldiParameterActive.mockReturnValue(a);
  });
  jest
    .spyOn(urlParameters, 'useUrlParameters')
    .mockReturnValueOnce({
      getParameter: mockGetParameterWaterRights,
      setParameter: mockSetParameterWaterRights,
    })
    .mockReturnValueOnce({
      getParameter: mockGetIsNldiParameterActive,
      setParameter: mockSetIsNldiParameterActive,
    });
});

// Cleanup mock
afterEach(() => {
  mockGetParameterWaterRights.mockReset();
  mockSetParameterWaterRights.mockReset();
  mockGetIsNldiParameterActive.mockReset();
  mockSetIsNldiParameterActive.mockReset();
});

describe('setParameter', () => {
  test('undefined', () => {
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(undefined);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0]).toBeUndefined();
  });
  test.each([
    [undefined, defaultWaterRightsFilters.allocationOwner],
    ['', defaultWaterRightsFilters.allocationOwner],
    [' ', defaultWaterRightsFilters.allocationOwner],
    ['a', 'a'],
    [' a', 'a'],
    ['a ', 'a'],
    [' a ', 'a'],
  ])('allocationOwner %j', (initial, expected) => {
    const filters = {
      ...filtersWithDefinedNldiActive,
      allocationOwner: initial,
    };
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(filters);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0].allocationOwner).toBe(expected);
  });

  test.each([
    [undefined, defaultWaterRightsFilters.beneficialUseNames],
    [[], defaultWaterRightsFilters.beneficialUseNames],
    [['a'], ['a']],
  ])('beneficialUseNames %j', (initial, expected) => {
    const filters = {
      ...filtersWithDefinedNldiActive,
      beneficialUseNames: initial,
    };
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(filters);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0].beneficialUseNames).toEqual(expected);
  });

  test.each([
    [false, undefined, defaultWaterRightsFilters.nldiFilterData],
    [false, populatedNldiFilterData, defaultWaterRightsFilters.nldiFilterData],
    [true, undefined, defaultWaterRightsFilters.nldiFilterData],
    [true, populatedNldiFilterData, populatedNldiFilterData],
  ])('beneficialUseNames %j', (initialIsNldiFilterActive, initialNldiFilterData, expected) => {
    const filters = {
      ...filtersWithDefinedNldiActive,
      isNldiFilterActive: initialIsNldiFilterActive,
      nldiFilterData: initialNldiFilterData,
    };
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(filters);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0].isNldiFilterActive).toEqual(initialIsNldiFilterActive);
    expect(mockSetParameterWaterRights.mock.calls[0][0].nldiFilterData).toEqual(expected);
  });

  test.each([
    [undefined, defaultWaterRightsFilters.ownerClassifications],
    [[], defaultWaterRightsFilters.ownerClassifications],
    [['a'], ['a']],
  ])('ownerClassifications %j', (initial, expected) => {
    const filters = {
      ...filtersWithDefinedNldiActive,
      ownerClassifications: initial,
    };
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(filters);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0].ownerClassifications).toEqual(expected);
  });

  test.each([
    [undefined, defaultWaterRightsFilters.polylines],
    [[], defaultWaterRightsFilters.polylines],
    [[geoJsonDataNew], [geoJsonDataNew]],
  ])('polylines %j', (initial, expected) => {
    const filters = { ...filtersWithDefinedNldiActive, polylines: initial };
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(filters);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0].polylines).toEqual(expected);
  });

  test.each([
    [undefined, defaultWaterRightsFilters.riverBasinNames],
    [[], defaultWaterRightsFilters.riverBasinNames],
    [['a'], ['a']],
  ])('riverBasinNames %j', (initial, expected) => {
    const filters = {
      ...filtersWithDefinedNldiActive,
      riverBasinNames: initial,
    };
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(filters);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0].riverBasinNames).toEqual(expected);
  });

  test.each([
    [undefined, defaultWaterRightsFilters.states],
    [[], defaultWaterRightsFilters.states],
    [['a'], ['a']],
  ])('states %j', (initial, expected) => {
    const filters = { ...filtersWithDefinedNldiActive, states: initial };
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(filters);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0].states).toEqual(expected);
  });

  test.each([
    [undefined, defaultWaterRightsFilters.waterSourceTypes],
    [[], defaultWaterRightsFilters.waterSourceTypes],
    [['a'], ['a']],
  ])('states %j', (initial, expected) => {
    const filters = {
      ...filtersWithDefinedNldiActive,
      waterSourceTypes: initial,
    };
    const {
      result: {
        current: { setParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    setParameter(filters);

    expect(mockSetParameterWaterRights).toBeCalledTimes(1);
    expect(mockSetParameterWaterRights.mock.calls[0][0].waterSourceTypes).toEqual(expected);
  });
});
describe('getParameter', () => {
  test('no existing URL parameters', () => {
    mockGetParameterWaterRights.mockReturnValue(undefined);
    mockGetIsNldiParameterActive.mockReturnValue(undefined);

    const {
      result: {
        current: { getParameter },
      },
    } = renderHook(() => useFiltersUrlParameters());

    const paramResult = getParameter();

    expect(paramResult).toBeUndefined();

    expect(mockSetIsNldiParameterActive).toBeCalledWith(undefined);
    expect(mockSetParameterWaterRights).not.toBeCalled();
  });

  describe('Filters are set in URL', () => {
    describe('NLDI Migration', () => {
      test.each([
        [true, true],
        [true, false],
        [true, undefined],
        [false, true],
        [false, false],
        [false, undefined],
      ])('filter nldi state %s, nldi state: %s', (initialFilter: boolean, initialNldi: boolean | undefined) => {
        mockGetParameterWaterRights.mockReturnValue({
          ...filtersWithUndefinedNldiActive,
          isNldiFilterActive: initialFilter,
        });
        mockGetIsNldiParameterActive.mockReturnValue(initialNldi);

        const {
          result: {
            current: { getParameter },
          },
        } = renderHook(() => useFiltersUrlParameters());

        const paramResult = getParameter();

        expect(paramResult?.isNldiFilterActive).toBe(initialFilter);

        expect(mockSetIsNldiParameterActive).toBeCalledWith(undefined);
        expect(mockSetParameterWaterRights).not.toBeCalled();
      });

      test.each([
        [null],
        [undefined],
        [
          {
            latitude: 40,
            longitude: -110,
            directions: Directions.Downstream,
            dataPoints: DataPoints.Usgs,
          },
        ],
      ])('nldiFilterData null migration, %j', (initialNldiFilterData: NldiFilters | null | undefined) => {
        mockGetParameterWaterRights.mockReturnValue({
          ...filtersWithUndefinedNldiActive,
          nldiFilterData: initialNldiFilterData,
          isNldiFilterActive: true,
        });

        const {
          result: {
            current: { getParameter },
          },
        } = renderHook(() => useFiltersUrlParameters());

        const paramResult = getParameter();

        expect(paramResult?.nldiFilterData).toBe(initialNldiFilterData || undefined);

        expect(mockSetIsNldiParameterActive).toBeCalledWith(undefined);
        expect(mockSetParameterWaterRights).toBeCalledTimes(initialNldiFilterData === null ? 1 : 0);
      });

      test.each([
        [true, true],
        [false, false],
        [undefined, false],
      ])('filter nldi state undefined, nldi state: %s', (initialNldi: boolean | undefined, expectedNldi: boolean) => {
        mockGetParameterWaterRights.mockReturnValue({
          ...filtersWithUndefinedNldiActive,
        });
        mockGetIsNldiParameterActive.mockReturnValue(initialNldi);

        const {
          result: {
            current: { getParameter },
          },
        } = renderHook(() => useFiltersUrlParameters());

        const paramResult = getParameter();

        expect(paramResult?.isNldiFilterActive).toBe(expectedNldi);

        expect(mockSetIsNldiParameterActive).toBeCalledWith(undefined);
        expect(mockSetParameterWaterRights).toBeCalledTimes(1);
        expect(mockSetParameterWaterRights.mock.calls[0][0].isNldiFilterActive).toBe(expectedNldi);
      });
    });

    describe('Beneficial Use Migration', () => {
      test.each([
        [undefined, [], undefined],
        [
          undefined,
          [
            {
              beneficialUseName: 'b',
              consumptionCategory: ConsumptionCategoryType.NonConsumptive,
            },
          ],
          ['b'],
        ],
        [[], [], undefined],
        [
          [],
          [
            {
              beneficialUseName: 'b',
              consumptionCategory: ConsumptionCategoryType.NonConsumptive,
            },
          ],
          undefined,
        ],
        [['a'], [], ['a']],
        [
          ['a'],
          [
            {
              beneficialUseName: 'b',
              consumptionCategory: ConsumptionCategoryType.NonConsumptive,
            },
          ],
          ['a'],
        ],
      ])(
        'Has Migration - names %j, uses: %j',
        (
          initialNames: string[] | undefined,
          initialUses: BeneficialUseListItem[] | undefined,
          expectedNames: string[] | undefined,
        ) => {
          mockGetParameterWaterRights.mockReturnValue({
            ...filtersWithDefinedNldiActive,
            beneficialUseNames: initialNames,
            beneficialUses: initialUses,
          });
          mockGetIsNldiParameterActive.mockReturnValue(undefined);

          const {
            result: {
              current: { getParameter },
            },
          } = renderHook(() => useFiltersUrlParameters());

          const paramResult = getParameter();

          expect(paramResult?.beneficialUseNames).toEqual(expectedNames);

          expect(mockSetParameterWaterRights).toBeCalledTimes(1);
          expect(mockSetParameterWaterRights.mock.calls[0][0].beneficialUses).toBeUndefined();
          expect(mockSetParameterWaterRights.mock.calls[0][0].beneficialUseNames).toEqual(expectedNames);
        },
      );

      test.each([
        [undefined, undefined],
        [[], undefined],
        [['a'], undefined],
      ])(
        'No Migration - names %j, uses: %j',
        (initialNames: string[] | undefined, initialUses: BeneficialUseListItem[] | undefined) => {
          mockGetParameterWaterRights.mockReturnValue({
            ...filtersWithDefinedNldiActive,
            beneficialUseNames: initialNames,
            beneficialUses: initialUses,
          });
          mockGetIsNldiParameterActive.mockReturnValue(undefined);

          const {
            result: {
              current: { getParameter },
            },
          } = renderHook(() => useFiltersUrlParameters());

          const paramResult = getParameter();

          expect(paramResult?.beneficialUseNames).toEqual(initialNames);

          expect(mockSetParameterWaterRights).toBeCalledTimes(0);
        },
      );
    });

    describe('Polyline Migration', () => {
      test.each([
        [undefined, [], undefined],
        [undefined, [{ identifier: 'b', data: geoJsonDataOld }], [geoJsonDataOld]],
        [[], [{ identifier: 'b', data: geoJsonDataOld }], undefined],
        [[], [{ identifier: 'b', data: geoJsonDataOld }], undefined],
        [[geoJsonDataNew], [], [geoJsonDataNew]],
        [[geoJsonDataNew], [{ identifier: 'b', data: geoJsonDataOld }], [geoJsonDataNew]],
      ])(
        'Has Migration - new %j, old: %j',
        (
          initialNew: GeoJSON.Feature<GeoJSON.Geometry>[] | undefined,
          initialOld: { identifier: string; data: GeoJSON.Feature<GeoJSON.Geometry> }[] | undefined,
          expectedNames: GeoJSON.Feature<GeoJSON.Geometry>[] | undefined,
        ) => {
          mockGetParameterWaterRights.mockReturnValue({
            ...filtersWithDefinedNldiActive,
            polylines: initialNew,
            polyline: initialOld,
          });
          mockGetIsNldiParameterActive.mockReturnValue(undefined);

          const {
            result: {
              current: { getParameter },
            },
          } = renderHook(() => useFiltersUrlParameters());

          const paramResult = getParameter();

          expect(paramResult?.polylines).toEqual(expectedNames);

          expect(mockSetParameterWaterRights).toBeCalledTimes(1);
          expect(mockSetParameterWaterRights.mock.calls[0][0].polyline).toBeUndefined();
          expect(mockSetParameterWaterRights.mock.calls[0][0].polylines).toEqual(expectedNames);
        },
      );

      test.each([
        [undefined, undefined],
        [[], undefined],
        [[geoJsonDataNew], undefined],
      ])(
        'No Migration - names %j, uses: %j',
        (
          initialNew: GeoJSON.Feature<GeoJSON.Geometry>[] | undefined,
          initialOld: { identifier: string; data: GeoJSON.Feature<GeoJSON.Geometry> }[] | undefined,
        ) => {
          mockGetParameterWaterRights.mockReturnValue({
            ...filtersWithDefinedNldiActive,
            polylines: initialNew,
            polyline: initialOld,
          });
          mockGetIsNldiParameterActive.mockReturnValue(undefined);

          const {
            result: {
              current: { getParameter },
            },
          } = renderHook(() => useFiltersUrlParameters());

          const paramResult = getParameter();

          expect(paramResult?.polylines).toEqual(initialNew);

          expect(mockSetParameterWaterRights).toBeCalledTimes(0);
        },
      );
    });
  });
});
