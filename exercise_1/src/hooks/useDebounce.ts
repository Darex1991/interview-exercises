import { useCallback, useRef } from "react";

export const useDebounce = (callback: (value: string) => Promise<void>) => {
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelDebounce = () => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
  };

  const debouncedCallback = useCallback(
    (newValue: string) => {
      cancelDebounce();

      ref.current = setTimeout(() => {
        callback(newValue);
      }, 300);
    },
    [callback],
  );

  return { debouncedCallback, cancelDebounce };
};
