import { ListNode, reverseList } from "./reverseLinkedList";

function arrayToList(values: number[]): ListNode | null {
  let head: ListNode | null = null;
  for (let i = values.length - 1; i >= 0; i--) {
    head = new ListNode(values[i], head);
  }
  return head;
}

function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let node = head;
  while (node) {
    result.push(node.val);
    node = node.next;
  }
  return result;
}

describe("reverseList", () => {
  it("odwraca listę wieloelementową", () => {
    const head = arrayToList([1, 2, 3, 4, 5]);
    expect(listToArray(reverseList(head))).toEqual([5, 4, 3, 2, 1]);
  });

  it("obsługuje pustą listę", () => {
    expect(reverseList(null)).toBeNull();
  });

  it("obsługuje listę jednoelementową", () => {
    const head = arrayToList([42]);
    expect(listToArray(reverseList(head))).toEqual([42]);
  });

  it("obsługuje listę dwuelementową", () => {
    const head = arrayToList([1, 2]);
    expect(listToArray(reverseList(head))).toEqual([2, 1]);
  });
});
