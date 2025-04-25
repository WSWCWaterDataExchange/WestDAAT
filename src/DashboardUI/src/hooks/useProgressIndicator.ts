import { useEffect, useMemo } from 'react';
import { Id, toast, ToastContent } from 'react-toastify';

function useProgressIndicator(progress: number | boolean[], content: ToastContent) {
  let toastId: Id | null = null;

  const calculatedProgress = useMemo(() => {
    if (Array.isArray(progress)) {
      return progress.filter((a) => a).length / progress.length;
    }
    return progress;
  }, [progress]);

  useEffect(() => {
    if (toastId === null) {
      toastId = toast.info(content);
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
  }, [calculatedProgress, content, toastId]);
}
export default useProgressIndicator;
