import { act, renderHook } from '@testing-library/react';
import { useUrlParameters } from './useUrlParameters';

let mockUrlParams: Record<string, any> = {};
const mockSetUrlParam = jest.fn();
const mockGetUrlParam = jest.fn();

const sampleObject = { a: 'has value' };
const diffObject = { ...sampleObject, a: 'diff value' };

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useContext: () => ({
      setUrlParam: mockSetUrlParam,
      getUrlParam: mockGetUrlParam,
    }),
  };
});

beforeEach(() => {
  mockSetUrlParam.mockImplementation((key: string, value: any): void => {
    if (value === undefined) {
      delete mockUrlParams[key];
    } else {
      mockUrlParams[key] = value;
    }
  });

  mockGetUrlParam.mockImplementation(<T>(key: string): T | undefined => {
    const param = mockUrlParams[key];
    if (param) {
      return param as T;
    }
  });
});

// Cleanup mock
afterEach(() => {
  mockSetUrlParam.mockReset();
  mockGetUrlParam.mockReset();

  mockUrlParams = {};
});

describe('Initial Call', () => {
  describe('Single Key', () => {
    describe('URL Parameter Not Set', () => {
      test.each([
        ['test-key', sampleObject],
        ['test-key', undefined],
        [['test-key'], sampleObject],
        [['test-key'], undefined],
      ])('Key: %s, Default: %s', (key, defaultObject) => {
        const {
          result: {
            current: { getParameter },
          },
        } = renderHook(() => useUrlParameters(key, defaultObject));

        expect(getParameter()).toBeUndefined();

        expect(mockUrlParams['test-key']).toBeUndefined();

        expect(Object.keys(mockUrlParams)).toEqual([]);
      });
    });

    describe('URL Parameter Set', () => {
      test.each([
        ['test-key', sampleObject, undefined],
        ['test-key', diffObject, sampleObject],
        ['test-key', undefined, sampleObject],
        [['test-key'], sampleObject, undefined],
        [['test-key'], diffObject, sampleObject],
        [['test-key'], undefined, sampleObject],
      ])(
        'Key: %s, Default: %s',
        (key, defaultObject, expectedParameterValue) => {
          mockSetUrlParam('test-key', { ...sampleObject });

          const {
            result: {
              current: { getParameter },
            },
          } = renderHook(() => useUrlParameters(key, defaultObject));

          expect(getParameter()).toStrictEqual(expectedParameterValue);

          expect(mockUrlParams['test-key']).toStrictEqual(
            expectedParameterValue,
          );

          expect(Object.keys(mockUrlParams)).toEqual(
            expectedParameterValue ? ['test-key'] : [],
          );
        },
      );
    });
  });

  describe('Multi Key', () => {
    describe('URL Parameter Not Set', () => {
      test.each([[sampleObject], [undefined]])(
        'Default: %s',
        (defaultObject) => {
          const params = ['test-a', 'test-b', 'test-c'];

          const {
            result: {
              current: { getParameter },
            },
          } = renderHook(() => useUrlParameters(params, defaultObject));

          expect(getParameter()).toBeUndefined();

          params.forEach((a) => expect(mockUrlParams[a]).toBeUndefined());

          expect(Object.keys(mockUrlParams)).toEqual([]);
        },
      );
    });

    describe('URL Parameter Set', () => {
      test.each([
        [[sampleObject, undefined, undefined], undefined, sampleObject],
        [[sampleObject, sampleObject, undefined], undefined, sampleObject],
        [[undefined, sampleObject, undefined], undefined, sampleObject],
        [[sampleObject, undefined, undefined], sampleObject, undefined],
        [[sampleObject, sampleObject, undefined], sampleObject, undefined],
        [[undefined, sampleObject, undefined], sampleObject, undefined],
        [[sampleObject, undefined, undefined], diffObject, sampleObject],
        [[sampleObject, sampleObject, undefined], diffObject, sampleObject],
        [[undefined, sampleObject, undefined], diffObject, sampleObject],

        [[sampleObject, undefined, sampleObject], undefined, sampleObject],
        [[sampleObject, sampleObject, sampleObject], undefined, sampleObject],
        [[undefined, sampleObject, sampleObject], undefined, sampleObject],
        [[sampleObject, undefined, sampleObject], sampleObject, undefined],
        [[sampleObject, sampleObject, sampleObject], sampleObject, undefined],
        [[undefined, sampleObject, sampleObject], sampleObject, undefined],
        [[sampleObject, undefined, sampleObject], diffObject, sampleObject],
        [[sampleObject, sampleObject, sampleObject], diffObject, sampleObject],
        [[undefined, sampleObject, sampleObject], diffObject, sampleObject],

        [[sampleObject, undefined, diffObject], undefined, sampleObject],
        [[sampleObject, sampleObject, diffObject], undefined, sampleObject],
        [[undefined, sampleObject, diffObject], undefined, sampleObject],
        [[sampleObject, undefined, diffObject], sampleObject, undefined],
        [[sampleObject, sampleObject, diffObject], sampleObject, undefined],
        [[undefined, sampleObject, diffObject], sampleObject, undefined],
        [[sampleObject, undefined, diffObject], diffObject, sampleObject],
        [[sampleObject, sampleObject, diffObject], diffObject, sampleObject],
        [[undefined, sampleObject, diffObject], diffObject, sampleObject],

        [[undefined, undefined, undefined], undefined, undefined],
        [[undefined, undefined, undefined], sampleObject, undefined],
        [[undefined, undefined, sampleObject], diffObject, sampleObject],
        [[undefined, undefined, sampleObject], sampleObject, undefined],
      ])(
        'Param Values: %j, Default: %j',
        (initialObjects, defaultObject, expectedParameterValue) => {
          const params = ['test-a', 'test-b', 'test-c'];
          mockSetUrlParam(params[0], initialObjects[0]);
          mockSetUrlParam(params[1], initialObjects[1]);
          mockSetUrlParam(params[2], initialObjects[2]);

          const {
            result: {
              current: { getParameter },
            },
          } = renderHook(() => useUrlParameters(params, defaultObject));

          expect(getParameter()).toStrictEqual(expectedParameterValue);

          const [first, ...remaining] = params;
          expect(mockUrlParams[first]).toStrictEqual(expectedParameterValue);
          remaining.forEach((a) => expect(mockUrlParams[a]).toBeUndefined());

          expect(Object.keys(mockUrlParams)).toEqual(
            expectedParameterValue ? [first] : [],
          );
        },
      );
    });
  });
});

describe('Sets Url Parameter', () => {
  describe('Single Key', () => {
    test.each([
      [false, undefined, undefined, undefined, undefined],
      [false, undefined, sampleObject, undefined, sampleObject],
      [false, sampleObject, undefined, undefined, undefined],
      [false, sampleObject, sampleObject, undefined, sampleObject],
      [false, sampleObject, diffObject, undefined, diffObject],

      [false, undefined, undefined, sampleObject, undefined],
      [false, undefined, sampleObject, sampleObject, undefined],
      [false, sampleObject, undefined, sampleObject, undefined],
      [false, sampleObject, sampleObject, sampleObject, undefined],
      [false, sampleObject, diffObject, sampleObject, diffObject],

      [false, undefined, sampleObject, diffObject, sampleObject],
      [false, sampleObject, undefined, diffObject, undefined],
      [false, sampleObject, sampleObject, diffObject, sampleObject],
      [false, sampleObject, diffObject, diffObject, undefined],

      [true, undefined, undefined, undefined, undefined],
      [true, undefined, sampleObject, undefined, sampleObject],
      [true, sampleObject, undefined, undefined, undefined],
      [true, sampleObject, sampleObject, undefined, sampleObject],
      [true, sampleObject, diffObject, undefined, diffObject],

      [true, undefined, undefined, sampleObject, undefined],
      [true, undefined, sampleObject, sampleObject, undefined],
      [true, sampleObject, undefined, sampleObject, undefined],
      [true, sampleObject, sampleObject, sampleObject, undefined],
      [true, sampleObject, diffObject, sampleObject, diffObject],

      [true, undefined, sampleObject, diffObject, sampleObject],
      [true, sampleObject, undefined, diffObject, undefined],
      [true, sampleObject, sampleObject, diffObject, sampleObject],
      [true, sampleObject, diffObject, diffObject, undefined],
    ])(
      'useArray: %s Initial: %j, Set: %j, Default: %j',
      (useArray, initialObject, setObject, defaultObject, expectedObject) => {
        const keys = useArray ? ['test-key'] : 'test-key';
        mockSetUrlParam('test-key', initialObject);

        const { result } = renderHook(() =>
          useUrlParameters(keys, defaultObject),
        );

        act(() => {
          result.current.setParameter(setObject);
        });

        expect(result.current.getParameter()).toStrictEqual(expectedObject);

        expect(mockUrlParams['test-key']).toStrictEqual(expectedObject);

        expect(Object.keys(mockUrlParams)).toEqual(
          expectedObject ? ['test-key'] : [],
        );
      },
    );
  });

  describe('Multi Key', () => {
    test.each([
      [undefined, undefined, undefined, undefined],
      [undefined, sampleObject, undefined, sampleObject],
      [sampleObject, undefined, undefined, undefined],
      [sampleObject, sampleObject, undefined, sampleObject],
      [sampleObject, diffObject, undefined, diffObject],

      [undefined, undefined, sampleObject, undefined],
      [undefined, sampleObject, sampleObject, undefined],
      [sampleObject, undefined, sampleObject, undefined],
      [sampleObject, sampleObject, sampleObject, undefined],
      [sampleObject, diffObject, sampleObject, diffObject],

      [undefined, sampleObject, diffObject, sampleObject],
      [sampleObject, undefined, diffObject, undefined],
      [sampleObject, sampleObject, diffObject, sampleObject],
      [sampleObject, diffObject, diffObject, undefined],
    ])(
      'Keys: %jInitial: %j, Set: %j, Default: %j',
      (initialObject, setObject, defaultObject, expectedObject) => {
        const keys = ['test-a', 'test-b', 'test-c'];
        mockSetUrlParam(keys[0], initialObject);
        const { result } = renderHook(() =>
          useUrlParameters(keys, defaultObject),
        );

        act(() => {
          result.current.setParameter(setObject);
        });

        expect(result.current.getParameter()).toBe(expectedObject);

        expect(mockUrlParams[keys[0]]).toStrictEqual(expectedObject);

        expect(Object.keys(mockUrlParams)).toEqual(
          expectedObject ? [keys[0]] : [],
        );
      },
    );
  });
});
