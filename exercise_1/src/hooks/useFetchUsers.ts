import { useEffect, useRef } from "react";
import { fetchUsers, type User } from "../api/mockUsers";
import { useDebounce } from "./useDebounce";

type UseFetchUsersProps = {
  onSuccessFetching: (fetchedUsers: User[]) => void;
  onErrorFetching: (value: string, error: unknown) => void;
};

export const useFetchUsers = ({
  onSuccessFetching,
  onErrorFetching,
}: UseFetchUsersProps) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const cancelFetching = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  useEffect(() => {
    return () => cancelFetching();
  }, []);

  const fetchUsersCallback = async (value: string) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort("Aborted by new request");
      }
      abortControllerRef.current = new AbortController();
      const fetchedUsers = await fetchUsers(value, {
        signal: abortControllerRef.current.signal,
      });
      onSuccessFetching(fetchedUsers);
    } catch (error: unknown) {
      onErrorFetching(value, error);
    }
  };

  const { debouncedCallback: debouncedFetchUsers, cancelDebounce } = useDebounce(fetchUsersCallback);

  return { debouncedFetchUsers, fetchUsersCallback, cancelFetching, cancelDebounce };
};
