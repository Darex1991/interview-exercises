import type { User } from "../../api/mockUsers";
import { onKeyDownCallback, renderMatchedName } from "./UserSearch.utils";
import { describe, it, expect, vi } from "vitest";

const users: User[] = [
  {
    id: "1",
    name: "John Wick",
    username: "johnwick",
    email: "johnwick@example.com",
  },
  {
    id: "2",
    name: "Jane Doe",
    username: "janedoe",
    email: "janedoe@example.com",
  },
  {
    id: "3",
    name: "John Doe",
    username: "johndoe",
    email: "johndoe@example.com",
  },
];

describe("UserSearch.utils", () => {
  describe("renderMatchedName", () => {
    it("should render matched name", () => {
      const name = "John Wick";
      const query = "wick";
      const result = renderMatchedName(name, query);
      expect(result).toMatchSnapshot("<span>John <b>Wick</b></span>");
    });
    it("should render matched name #2", () => {
      const name = "Magdalena Jankowska";
      const query = "al";
      const result = renderMatchedName(name, query);
      expect(result).toMatchSnapshot("<span>Magd<b>al</b>ena Jankowska</span>");
    });
    it("should render original name when nothing matched", () => {
      const name = "Bartosz Kowalski";
      const query = "al  ";
      const result = renderMatchedName(name, query);
      expect(result).toEqual("Bartosz Kowalski");
    });
  });

  describe("onKeyDownCallback", () => {
    it("should set highlighted index to the next user", () => {
      const highlightedIndex = 0;
      const callback = vi.fn();
      const setHighlightedIndex = () => callback(1);
      const setIsExpanded = vi.fn();
      const onSelectUser = vi.fn();
      const e = new KeyboardEvent("keydown", {
        key: "ArrowDown",
      }) as unknown as React.KeyboardEvent<HTMLInputElement>;

      onKeyDownCallback(e, {
        highlightedIndex,
        setHighlightedIndex,
        users,
        setIsExpanded,
        onSelectUser,
      });
      expect(callback).toHaveBeenCalledWith(1);
    });

    it("should set highlighted index to the previous user", () => {
      const highlightedIndex = 1;
      const callback = vi.fn();
      const setHighlightedIndex = () => callback(0);
      const setIsExpanded = vi.fn();
      const onSelectUser = vi.fn();
      const e = new KeyboardEvent("keydown", {
        key: "ArrowUp",
      }) as unknown as React.KeyboardEvent<HTMLInputElement>;

      onKeyDownCallback(e, {
        highlightedIndex,
        setHighlightedIndex,
        users,
        setIsExpanded,
        onSelectUser,
      });
      expect(callback).toHaveBeenCalledWith(0);
    });

    it("should set is expanded to false", () => {
      const setIsExpanded = vi.fn();
      const e = new KeyboardEvent("keydown", {
        key: "Escape",
      }) as unknown as React.KeyboardEvent<HTMLInputElement>;

      onKeyDownCallback(e, {
        highlightedIndex: 0,
        setHighlightedIndex: vi.fn(),
        users,
        setIsExpanded,
        onSelectUser: () => {},
      });
      expect(setIsExpanded).toHaveBeenCalledWith(false);
    });
  });
});
