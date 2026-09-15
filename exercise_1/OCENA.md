# Ocena: Wyszukiwarka użytkowników (UserSearch)

Data: 2026-09-16
Zadanie: [TASK.md](TASK.md)

## Werdykt

**Zaliczone, bez zastrzeżeń blokujących.** Wszystkie wymagania funkcjonalne i niefunkcjonalne z `TASK.md` spełnione, projekt kompiluje się czysto (`tsc -b`) i wszystkie testy przechodzą.

## Co oceniam najwyżej

- **Architektura**: dobry podział na `useFetchUsers` (fetch + abort), `useDebounce` (debounce + cancel), `useClickOutside`, `UserSearch.utils` (czyste funkcje, łatwe do testowania) i `UserSearchResults` (czysta prezentacja).
- **Race condition**: `AbortController` poprawnie anuluje poprzedni request przy starcie nowego, `AbortError` jest odróżniany od prawdziwych błędów sieci (nie pokazuje fałszywego komunikatu o błędzie).
- **A11y**: poprawny wzorzec ARIA combobox/listbox — `role`, `aria-expanded`, `aria-controls`, `aria-haspopup`, `aria-activedescendant` (poprawnie `undefined`, gdy nic nie jest rozwinięte), `aria-selected` podążające za aktualnie podświetloną opcją.
- **Klawiatura**: `ArrowUp`/`ArrowDown` z zawijaniem, `Enter` wybiera podświetloną opcję, `Escape` zamyka listę.
- **Stany UI**: loading / error+retry / empty / success poprawnie odseparowane i widoczne niezależnie od tego, czy panel jest "expanded".
- **Testy**: pokrycie jednostkowe dla `renderMatchedName`, `onKeyDownCallback` i `useDebounce` (w tym scenariusz kolapsowania szybkich wywołań do jednego).
- **Tempo iteracji na feedbacku**: każda poprawka trafiała w rzeczywistą przyczynę zgłoszonego problemu, a nie tylko w objaw; kiedy jedna naprawa uboczne psuła coś innego (np. loading/error przestały się pokazywać po poprawce zamykania dropdownu), zostało to złapane i naprawione w tej samej turze.

## Błędy znalezione i naprawione w trakcie

1. Podwójny/ukryty input z `role="combobox"` zamiast jednego, prawdziwego inputu sterującego ARIA-atrybutami.
2. Debounce zamykający się nad nieaktualną wartością stanu (`query` sprzed danego keystroke'a) zamiast nad wartością przekazaną w wywołaniu.
3. Brak realnego anulowania poprzedniego requestu (tworzony nowy `AbortController` przy każdym wywołaniu, nigdy nie odwoływany).
4. Błędy w `renderMatchedName` (`slice` z błędnymi indeksami, ucinanie ostatniego znaku, brak lowercase po stronie query).
5. Brak obsługi `Escape` i kliknięcia poza komponentem.
6. `aria-activedescendant` wskazujący na nieistniejący `id` (`"undefined-option"`), gdy nic nie jest podświetlone.
7. Abortowany (superseded) request trafiał do tej samej ścieżki błędu co prawdziwy błąd sieci — użytkownik widział fałszywy komunikat o błędzie.
8. Skrócenie zapytania poniżej progu 2 znaków nie resetowało stanu (`status`) ani nie anulowało oczekującego debounce/fetcha dla poprzedniej, dłuższej frazy.

## Uwaga do dalszej pracy (nieblokująca)

Brakuje testu integracyjnego całego komponentu (`render(<UserSearch/>)` + `userEvent`) pokrywającego pełny przepływ race-condition end-to-end — obecne testy jednostkowe pokrywają logikę pomocniczą, ale nie zachowanie komponentu jako całości.
