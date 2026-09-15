import type { Dispatch, SetStateAction } from "react";
import { type User } from "../../api/mockUsers";

export const renderMatchedName = (name: string, query: string) => {
  const normalizedQuery = query.toLowerCase();
  const startIndex = name.toLowerCase().indexOf(normalizedQuery);

  if (startIndex === -1) {
    return name;
  }

  const beforeText = name.slice(0, startIndex);
  const foundText = name.slice(startIndex, startIndex + normalizedQuery.length);
  const restText = name.slice(startIndex + normalizedQuery.length, name.length);
  return (
    <span>
      {beforeText}
      <b>{foundText}</b>
      {restText}
    </span>
  );
};

export const onKeyDownCallback = (
  e: React.KeyboardEvent<HTMLInputElement>,
  {
    highlightedIndex,
    setHighlightedIndex,
    users,
    setIsExpanded,
    onSelectUser,
  }: {
    highlightedIndex: number;
    setHighlightedIndex: Dispatch<SetStateAction<number>>;
    users: User[];
    setIsExpanded: Dispatch<SetStateAction<boolean>>;
    onSelectUser: (user: User) => void;
  },
) => {
  if (e.key === "ArrowDown") {
    setHighlightedIndex((prev: number) => {
      if (prev < users.length - 1) {
        return prev + 1;
      } else {
        return 0;
      }
    });
  }
  if (e.key === "ArrowUp") {
    setHighlightedIndex((prev: number) => {
      if (prev > 0) {
        return prev - 1;
      } else {
        return users.length - 1;
      }
    });
  }

  if (e.key === "Escape") {
    setIsExpanded(false);
  }
  if (e.key === "Enter") {
    const user = users[highlightedIndex];
    if (user) {
      onSelectUser(user);
    }
  }
};
