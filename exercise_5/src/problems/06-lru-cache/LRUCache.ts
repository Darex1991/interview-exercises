/**
 * LRU Cache (Least Recently Used)
 *
 * Zaprojektuj strukturę danych, która implementuje cache o ograniczonej
 * pojemności (`capacity`), usuwającą najdawniej używany element, gdy
 * przekroczy pojemność.
 *
 * Wymagane operacje, obie w O(1) (średnio) czasu:
 * - `get(key)` — zwraca wartość dla klucza (albo -1, jeśli nie istnieje)
 *   i oznacza klucz jako właśnie użyty (przesuwa go na koniec kolejki "świeżości").
 * - `put(key, value)` — wstawia/aktualizuje wartość dla klucza i oznacza
 *   go jako świeżo użyty. Jeśli po wstawieniu pojemność zostanie przekroczona,
 *   usuwa najdawniej używany klucz.
 *
 * Podpowiedź: `Map` w JS zachowuje kolejność wstawiania kluczy — możesz to
 * wykorzystać zamiast ręcznie implementować listę dwukierunkową (choć to
 * też jest poprawne, "klasyczne" rozwiązanie i dobre ćwiczenie samo w sobie).
 *
 * Przykład:
 *   const cache = new LRUCache(2);
 *   cache.put(1, 1);          // cache: {1=1}
 *   cache.put(2, 2);          // cache: {1=1, 2=2}
 *   cache.get(1);             // -> 1, cache: {2=2, 1=1} (1 jest teraz "świeży")
 *   cache.put(3, 3);          // przekroczona pojemność -> usuwa 2 (najdawniej używany)
 *   cache.get(2);             // -> -1 (nie istnieje)
 */
export class LRUCache {
  constructor(capacity: number) {
    throw new Error("Not implemented");
  }

  get(key: number): number {
    throw new Error("Not implemented");
  }

  put(key: number, value: number): void {
    throw new Error("Not implemented");
  }
}
