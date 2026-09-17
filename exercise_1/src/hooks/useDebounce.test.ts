import { describe, expect, it, jest } from "@jest/globals";
import { useDebounce } from "./useDebounce";
import { renderHook, waitFor } from "@testing-library/react";

describe("useDebounce", () => {
  it("should debounce the callback", async () => {
    const test = jest.fn();

    const callback = jest.fn(
      (val: string): Promise<void> =>
        new Promise((resolve) => {
          test(val);
          resolve(void val);
        }),
    );
    const { result } = renderHook(() => useDebounce(callback));

    result.current.debouncedCallback("t");
    result.current.debouncedCallback("te");
    result.current.debouncedCallback("tes");
    result.current.debouncedCallback("test");

    await waitFor(() => expect(test).toHaveBeenCalledTimes(1));
  });
});
