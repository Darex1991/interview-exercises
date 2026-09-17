import { isValid } from "./isValid";

describe("isValid", () => {
  it("pusty string jest poprawny", () => {
    expect(isValid("")).toBe(true);
  });

  it("proste poprawne pary", () => {
    expect(isValid("()")).toBe(true);
    expect(isValid("()[]{}")).toBe(true);
  });

  it("zagnieżdżone poprawne pary", () => {
    expect(isValid("{[]}")).toBe(true);
    expect(isValid("([{}])")).toBe(true);
  });

  it("niedopasowane typy nawiasów", () => {
    expect(isValid("(]")).toBe(false);
  });

  it("zła kolejność zamknięcia", () => {
    expect(isValid("([)]")).toBe(false);
  });

  it("niezamknięty nawias na końcu", () => {
    expect(isValid("(((")).toBe(false);
  });

  it("nawias zamykający bez otwierającego", () => {
    expect(isValid("]")).toBe(false);
    expect(isValid("())")).toBe(false);
  });
});
