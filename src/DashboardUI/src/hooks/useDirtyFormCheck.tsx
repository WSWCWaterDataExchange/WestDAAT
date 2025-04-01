import { useEffect, useState } from 'react';
import deepEqual from 'fast-deep-equal/es6';

function useDirtyFormCheck(
  formValues: any,
  options: {
    isEnabled: boolean;
  },
): [boolean, (formValues: any) => void] {
  const [initialFormValue, setInitialFormValue] = useState<any>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    const isInitialFormValueSet = initialFormValue !== null;
    if (!options.isEnabled || isInitialFormValueSet) return;

    setInitialFormValue(JSON.parse(JSON.stringify(formValues)));
  }, [formValues, options.isEnabled, initialFormValue]);

  useEffect(() => {
    if (!options.isEnabled) return;

    if (initialFormValue && formValues) {
      const dirty = !deepEqual(initialFormValue, formValues);
      setIsFormDirty(dirty);
    }
  }, [options.isEnabled, initialFormValue, formValues]);

  function reinitializeDirtyFormCheck(formValues: any) {
    setInitialFormValue(JSON.parse(JSON.stringify(formValues)));
    setIsFormDirty(false);
  }

  return [isFormDirty, reinitializeDirtyFormCheck];
}

export default useDirtyFormCheck;
