# Zadanie: Dostępny dialog potwierdzenia + toast

Poziom: Senior Frontend (React)
Sugerowany czas: 60–90 minut

## Kontekst

W `src/api/mockAccount.ts` znajduje się gotowa, symulowana funkcja API:

```ts
deleteAccount(options?: { signal?: AbortSignal }): Promise<void>
```

- Symuluje realne opóźnienie sieciowe (400–1200ms).
- **Pierwsza próba zawsze kończy się błędem** (`Error`) — do przetestowania stanu błędu i ponowienia. Każda kolejna próba kończy się sukcesem.
- Respektuje `AbortSignal` — po `abort()` promise zostaje odrzucony z `AbortError`.

Nie modyfikuj tego pliku — traktuj go jak zewnętrzne API, którego nie kontrolujesz.

Twoim zadaniem jest dokończenie `DeleteAccountDialog` w `src/components/DeleteAccountDialog/DeleteAccountDialog.tsx`. Obecna wersja to celowo naiwny, niedostępny modal bez żadnej integracji z API — traktuj go jako punkt wyjścia. Możesz go dowolnie przebudować: np. wydzielić reużywalny, generyczny komponent `Dialog` (nie zahardkodowany pod usuwanie konta), komponent `Toast`, hooki do `src/hooks` — struktura jest w Twojej gestii.

## Wymagania funkcjonalne

1. Kliknięcie „Usuń konto” otwiera dialog z potwierdzeniem („Tej operacji nie można cofnąć” + akcje Anuluj/Usuń).
2. Dialog jest renderowany portalem do `document.body` (`createPortal`), niezależnie od miejsca osadzenia komponentu w drzewie DOM.
3. **Zarządzanie fokusem**: po otwarciu fokus przenosi się do wnętrza dialogu (np. na pierwszy fokusowalny element lub kontener dialogu); po zamknięciu wraca dokładnie na element, który dialog otworzył (przycisk „Usuń konto”).
4. **Pułapka fokusu (focus trap)**: dopóki dialog jest otwarty, `Tab`/`Shift+Tab` nie mogą przenieść fokusu poza jego elementy.
5. `Escape` zamyka dialog; kliknięcie w tło (poza treścią dialogu) też zamyka dialog — **ale nie wtedy, gdy trwa operacja usuwania** (żeby nie przerwać żądania w połowie).
6. Gdy dialog jest otwarty: reszta strony nie powinna być dostępna dla technologii asystujących (np. `aria-hidden`/`inert` na elementach poza dialogiem) i strona nie powinna się przewijać w tle.
7. Poprawna semantyka ARIA na kontenerze dialogu: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` wskazujące na tytuł dialogu.
8. Kliknięcie „Usuń” wywołuje `deleteAccount`. Podczas oczekiwania na odpowiedź przyciski w dialogu są zablokowane i widoczny jest stan ładowania. Pierwsza próba zawsze się nie powiedzie — błąd należy pokazać **wewnątrz otwartego dialogu** (bez zamykania go), z możliwością ponowienia. Kolejna próba powinna się powieść.
9. Po sukcesie dialog się zamyka, a użytkownik widzi powiadomienie typu toast (np. „Konto zostało usunięte”), które znika samo po kilku sekundach, ale można je też zamknąć ręcznie przed czasem.
10. Toast musi być ogłaszany czytnikom ekranu (odpowiedni `role`/`aria-live`) — bez wymuszania przeniesienia fokusu na toast.

## Wymagania niefunkcjonalne

- TypeScript bez `any`, sensowne typowanie.
- Pomyśl o generycznym API komponentu `Dialog` (np. propsy `open`, `onOpenChange`, `title`, `children`) zamiast rozwiązania zahardkodowanego pod usuwanie konta — to ma być komponent wielokrotnego użytku.
- Poprawny cleanup nasłuchiwaczy zdarzeń (`keydown`, focus, klik) — projekt ma włączony `StrictMode`, więc podwójne mountowanie w dev ujawni ewentualne wycieki lub podwójne nasłuchiwacze.
- Czysty, testowalny kod — rozważ wydzielenie logiki dialogu (focus trap, przywracanie fokusu, zamykanie) do custom hooka, oddzielnie od warstwy prezentacji.

## Bonus (opcjonalnie, jeśli starczy czasu)

- Kilka toastów jednocześnie ułożonych w stos — każdy znika niezależnie w swoim czasie, kolejne powiadomienia nie nadpisują poprzednich.
- Obsługa `prefers-reduced-motion` / brak zależności działania od animacji.
- Testy jednostkowe/integracyjne (Vitest + React Testing Library są już zainstalowane, `npm run test`). Szczególnie warto przetestować: pułapkę fokusu, powrót fokusu po zamknięciu dialogu oraz retry po błędzie kończący się sukcesem.

## Czego NIE oceniam

- Wyglądu / CSS (ma być użyteczny, nie ma być piękny).
- Konfiguracji builda, ESLint itp.

## Jak zakończyć

Napisz mi, gdy skończysz (albo gdy chcesz przerwać) — przejrzę kod, zapytam o kilka decyzji projektowych i dam feedback tak, jak na prawdziwej rozmowie rekrutacyjnej (code review + pytania).
