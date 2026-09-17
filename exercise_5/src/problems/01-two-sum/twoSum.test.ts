import { twoSum } from "./twoSum";

function normalize(result: number[]): number[] {
  return [...result].sort((a, b) => a - b);
}

describe("twoSum", () => {
  it("znajduje parę sumującą się do target", () => {
    expect(normalize(twoSum([2, 7, 11, 15], 9))).toEqual([0, 1]);
  });

  it("działa gdy odpowiedź jest w środku/na końcu tablicy", () => {
    expect(normalize(twoSum([3, 2, 4], 6))).toEqual([1, 2]);
  });

  it("obsługuje duplikaty wartości", () => {
    expect(normalize(twoSum([3, 3], 6))).toEqual([0, 1]);
  });

  it("obsługuje liczby ujemne", () => {
    expect(normalize(twoSum([-3, 4, 3, 90], 0))).toEqual([0, 2]);
  });

  it("działa dla większej tablicy (kontrola wydajności/poprawności)", () => {
    const nums = Array.from({ length: 1000 }, (_, i) => i);
    expect(normalize(twoSum(nums, 1997))).toEqual([998, 999]);
  });
});
