
import React, { useEffect, useState } from "react";
import deepEqual from 'fast-deep-equal/es6';

function useLastKnownValue<T>(knownValue: T): [T | undefined, T, React.Dispatch<React.SetStateAction<T|undefined>>] {
  const [value, setValue] = useState<T | undefined>(knownValue);
  const [lastKnownValue, setlastKnownValue] = useState<T>(knownValue);
  useEffect(() =>{
      setlastKnownValue(s=>{
        return value !== undefined && !deepEqual(s, value) ?
          value :
          s
      })
    }, [value, setlastKnownValue])
  return [ value, lastKnownValue, setValue ];
}
export default useLastKnownValue;