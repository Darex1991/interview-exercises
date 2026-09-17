/**
 * Binary Tree Level Order Traversal
 *
 * Mając korzeń (`root`) drzewa binarnego, zwróć wartości węzłów
 * pogrupowane poziomami (przechodzenie wszerz / BFS), od korzenia w dół,
 * od lewej do prawej w obrębie poziomu.
 *
 * Przykład:
 *        3
 *       / \
 *      9  20
 *         / \
 *        15  7
 *
 *   levelOrder(root) // -> [[3], [9, 20], [15, 7]]
 *
 * Oczekiwana złożoność: O(n) czasu i pamięci (podpowiedź: kolejka/BFS,
 * w JS/TS można użyć zwykłej tablicy jako kolejki albo prawdziwej struktury
 * kolejkowej, jeśli zależy Ci na wydajności `shift()` dla bardzo dużych drzew).
 */
export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val: number = 0,
    left: TreeNode | null = null,
    right: TreeNode | null = null,
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export function levelOrder(root: TreeNode | null): number[][] {
  throw new Error("Not implemented");
}
