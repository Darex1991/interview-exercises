/**
 * Reverse Linked List
 *
 * Mając głowę (`head`) jednokierunkowej listy wiązanej, odwróć ją i zwróć
 * nową głowę (czyli dawny ostatni element).
 *
 * Przykład:
 *   head:   1 -> 2 -> 3 -> 4 -> 5 -> null
 *   wynik:  5 -> 4 -> 3 -> 2 -> 1 -> null
 *
 * Spróbuj rozwiązać dwoma sposobami (jeśli starczy czasu):
 * 1. Iteracyjnie, w miejscu, O(n) czasu / O(1) pamięci dodatkowej.
 * 2. Rekurencyjnie, O(n) czasu / O(n) pamięci (stos wywołań).
 */
export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

export function reverseList(head: ListNode | null): ListNode | null {
  throw new Error("Not implemented");
}
