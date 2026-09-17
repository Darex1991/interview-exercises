# Zadanie: Algorithm & Data Structure practice

Poziom: rozgrzewka pod rozmowy techniczne (easy/medium, styl LeetCode)
Sugerowany czas: 15–30 minut na zadanie

## Jak to działa

Każdy folder w `src/problems/` to osobne zadanie:

- Plik `*.ts` — treść zadania w komentarzu + **stub** funkcji/klasy, który na starcie rzuca `Error("Not implemented")`.
- Plik `*.test.ts` — gotowe testy (nie modyfikuj ich), które sprawdzają Twoje rozwiązanie.

Twoje zadanie: zaimplementować logikę w pliku `*.ts` tak, żeby testy przeszły. Nie musisz robić zadań po kolei — wybierz temat, na którym chcesz się skupić.

Uruchomienie wszystkich testów:

```bash
npm install
npm test
```

Uruchomienie testów dla jednego zadania (szybsza pętla feedbacku):

```bash
npm test -- twoSum
npm test -- isValid
npm test -- lengthOfLongestSubstring
npm test -- reverseLinkedList
npm test -- levelOrder
npm test -- LRUCache
```

Tryb watch (testy przelatują od razu po zapisaniu pliku):

```bash
npm run test:watch
```

Sprawdzenie typów (opcjonalnie, testy działają nawet bez tego):

```bash
npm run typecheck
```

## Lista zadań

| # | Zadanie | Struktura danych / technika | Plik |
|---|---|---|---|
| 1 | Two Sum | tablica + hash mapa | `src/problems/01-two-sum/twoSum.ts` |
| 2 | Valid Parentheses | stos | `src/problems/02-valid-parentheses/isValid.ts` |
| 3 | Longest Substring Without Repeating Characters | sliding window + mapa/Set | `src/problems/03-longest-substring/lengthOfLongestSubstring.ts` |
| 4 | Reverse Linked List | lista wiązana (iteracyjnie i/lub rekurencyjnie) | `src/problems/04-reverse-linked-list/reverseLinkedList.ts` |
| 5 | Binary Tree Level Order Traversal | drzewo binarne + BFS/kolejka | `src/problems/05-binary-tree-level-order/levelOrder.ts` |
| 6 | LRU Cache | hash mapa (+ opcjonalnie lista dwukierunkowa), projekt struktury danych | `src/problems/06-lru-cache/LRUCache.ts` |

## Wskazówki ogólne

- Przed napisaniem kodu powiedz na głos (albo zapisz w komentarzu) **plan** i oczekiwaną złożoność czasową/pamięciową — na prawdziwej rozmowie to się liczy tak samo jak sam kod.
- Zacznij od najprostszego, brute-force rozwiązania, jeśli utkniesz — potem zoptymalizuj. Lepiej mieć działające O(n²), niż niedziałające O(n).
- Zwróć uwagę na edge case'y: pusta tablica/string, jeden element, duplikaty, wartości ujemne — testy część z nich sprawdzają, ale warto myśleć o nich samodzielnie.
- Teoria i więcej przykładów (m.in. debounce/throttle, deep clone, EventEmitter) jest w [../informations/frontend-interview-questions.md](../informations/frontend-interview-questions.md) w sekcjach "DSA" i "Machine Coding Questions".

## Jak zakończyć

Daj znać, gdy skończysz dane zadanie (albo utkniesz) — omówimy Twoje rozwiązanie: złożoność, czytelność, alternatywne podejścia, tak jak w code review na rozmowie rekrutacyjnej.
