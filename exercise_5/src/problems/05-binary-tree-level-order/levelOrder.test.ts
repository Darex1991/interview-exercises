import { TreeNode, levelOrder } from "./levelOrder";

/**
 * Buduje drzewo z tablicy w formacie level-order (jak w LeetCode),
 * gdzie `null` oznacza brak dziecka w danym miejscu.
 * Przykład: [3, 9, 20, null, null, 15, 7]
 */
function buildTree(values: Array<number | null>): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null;

  const root = new TreeNode(values[0]);
  const queue: TreeNode[] = [root];
  let i = 1;

  while (queue.length > 0 && i < values.length) {
    const node = queue.shift()!;

    if (i < values.length) {
      const leftVal = values[i++];
      if (leftVal !== null) {
        node.left = new TreeNode(leftVal);
        queue.push(node.left);
      }
    }

    if (i < values.length) {
      const rightVal = values[i++];
      if (rightVal !== null) {
        node.right = new TreeNode(rightVal);
        queue.push(node.right);
      }
    }
  }

  return root;
}

describe("levelOrder", () => {
  it("puste drzewo -> pusta tablica", () => {
    expect(levelOrder(null)).toEqual([]);
  });

  it("drzewo z jednym węzłem", () => {
    expect(levelOrder(new TreeNode(1))).toEqual([[1]]);
  });

  it("standardowe drzewo z przykładu", () => {
    const root = buildTree([3, 9, 20, null, null, 15, 7]);
    expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]]);
  });

  it("drzewo niezbalansowane (tylko lewe dzieci)", () => {
    const root = buildTree([1, 2, null, 3, null, 4, null]);
    expect(levelOrder(root)).toEqual([[1], [2], [3], [4]]);
  });
});
