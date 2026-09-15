import { useRef, useState } from "react";
import { type User } from "../../api/mockUsers";
import { onKeyDownCallback } from "./UserSearch.utils";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useFetchUsers } from "../../hooks/useFetchUsers";
import UserSearchResults from "../UserSearchResults/UserSearchResults";

export interface UserSearchProps {
  onSelect: (user: User) => void;
}

export function UserSearch({ onSelect }: UserSearchProps) {
  const searchWrapperRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");
  const [users, setUsers] = useState<User[]>([]);
  const [errorQuery, setErrorQuery] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);

  useClickOutside(searchWrapperRef, () => {
    setIsExpanded(false);
  });

  const onSuccessFetching = (fetchedUsers: User[]) => {
    setHighlightedIndex(0);
    setUsers(fetchedUsers);
    setStatus("success");
    setIsExpanded(true);
  };

  const onErrorFetching = (value: string, error: unknown) => {
    setErrorQuery(value);

    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }

    if (error instanceof Error) {
      setError(error);
    } else {
      setError(new Error("Unknown error"));
    }

    setStatus("error");
    setUsers([]);
    setIsExpanded(false);
  };

  const onInitFetching = () => {
    setHighlightedIndex(0);
    setError(null);
    setErrorQuery(null);
    setStatus("loading");
    setUsers([]);
    setIsExpanded(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setUsers([]);

    if (value.length > 1) {
      onInitFetching();
      debouncedFetchUsers(value);
    } else {
      setStatus("idle");
      cancelFetching();
      cancelDebounce();
      setError(null);
      setErrorQuery(null);
    }
  };

  const onSelectUser = (user: User) => {
    setSelectedUser(user);
    onSelect(user);
    setIsExpanded(false);
  };

  const onRetryFetching = () => {
    const retryQuery = errorQuery ?? "";
    onInitFetching();
    fetchUsersCallback(retryQuery);
  };

  const {
    fetchUsersCallback,
    debouncedFetchUsers,
    cancelFetching,
    cancelDebounce,
  } = useFetchUsers({
    onSuccessFetching,
    onErrorFetching,
  });

  return (
    <div ref={searchWrapperRef}>
      <input
        value={query}
        onChange={onChange}
        placeholder="Szukaj użytkownika..."
        type="search"
        name="user-search"
        aria-label="Szukaj użytkownika"
        role="combobox"
        aria-expanded={isExpanded ? "true" : "false"}
        id="search-input-value"
        aria-activedescendant={
          isExpanded ? `${users[highlightedIndex]?.id}-option` : undefined
        }
        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
          onKeyDownCallback(event, {
            highlightedIndex,
            setHighlightedIndex,
            users,
            setIsExpanded,
            onSelectUser,
          })
        }
        aria-haspopup="listbox"
        aria-controls="listbox-id"
      />

      <UserSearchResults
        error={error}
        highlightedIndex={highlightedIndex}
        isExpanded={isExpanded}
        onRetryFetching={onRetryFetching}
        onSelectUser={onSelectUser}
        query={query}
        status={status}
        users={users}
      />

      {selectedUser && <div>Selected user: {selectedUser?.name}</div>}
    </div>
  );
}
