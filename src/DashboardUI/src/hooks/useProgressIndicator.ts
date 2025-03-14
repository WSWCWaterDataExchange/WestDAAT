import { useEffect, useMemo, useRef } from 'react';
import { toast, ToastContent } from 'react-toastify';

function useProgressIndicator(progress: number | boolean[], content: ToastContent) {
  const toastContainer = document.querySelector('#app-toast-container');
  const loadingFilterDataToast = useRef<string | number | null>(null);

  const calculatedProgress = useMemo(() => {
    if (Array.isArray(progress)) {
      return progress.filter((a) => a).length / progress.length;
    }
    return progress;
  }, [progress]);

  useEffect(() => {
    // Wait for the toast container to be available in the dom.
    // If you don't, then toast messages on initial page load will not show.
    if (toastContainer == null) {
      return;
    }

    if (loadingFilterDataToast.current == null && calculatedProgress < 1) {
      loadingFilterDataToast.current = toast.info(content, {
        progress: calculatedProgress,
        autoClose: false,
        type: 'info',
        theme: 'colored',
      });
    } else if (loadingFilterDataToast.current != null && calculatedProgress < 1) {
      toast.update(loadingFilterDataToast.current!, {
        progress: calculatedProgress,
      });
    } else if (loadingFilterDataToast.current != null) {
      toast.dismiss(loadingFilterDataToast.current!);
      loadingFilterDataToast.current = null;
    }
  }, [calculatedProgress, content, toastContainer]);
}
export default useProgressIndicator;
