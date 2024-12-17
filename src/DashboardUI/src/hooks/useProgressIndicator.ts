import { useEffect, useMemo, useRef } from 'react';
import { toast, ToastContent } from 'react-toastify';

function useProgressIndicator(
  progress: number | boolean[],
  content: ToastContent,
) {
  const loadingFilterDataToast = useRef<string | number | null>(null);
  const calculatedProgress = useMemo(() => {
    if (Array.isArray(progress)) {
      return progress.filter((a) => a).length / progress.length;
    }
    return progress;
  }, [progress]);
  useEffect(() => {
    if (loadingFilterDataToast.current == null && calculatedProgress < 1) {
      console.log('info', content);
      loadingFilterDataToast.current = toast.info(content, {
        progress: calculatedProgress,
        autoClose: false,
        type: 'info',
        theme: 'colored',
      });
    } else if (
      loadingFilterDataToast.current != null &&
      calculatedProgress < 1
    ) {
      console.log('update', loadingFilterDataToast.current);
      toast.update(loadingFilterDataToast.current, {
        progress: calculatedProgress,
      });
    } else if (loadingFilterDataToast.current != null) {
      console.log('dismiss', loadingFilterDataToast.current);
      toast.dismiss(loadingFilterDataToast.current);
      loadingFilterDataToast.current = null;
    }
  }, [calculatedProgress, content]);
}
export default useProgressIndicator;
