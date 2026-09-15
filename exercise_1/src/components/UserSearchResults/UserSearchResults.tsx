import type { User } from "../../api/mockUsers";
import { renderMatchedName } from "../UserSearch/UserSearch.utils";

type UserSearchResultsProps = {
  error: Error | null;
  highlightedIndex: number;
  isExpanded: boolean;
  onRetryFetching: () => void;
  onSelectUser: (user: User) => void;
  query: string;
  status: "idle" | "loading" | "error" | "success";
  users: User[];
};

const UserSearchResults = ({
  error,
  highlightedIndex,
  isExpanded,
  onRetryFetching,
  onSelectUser,
  query,
  status,
  users,
}: UserSearchResultsProps) => {
  const isLoading = status === "loading";
  const isSuccess = status === "success";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error.message} <button onClick={onRetryFetching}>Retry</button>
      </div>
    );
  }

  if (!isExpanded) {
    return null;
  }

  if (isSuccess && users.length === 0) {
    return <div>Brak wyników dla zapytania</div>;
  }

  if (isSuccess && users.length > 0) {
    return (
      <div>
        <ul role="listbox" id="listbox-id">
          {users.map((user) => (
            <li
              className={
                users[highlightedIndex]?.id === user.id
                  ? "selected"
                  : "not-selected"
              }
              key={user.id}
              role="option"
              id={`${user.id}-option`}
              tabIndex={isExpanded ? 0 : -1}
              aria-selected={
                users[highlightedIndex]?.id === user.id ? "true" : "false"
              }
              onClick={() => onSelectUser(user)}
            >
              {renderMatchedName(user.name, query)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export default UserSearchResults;
