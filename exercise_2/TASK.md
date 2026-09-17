# Zadanie: Lista zadań z optymistycznymi aktualizacjami

Poziom: Senior Frontend (React)
Sugerowany czas: 60–90 minut

## Kontekst

W `src/api/mockTasks.ts` znajduje się gotowe, symulowane API:

```ts
fetchTasks(options?: { signal?: AbortSignal }): Promise<Task[]>
createTask(title: string, options?: { signal?: AbortSignal }): Promise<Task>
updateTaskStatus(id: string, completed: boolean, options?: { signal?: AbortSignal }): Promise<Task>
deleteTask(id: string, options?: { signal?: AbortSignal }): Promise<void>
```

- Każde wywołanie symuluje realne opóźnienie sieciowe (200–900ms, losowo — czyli odpowiedzi mogą wrócić w innej kolejności niż zapytania zostały wysłane).
- `createTask` / `updateTaskStatus` / `deleteTask` dla zadania, którego **tytuł zawiera słowo "error"** (bez względu na wielkość liter), zawsze kończą się odrzuceniem promise — do przetestowania stanu błędu, rollbacku i retry. W danych startowych są dwa takie zadania.
- Wszystkie funkcje respektują `AbortSignal` — po `abort()` promise zostaje odrzucony z `AbortError`.

Nie modyfikuj tego pliku — traktuj go jak zewnętrzne API, którego nie kontrolujesz.

Twoim zadaniem jest dokończenie komponentu `TaskList` w `src/components/TaskList/TaskList.tsx` (możesz go dowolnie przebudować, wydzielić hooki do `src/hooks`, dodać komponenty pomocnicze — struktura jest w Twojej gestii). Obecny stan komponentu tylko pobiera i wyświetla listę — reszta jest do zaimplementowania.

## Wymagania funkcjonalne

1. **Dodawanie zadania**: pole tekstowe + przycisk. Nowe zadanie pojawia się na liście **optymistycznie** (natychmiast, z tymczasowym id po stronie klienta), zanim serwer potwierdzi zapis. Po sukcesie tymczasowe id musi zostać podmienione na id nadane przez serwer. Po błędzie (np. tytuł zawiera "error") zadanie znika z listy, a użytkownik widzi komunikat błędu z możliwością ponowienia.
2. **Przełączanie statusu (checkbox)**: kliknięcie zmienia stan wizualnie od razu (optymistycznie), zanim serwer odpowie.
   - Jeśli `updateTaskStatus` zwróci błąd, stan checkboxa wraca do poprzedniego (rollback), a przy danym zadaniu pojawia się informacja o błędzie z możliwością ponowienia (retry) tej samej zmiany.
   - **Race condition**: jeśli użytkownik szybko klika ten sam checkbox kilka razy pod rząd (np. zaznacz → odznacz → zaznacz), a odpowiedzi z serwera wrócą w innej kolejności niż zapytania — końcowy stan checkboxa musi odpowiadać **ostatniej** akcji użytkownika. Starsza, spóźniona odpowiedź nie może nadpisać nowszego stanu.
3. **Usuwanie zadania z możliwością cofnięcia**: kliknięcie "Usuń" natychmiast usuwa zadanie z widoku (optymistycznie) i pokazuje komunikat z przyciskiem "Cofnij" widoczny przez kilka sekund (np. 4-5s).
   - Rzeczywiste wywołanie `deleteTask` do "backendu" ma być **opóźnione** o ten czas — jeśli użytkownik kliknie "Cofnij" zanim czas minie, zadanie wraca na listę, a `deleteTask` **w ogóle nie zostaje wywołane**.
   - Jeśli czas minie i `deleteTask` zwróci błąd (tytuł zawiera "error"), zadanie wraca na listę wraz z komunikatem błędu.
4. Stan ładowania początkowej listy zadań.
5. Stan błędu początkowego pobrania listy, z możliwością ponowienia.

## Wymagania niefunkcjonalne

- TypeScript bez `any`, sensowne typowanie.
- Dostępność (a11y): komunikaty o zmianach stanu (dodano zadanie, błąd, dostępne "Cofnij" itp.) powinny być ogłaszane czytnikom ekranu (np. region `aria-live`). Każdy interaktywny element ma czytelną, jednoznaczną nazwę dostępną (np. przycisk usuwania powinien identyfikować, którego zadania dotyczy). Cały przepływ ma być obsługiwalny wyłącznie klawiaturą.
- Wydajność: unikaj zbędnych re-renderów listy przy zmianie pojedynczego elementu (ale nie optymalizuj na siłę wszystkiego — uzasadnij decyzje).
- Czysty, testowalny kod — rozważ wydzielenie logiki (optymistyczne mutacje, rollback, opóźnione usuwanie, rozwiązywanie race condition) do custom hooka, oddzielnie od warstwy prezentacji.
- Poprawny cleanup w `useEffect` / timerach (projekt ma włączony `StrictMode`, więc podwójne mountowanie w dev ujawni ewentualne wycieki i podwójne wywołania).

## Bonus (opcjonalnie, jeśli starczy czasu)

- Widoczny odliczający czas / progres dla okna "Cofnij" przy usuwaniu.
- Testy jednostkowe/integracyjne (Vitest + React Testing Library są już zainstalowane, `npm run test`). Szczególnie warto przetestować: race condition przy szybkim przełączaniu checkboxa, brak wywołania `deleteTask` po kliknięciu "Cofnij", oraz rollback przy błędzie.
- Filtrowanie listy (wszystkie / aktywne / ukończone) bez utraty poprawności powyższych zachowań.

## Czego NIE oceniam

- Wyglądu / CSS (ma być użyteczny, nie ma być piękny).
- Konfiguracji builda, ESLint itp.

## Jak zakończyć

Napisz mi, gdy skończysz (albo gdy chcesz przerwać) — przejrzę kod, zapytam o kilka decyzji projektowych i dam feedback tak, jak na prawdziwej rozmowie rekrutacyjnej (code review + pytania).
