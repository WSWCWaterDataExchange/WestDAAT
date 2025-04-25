import { useEffect, useMemo, useState } from 'react';
import { Id, toast, ToastContent } from 'react-toastify';

function useProgressIndicator(progress: number | boolean[], content: ToastContent) {
  const [toastId, setToastId] = useState<Id | null>(null);

  const calculatedProgress = useMemo(() => {
    if (Array.isArray(progress)) {
      return progress.filter((a) => a).length / progress.length;
    }
    return progress;
  }, [progress]);


  useEffect(() => {
    if (toastId === null) {
      if (calculatedProgress < 1) {
        const id = toast.info(content, {
          autoClose: false,
          type: 'info',
          theme: 'colored'
        });
        setToastId(id);
      }
    } else {
      if (calculatedProgress < 1) {
        toast.update(toastId, {
          progress: calculatedProgress,
          autoClose: false,
          type: 'info',
          theme: 'colored',
        });
      } else {
        toast.dismiss(toastId);
      }
    }
  }, [progress, content]);
}
export default useProgressIndicator;
