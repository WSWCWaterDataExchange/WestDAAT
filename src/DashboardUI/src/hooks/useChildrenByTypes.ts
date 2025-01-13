import React, { useCallback, useMemo } from 'react';

export function useChildrenByTypes(type: string | string[]) {
  const types = useMemo(() => {
    if (Array.isArray(type)) return type;
    return [type];
  }, [type]);

  const typeOfComponent = (component: any) => {
    return component?.props?.__type || component?.type?.displayName || component?.type?.name || undefined;
  };

  type ChildrenType = Parameters<typeof React.Children.toArray>[0];
  type ResultType = ReturnType<typeof React.Children.toArray>;
  const findChildren = useCallback(
    (children: ChildrenType): ResultType => {
      return React.Children.toArray(children).filter((child) => types.indexOf(typeOfComponent(child)) >= 0);
    },
    [types],
  );

  const findChild = useCallback(
    (children: ChildrenType) => {
      const results = findChildren(children);
      return results.at(0);
    },
    [findChildren],
  );

  return { findChild, findChildren };
}
