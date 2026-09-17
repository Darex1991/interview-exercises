# Zadanie: Wirtualizowana tabela zamówień

Poziom: Senior Frontend (React)
Sugerowany czas: 60–90 minut

## Kontekst

W `src/api/mockOrders.ts` znajduje się gotowa, symulowana funkcja API operująca na 300 zamówieniach:

```ts
fetchOrders(
  params: {
    search?: string;
    sortBy?: "date" | "amount";
    sortDir?: "asc" | "desc";
    cursor?: string | null;
    limit?: number;
  },
  options?: { signal?: AbortSignal },
): Promise<{ items: Order[]; nextCursor: string | null }>
```

- Symuluje opóźnienie sieciowe 200–800ms (losowo — odpowiedzi mogą wrócić w innej kolejności niż zapytania zostały wysłane).
- Paginacja kursorowa: `cursor` to wartość `nextCursor` zwrócona z poprzedniej strony; pomiń dla pierwszej strony. `nextCursor: null` oznacza koniec listy.
- **Kursor jest liczony względem aktualnego zestawu wyszukiwania/sortowania** — zmiana `search`, `sortBy` lub `sortDir` musi zacząć paginację od nowa (bez `cursor`).
- Wyszukiwanie frazy `"error"` zawsze kończy się odrzuceniem promise — do przetestowania stanu błędu.
- Respektuje `AbortSignal` — po `abort()` promise zostaje odrzucony z `AbortError`.

Nie modyfikuj tego pliku — traktuj go jak zewnętrzne API, którego nie kontrolujesz.

Twoim zadaniem jest dokończenie komponentu `OrdersTable` w `src/components/OrdersTable/OrdersTable.tsx` (możesz go dowolnie przebudować, wydzielić hooki do `src/hooks`, dodać komponenty pomocnicze). Obecna wersja pobiera i renderuje tylko pierwszą stronę wyników, bez wyszukiwania, sortowania, doczytywania czy wirtualizacji — to punkt wyjścia.

## Wymagania funkcjonalne

1. **Wyszukiwanie**: pole tekstowe filtrujące po nazwie klienta, zapytania debounce'owane (np. 300ms). Zmiana wyszukiwania resetuje paginację do pierwszej strony i odrzuca wcześniej pobrane wiersze.
2. **Sortowanie**: kliknięcie nagłówka kolumny „Kwota” lub „Data” sortuje po tej kolumnie (kolejne kliknięcie odwraca kierunek). Zmiana sortowania resetuje paginację do pierwszej strony. Nagłówek aktywnej kolumny sortowania powinien mieć atrybut `aria-sort` (`ascending`/`descending`).
3. **Doczytywanie kolejnych stron (infinite scroll)**: przewinięcie kontenera tabeli blisko dołu doczytuje kolejną stronę (`cursor` = `nextCursor` z poprzedniej odpowiedzi) i dokleja wyniki do już wyrenderowanych, aż `nextCursor` będzie `null` — wtedy pokaż informację o końcu listy.
4. **Wirtualizacja wierszy**: renderuj w DOM tylko wiersze znajdujące się w widocznym obszarze kontenera (plus niewielki bufor), niezależnie od tego, ile wierszy zostało już pobranych — **bez użycia biblioteki do wirtualizacji** (np. react-window). Całkowita wysokość przewijania ma odpowiadać liczbie już pobranych wierszy (technika "spacera"), a pozycja przewijania nie może "skakać" przy doczytywaniu kolejnej strony.
5. **Race condition**: jeśli użytkownik szybko zmienia wyszukiwanie i/lub sortowanie, a odpowiedzi z serwera wrócą w innej kolejności niż zapytania zostały wysłane — na liście muszą się finalnie znaleźć wyniki odpowiadające **ostatniemu** stanowi wyszukiwania/sortowania. Odpowiedzi należące do nieaktualnego już zapytania (w tym doczytane nimi kolejne strony) nie mogą trafić na listę.
6. Stan ładowania początkowego, stan błędu (z możliwością ponowienia) i stan pustych wyników („Brak wyników dla …”).
7. Osobny, nieblokujący wskaźnik ładowania kolejnej strony przy scrollu (bez chowania już wyświetlonych wierszy) oraz obsługa błędu doczytywania (retry bez utraty wcześniej załadowanych danych).

## Wymagania niefunkcjonalne

- TypeScript bez `any`, sensowne typowanie.
- Dostępność: nagłówki sortowalnych kolumn operowalne klawiaturą (semantyka przycisku, nie samo `onClick` na `<th>`) z `aria-sort`; stan ładowania/błędu/końca listy zrozumiały bez polegania wyłącznie na kolorze czy pozycji.
- Wydajność: unikaj przeliczania i re-renderowania wszystkich wierszy przy każdej zmianie scrolla — wirtualizacja i obliczenia z nią związane powinny być odizolowane (np. w custom hooku) od pobierania danych.
- Czysty, testowalny kod — rozważ wydzielenie logiki (paginacja, wirtualizacja, rozwiązywanie race condition) do custom hooków, oddzielnie od warstwy prezentacji.
- Poprawny cleanup nasłuchiwaczy scrolla / `IntersectionObserver` / `AbortController` w `useEffect` (projekt ma włączony `StrictMode`).

## Bonus (opcjonalnie, jeśli starczy czasu)

- Użycie `IntersectionObserver` z elementem-sentinelem zamiast nasłuchiwania zdarzenia `scroll` do wykrywania końca listy.
- Testy jednostkowe/integracyjne (Jest + React Testing Library są już zainstalowane, `npm run test`). Szczególnie warto przetestować: matematykę wirtualizacji (który zakres wierszy powinien być renderowany dla danej pozycji scrolla), oraz odrzucanie nieaktualnych odpowiedzi przy szybkiej zmianie wyszukiwania/sortowania.
- Zachowanie pozycji scrolla / stanu wyszukiwania i sortowania przy odmontowaniu i ponownym zamontowaniu komponentu.

## Czego NIE oceniam

- Wyglądu / CSS (ma być użyteczny, nie ma być piękny).
- Konfiguracji builda, ESLint itp.

## Jak zakończyć

Napisz mi, gdy skończysz (albo gdy chcesz przerwać) — przejrzę kod, zapytam o kilka decyzji projektowych i dam feedback tak, jak na prawdziwej rozmowie rekrutacyjnej (code review + pytania).
