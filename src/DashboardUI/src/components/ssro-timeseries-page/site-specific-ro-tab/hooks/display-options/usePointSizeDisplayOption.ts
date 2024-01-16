import { useCallback } from "react";
import { useSiteSpecificContext } from "../../Provider";

export function usePointSizeDisplayOption() {
  const { displayOptions: { pointSize }, setDisplayOptions } = useSiteSpecificContext();

  const setPointSize = useCallback((pointSize: string) => {
    setDisplayOptions(s => ({ ...s, pointSize: pointSize === "f" ? "f" : pointSize === "v" ? "v" : "d" }));
  }, [setDisplayOptions]);

  return { pointSize, setPointSize };
}
