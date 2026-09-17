import { lengthOfLongestSubstring } from "./lengthOfLongestSubstring";

describe("lengthOfLongestSubstring", () => {
  it("pusty string -> 0", () => {
    expect(lengthOfLongestSubstring("")).toBe(0);
  });

  it("wszystkie znaki takie same", () => {
    expect(lengthOfLongestSubstring("bbbbb")).toBe(1);
  });

  it("klasyczny przypadek z powtórzeniem na początku", () => {
    expect(lengthOfLongestSubstring("abcabcbb")).toBe(3);
  });

  it("okno przesuwające się w środku stringu", () => {
    expect(lengthOfLongestSubstring("pwwkew")).toBe(3);
  });

  it("pojedynczy znak", () => {
    expect(lengthOfLongestSubstring("a")).toBe(1);
  });

  it("wszystkie znaki unikalne", () => {
    expect(lengthOfLongestSubstring("abcdef")).toBe(6);
  });

  it("string ze spacjami", () => {
    expect(lengthOfLongestSubstring(" ")).toBe(1);
    expect(lengthOfLongestSubstring("au")).toBe(2);
  });
});
