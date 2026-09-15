# Zadanie: Wyszukiwarka użytkowników (autocomplete)

Poziom: Senior Frontend (React)
Sugerowany czas: 60–90 minut

## Kontekst

W `src/api/mockUsers.ts` znajduje się gotowa, symulowana funkcja API:

```ts
fetchUsers(query: string, options?: { signal?: AbortSignal }): Promise<User[]>
```

- Symuluje realne opóźnienie sieciowe (200–900ms, losowo — czyli odpowiedzi mogą wrócić w innej kolejności niż zapytania zostały wysłane).
- Zapytanie o frazę `"error"` zawsze się nie powiedzie (do przetestowania stanu błędu).
- Respektuje `AbortSignal` — po `abort()` promise zostaje odrzucony z `AbortError`.

Nie modyfikuj tego pliku — traktuj go jak zewnętrzne API, którego nie kontrolujesz.

Twoim zadaniem jest dokończenie komponentu `UserSearch` w `src/components/UserSearch.tsx` (możesz go dowolnie przebudować, wydzielić hooki do `src/hooks`, dodać komponenty pomocnicze — struktura jest w Twojej gestii).

## Wymagania funkcjonalne

1. Pole tekstowe do wpisywania zapytania. Wyszukiwanie startuje dopiero od 2 znaków.
2. Zapytania mają być **debounce'owane** (np. 300ms) — nie wysyłamy requestu przy każdym naciśnięciu klawisza.
3. Lista wyników pod polem (dropdown), pokazująca dopasowanych użytkowników (imię i nazwisko + login).
4. Stan ładowania (loading indicator).
5. Stan błędu (np. gdy backend zwróci błąd) z możliwością ponowienia (retry).
6. Stan pustych wyników ("Brak wyników dla ...").
7. **Obsługa race condition**: jeśli użytkownik szybko zmienia zapytanie (np. wpisuje "a", potem "ab"), a odpowiedź na "a" wróci *po* odpowiedzi na "ab", starsza odpowiedź **nie może** nadpisać nowszych wyników. Wykorzystaj do tego `AbortController` przekazywany do `fetchUsers`.
8. Nawigacja klawiaturą: `ArrowDown`/`ArrowUp` przesuwają podświetlenie po liście, `Enter` wybiera podświetloną pozycję, `Escape` zamyka listę.
9. Kliknięcie poza komponentem zamyka listę wyników.
10. Wybranie użytkownika (klik lub Enter) wywołuje `onSelect(user)` i zamyka dropdown.
11. Podświetl w wynikach fragment tekstu pasujący do zapytania.

## Wymagania niefunkcjonalne

- TypeScript bez `any`, sensowne typowanie.
- Dostępność (a11y): rozważ wzorzec ARIA combobox/listbox (role, `aria-expanded`, `aria-activedescendant` itp.) — komponent powinien być użyteczny ze screenreaderem i klawiaturą, bez myszki.
- Wydajność: unikaj zbędnych re-renderów i przeliczeń tam, gdzie ma to znaczenie (ale nie optymalizuj na siłę wszystkiego — uzasadnij decyzje).
- Czysty, testowalny kod — rozważ wydzielenie logiki (debounce, fetch, race-condition handling) do custom hooka, oddzielnie od warstwy prezentacji.
- Poprawny cleanup w `useEffect` (projekt ma włączony `StrictMode`, więc podwójne mountowanie w dev ujawni ewentualne wycieki).

## Bonus (opcjonalnie, jeśli starczy czasu)

- Prosty cache wyników w pamięci (żeby ponowne zapytanie o tę samą frazę nie odpytywało API drugi raz).
- Testy jednostkowe/integracyjne (Vitest + React Testing Library są już zainstalowane, `npm run test`). Szczególnie warto przetestować scenariusz race condition i debounce.
- Obsługa `prefers-reduced-motion` / brak zależności od animacji dla poprawności działania.

## Czego NIE oceniam

- Wyglądu / CSS (ma być użyteczny, nie ma być piękny).
- Konfiguracji builda, ESLint itp.

## Jak zakończyć

Napisz mi, gdy skończysz (albo gdy chcesz przerwać) — przejrzę kod, zapytam o kilka decyzji projektowych i dam feedback tak, jak na prawdziwej rozmowie rekrutacyjnej (code review + pytania).
