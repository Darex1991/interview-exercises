import { LRUCache } from "./LRUCache";

describe("LRUCache", () => {
  it("podstawowy get/put", () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    expect(cache.get(1)).toBe(1);
  });

  it("usuwa najdawniej używany element po przekroczeniu pojemności", () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.get(1); // 1 staje się "świeży", 2 jest teraz najdawniej używany
    cache.put(3, 3); // powinno usunąć klucz 2
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(1)).toBe(1);
    expect(cache.get(3)).toBe(3);
  });

  it("zwraca -1 dla nieistniejącego klucza", () => {
    const cache = new LRUCache(2);
    expect(cache.get(99)).toBe(-1);
  });

  it("put na istniejącym kluczu aktualizuje wartość i odświeża jego pozycję", () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(1, 10); // aktualizacja + odświeżenie
    cache.put(3, 3); // powinno usunąć 2, nie 1
    expect(cache.get(1)).toBe(10);
    expect(cache.get(2)).toBe(-1);
    expect(cache.get(3)).toBe(3);
  });

  it("dłuższy scenariusz z pojemnością 3", () => {
    const cache = new LRUCache(3);
    cache.put(1, 1);
    cache.put(2, 2);
    cache.put(3, 3);
    cache.get(1); // kolejność świeżości: 2, 3, 1
    cache.put(4, 4); // usuwa 2 (najdawniej używany)

    expect(cache.get(2)).toBe(-1);
    expect(cache.get(3)).toBe(3);
    expect(cache.get(1)).toBe(1);
    expect(cache.get(4)).toBe(4);
  });
});
