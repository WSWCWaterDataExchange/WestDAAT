import { useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from '../../contexts/AppProvider';
import deepEqual from 'fast-deep-equal/es6';

export function useUrlParameters<T>(
  parameterKey: string | string[],
  defaultValue: T,
) {
  const { setUrlParam, getUrlParam } = useAppContext();

  const keys = useMemo(() => {
    return Array.isArray(parameterKey) ? parameterKey : [parameterKey];
  }, [parameterKey]);

  const primaryKey = useMemo(() => {
    if (keys.length === 0) {
      throw new Error('Must specify at least one parameter key');
    }
    return keys[0];
  }, [keys]);

  const allParameterValues = useMemo(() => {
    return keys.map((a) => ({ key: a, value: getUrlParam<T>(a) }));
  }, [keys, getUrlParam]);

  const getParameter = useCallback(() => {
    return getUrlParam<T>(primaryKey);
  }, [primaryKey, getUrlParam]);

  const setParameter = useCallback(
    (parameterValue?: T) => {
      const value = deepEqual(parameterValue, defaultValue)
        ? undefined
        : parameterValue;
      setUrlParam(primaryKey, value);
    },
    [primaryKey, defaultValue, setUrlParam],
  );

  useEffect(() => {
    const [primaryValue, ...alternateValues] = allParameterValues;
    let hasFoundValue = !!primaryValue.value;
    if (hasFoundValue && deepEqual(primaryValue.value, defaultValue)) {
      setParameter(undefined);
    }
    alternateValues.forEach((a) => {
      if (!a.value) return;
      if (!hasFoundValue) {
        setParameter(a.value);
        hasFoundValue = true;
      }
      setUrlParam(a.key, undefined);
    });
  }, [
    defaultValue,
    allParameterValues,
    setParameter,
    getUrlParam,
    setUrlParam,
  ]);

  return { getParameter, setParameter };
}
