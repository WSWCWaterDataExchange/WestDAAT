import * as urlParameters from '../../../../../hooks/url-parameters/useUrlParameters';
import { renderHook } from '@testing-library/react-hooks'
import { WaterRightsFilters } from '../../Provider';
import { useFiltersUrlParameters } from './useFiltersUrlParameters';
import { Optional } from '../../../../../HelperTypes';
import { BeneficialUseListItem, ConsumptionCategoryType } from '../../../../../data-contracts/BeneficialUseListItem';

let mockGetParameterWaterRights = jest.fn();
let mockSetParameterWaterRights = jest.fn();
let mockGetIsNldiParameterActive = jest.fn();
let mockSetIsNldiParameterActive = jest.fn();

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
}

const filtersWithDefinedNldiActive = {
  ...filtersWithUndefinedNldiActive,
  isNldiFilterActive: false,
}

const geoJsonDataNew: GeoJSON.Feature<GeoJSON.Geometry> = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: []
  },
  properties: {}
};
const geoJsonDataOld: GeoJSON.Feature<GeoJSON.Geometry> = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: []
  },
  properties: {}
};

beforeEach(() =>{
  mockSetParameterWaterRights.mockImplementation((a) =>{
    mockGetParameterWaterRights.mockReturnValue(a);
  })
  mockSetIsNldiParameterActive.mockImplementation((a) =>{
    mockGetIsNldiParameterActive.mockReturnValue(a);
  })
  jest.spyOn(urlParameters, 'useUrlParameters')
    .mockReturnValueOnce({
      getParameter: mockGetParameterWaterRights,
      setParameter: mockSetParameterWaterRights
    })
    .mockReturnValueOnce({
      getParameter: mockGetIsNldiParameterActive,
      setParameter: mockSetIsNldiParameterActive
    });
})

// Cleanup mock
afterEach(() => {
  mockGetParameterWaterRights.mockReset();
  mockSetParameterWaterRights.mockReset();
  mockGetIsNldiParameterActive.mockReset();
  mockSetIsNldiParameterActive.mockReset();
});

describe('getParameter', () => {
  test('no existing URL parameters', () =>{
    mockGetParameterWaterRights.mockReturnValue(undefined);
    mockGetIsNldiParameterActive.mockReturnValue(undefined);

    const {result: {current: {getParameter}}} = renderHook(() => useFiltersUrlParameters());

    const paramResult = getParameter();

    expect(paramResult).toBeUndefined();

    expect(mockSetIsNldiParameterActive).toBeCalledWith(undefined);
    expect(mockSetParameterWaterRights).not.toBeCalled();
  });

  describe('Filters are set in URL', () => {
    describe('NLDI Migration', () =>{
      test.each([
        [true, true],
        [true, false],
        [true, undefined],
        [false, true],
        [false, false],
        [false, undefined]
      ])('filter nldi state %s, nldi state: %s', (initialFilter: boolean, initialNldi: boolean | undefined) =>{
        mockGetParameterWaterRights.mockReturnValue({...filtersWithUndefinedNldiActive, isNldiFilterActive: initialFilter});
        mockGetIsNldiParameterActive.mockReturnValue(initialNldi);
    
        const {result: {current: {getParameter}}} = renderHook(() => useFiltersUrlParameters());
    
        const paramResult = getParameter();
    
        expect(paramResult?.isNldiFilterActive).toBe(initialFilter);
    
        expect(mockSetIsNldiParameterActive).toBeCalledWith(undefined);
        expect(mockSetParameterWaterRights).not.toBeCalled();
      })
  
      test.each([
        [true, true],
        [false, false],
        [undefined, false]
      ])('filter nldi state undefined, nldi state: %s', (initialNldi: boolean | undefined, expectedNldi: boolean) =>{
        mockGetParameterWaterRights.mockReturnValue({...filtersWithUndefinedNldiActive});
        mockGetIsNldiParameterActive.mockReturnValue(initialNldi);
    
        const {result: {current: {getParameter}}} = renderHook(() => useFiltersUrlParameters());
    
        const paramResult = getParameter();
    
        expect(paramResult?.isNldiFilterActive).toBe(expectedNldi);
    
        expect(mockSetIsNldiParameterActive).toBeCalledWith(undefined);
        expect(mockSetParameterWaterRights).toBeCalledTimes(1);
        expect(mockSetParameterWaterRights.mock.calls[0][0].isNldiFilterActive).toBe(expectedNldi);
      })
    })
    
    describe('Beneficial Use Migration', () =>{
      test.each([
        [undefined, [], undefined],
        [undefined, [{beneficialUseName: "b", consumptionCategory: ConsumptionCategoryType.NonConsumptive}], ["b"]],
        [[], [], []],
        [[], [{beneficialUseName: "b", consumptionCategory: ConsumptionCategoryType.NonConsumptive}], []],
        [["a"], [], ["a"]],
        [["a"], [{beneficialUseName: "b", consumptionCategory: ConsumptionCategoryType.NonConsumptive}], ["a"]]
      ])('Has Migration - names %j, uses: %j', (initialNames: string[] | undefined, initialUses: BeneficialUseListItem[] | undefined, expectedNames: string[] |  undefined) =>{
        mockGetParameterWaterRights.mockReturnValue({...filtersWithDefinedNldiActive, beneficialUseNames: initialNames, beneficialUses: initialUses});
        mockGetIsNldiParameterActive.mockReturnValue(undefined);
    
        const {result: {current: {getParameter}}} = renderHook(() => useFiltersUrlParameters());
    
        const paramResult = getParameter();
    
        expect(paramResult?.beneficialUseNames).toEqual(expectedNames);
    
        expect(mockSetParameterWaterRights).toBeCalledTimes(1);
        expect(mockSetParameterWaterRights.mock.calls[0][0].beneficialUses).toBeUndefined();
        expect(mockSetParameterWaterRights.mock.calls[0][0].beneficialUseNames).toEqual(expectedNames);
      });
  
      test.each([
        [undefined, undefined],
        [[], undefined],
        [["a"], undefined]
      ])('No Migration - names %j, uses: %j', (initialNames: string[] | undefined, initialUses: BeneficialUseListItem[] | undefined) =>{
        mockGetParameterWaterRights.mockReturnValue({...filtersWithDefinedNldiActive, beneficialUseNames: initialNames, beneficialUses: initialUses});
        mockGetIsNldiParameterActive.mockReturnValue(undefined);
    
        const {result: {current: {getParameter}}} = renderHook(() => useFiltersUrlParameters());
    
        const paramResult = getParameter();
    
        expect(paramResult?.beneficialUseNames).toEqual(initialNames);
    
        expect(mockSetParameterWaterRights).toBeCalledTimes(0);
      });
    })
    
    describe('Polyline Migration', () =>{
      test.each([
        [undefined, [], undefined],
        [undefined, [{identifier: "b", data: geoJsonDataOld}], [geoJsonDataOld]],
        [[], [{identifier: "b", data: geoJsonDataOld}], []],
        [[], [{identifier: "b", data: geoJsonDataOld}], []],
        [[geoJsonDataNew], [], [geoJsonDataNew]],
        [[geoJsonDataNew], [{identifier: "b", data: geoJsonDataOld}], [geoJsonDataNew]]
      ])('Has Migration - new %j, old: %j', (initialNew: GeoJSON.Feature<GeoJSON.Geometry>[] | undefined, initialOld: { identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> }[] | undefined, expectedNames: GeoJSON.Feature<GeoJSON.Geometry>[] |  undefined) =>{
        mockGetParameterWaterRights.mockReturnValue({...filtersWithDefinedNldiActive, polylines: initialNew, polyline: initialOld});
        mockGetIsNldiParameterActive.mockReturnValue(undefined);
    
        const {result: {current: {getParameter}}} = renderHook(() => useFiltersUrlParameters());
    
        const paramResult = getParameter();
    
        expect(paramResult?.polylines).toEqual(expectedNames);
    
        expect(mockSetParameterWaterRights).toBeCalledTimes(1);
        expect(mockSetParameterWaterRights.mock.calls[0][0].polyline).toBeUndefined();
        expect(mockSetParameterWaterRights.mock.calls[0][0].polylines).toEqual(expectedNames);
      });
  
      test.each([
        [undefined, undefined],
        [[], undefined],
        [[geoJsonDataNew], undefined]
      ])('No Migration - names %j, uses: %j', (initialNew: GeoJSON.Feature<GeoJSON.Geometry>[] | undefined, initialOld: { identifier: string, data: GeoJSON.Feature<GeoJSON.Geometry> }[] | undefined) =>{
        mockGetParameterWaterRights.mockReturnValue({...filtersWithDefinedNldiActive, polylines: initialNew, polyline: initialOld});
        mockGetIsNldiParameterActive.mockReturnValue(undefined);
    
        const {result: {current: {getParameter}}} = renderHook(() => useFiltersUrlParameters());
    
        const paramResult = getParameter();
    
        expect(paramResult?.polylines).toEqual(initialNew);
    
        expect(mockSetParameterWaterRights).toBeCalledTimes(0);
      });
    })
  })
  
});