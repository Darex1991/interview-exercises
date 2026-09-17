# Co pamiętać – proces rekrutacyjny Frontend

Notatka o typowym przebiegu rekrutacji na stanowisko frontendowe (test automatyczny + rozmowa techniczna) i o tym, jak się do niego przygotować.

## 🧱 Etap 1: Test automatyczny (największe sito)

Test odbywa się zazwyczaj na platformie typu CodeSubmit lub podobnej. Trwa od 60 do 90 minut. Środowisko nie ma zaawansowanego autouzupełniania, więc musisz znać składnię "z głowy".

### Czego się spodziewać?

- **Czysty JavaScript (ES6+)** – zadania algorytmiczne lub manipulacja danymi. Przykładowo: operacje na zagnieżdżonych obiektach/tablicach, asynchroniczność (Promises, async/await), obsługa błędów, debounce/throttle, czy implementacja własnych metod tablicowych (np. własny `.map()` lub `.reduce()`).
- **Zadanie z frameworka (React)** – zbudowanie prostego komponentu UI (np. wyszukiwarka z podpowiedziami live, interaktywna tabela z sortowaniem i filtrowaniem, prosty koszyk zakupowy).
- **CSS / HTML** – zazwyczaj musisz zadbać o to, aby stworzony komponent był responsywny (Flexbox/Grid) i estetyczny, nawet jeśli nie ma na to dużo czasu.

### Jak się przygotować?

- Poćwicz zadania typu Algorithm i Data Structure na LeetCode lub HackerRank (poziom Easy/Medium). Skup się na operacjach na tablicach (`map`, `filter`, `reduce`, `find`) – patrz [exercise_5](../exercise_5/) w tym repo.
- Powtórz podstawy asynchroniczności (jak działa Event Loop, jak poprawnie obsługiwać zapytania HTTP przez `fetch`) – patrz [frontend-interview-questions.md](./frontend-interview-questions.md).
- Napisz kilka prostych mini-aplikacji w czystym React bez używania zewnętrznych bibliotek (wszystko na wbudowanym stanie: `useState`, `useEffect`, `useMemo`).

## 🗣️ Etap 2: Rozmowa techniczna (Vetting Call)

Jeśli przejdziesz test, trafiasz na rozmowę live z frontendowym rekruterem technologicznym. Rozmowa jest w 100% po angielsku.

### Kluczowe zagadnienia teoretyczne, które MUSISZ znać

- **React pod maską** – jak działa Virtual DOM? Czym różni się komponent stanowy od bezstanowego? Kiedy komponent się renderuje ponownie i jak temu zapobiegać (`React.memo`, `useCallback`)?
- **Zarządzanie stanem** – kiedy użyć lokalnego stanu (`useState`), kiedy Context API, a kiedy Redux/Zustand?
- **TypeScript** – typowanie zaawansowane (Generics, Utility Types typu `Pick`, `Omit`, `Partial`), różnice między `interface` a `type`.
- **Wydajność (Performance)** – jak optymalizować aplikacje frontendowe? (lazy loading komponentów, optymalizacja obrazków, unikanie niepotrzebnych re-renderów).
- **Web API i przeglądarka** – różnice między `localStorage`, `sessionStorage` i cookies. Jak działa CORS? (patrz [frontend-interview-questions.md](./frontend-interview-questions.md) – sekcja o CORS).

### Zadanie Live Coding na rozmowie

Często polega na refaktoryzacji brzydkiego kodu (code review na żywo). Rekruter pokazuje komponent pełen błędów wydajnościowych, złych praktyk anty-Reactowych lub luk w bezpieczeństwie, a Twoim zadaniem jest wskazać błędy i przepisać go poprawnie.

## 💡 Praktyczne wskazówki, jak zdać

- **Mów na głos (think aloud)** – podczas live codingu rekruter nie ocenia tylko tego, czy kod działa, ale jak myślisz. Opowiadaj, dlaczego wybierasz takie, a nie inne rozwiązanie.
- **Dbaj o czysty kod** – nawet pod presją czasu w teście automatycznym nazywaj zmienne z sensem (`userId` zamiast `x`), unikaj pisania "kobył" (jedna funkcja robiąca wszystko) i pamiętaj o obsłudze błędów (np. `catch` przy zapytaniach API).
- **Przygotuj angielski "biznesowy"** – przed rozmową poćwicz opowiadanie o swoich poprzednich projektach frontendowych po angielsku. Skup się na tym, jaki problem rozwiązałeś i jaki to miało wpływ na biznes (np. "zoptymalizowałem ładowanie strony o 30%, co przełożyło się na mniejszy bounce rate").

## 🧠 Przykładowe pytania-pułapki

### 1. Jak dokładnie działa `useState` w kontekście asynchroniczności i kolejkowania (batching)?

Co konsola wypisze w poniższym przykładzie w React 18+?

```jsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(prev => prev + 1);

  console.log(count);
};
```

**Odpowiedź:** konsola wypisze `0`, a ostateczny stan po zakończeniu funkcji wyniesie `2`.

**Dlaczego w konsoli jest `0`?**
Aktualizacja stanu w React jest asynchroniczna z perspektywy wykonywanej funkcji. `setCount` nie zmienia zmiennej `count` natychmiast – nowa wartość będzie dostępna dopiero w kolejnym renderze komponentu. `console.log(count)` wciąż odwołuje się do `count` z domknięcia (closure) bieżącego renderu, czyli `0`.

**Dlaczego ostateczny stan to `2`, a nie `3`?**
- Pierwsze `setCount(count + 1)` bazuje na aktualnym closure, gdzie `count` wynosi `0`. Planuje zmianę na `0 + 1 = 1`.
- Drugie `setCount(count + 1)` również widzi `count` jako `0` (render się jeszcze nie odbył) – nadpisuje poprzedni plan i znowu planuje ustawienie stanu na `0 + 1 = 1`.
- Trzecie wywołanie używa tzw. **functional updater** (`prev => prev + 1`). Pobiera ono najbardziej aktualną wartość z kolejki aktualizacji (czyli zaplanowane `1`) i zwiększa ją o jeden (`1 + 1 = 2`).

**Automatic Batching:** React 18 łączy wszystkie te trzy wywołania w jeden re-render (dla oszczędności wydajności) — stąd tylko jedno przeliczenie stanu, a nie trzy osobne rendery.

**Wniosek/zasada do zapamiętania:** jeśli nowa wartość stanu zależy od poprzedniej, zawsze używaj functional updatera (`setCount(prev => prev + 1)`) zamiast odwoływać się do zmiennej ze closure (`setCount(count + 1)`) — inaczej wielokrotne wywołania w tym samym handlerze nadpisują się nawzajem zamiast się sumować.

### 2. Czym różni się `useMemo` od `React.memo`? Kiedy ich użycie może przynieść odwrotny skutek i POGORSZYĆ wydajność aplikacji?

**Różnica:**
- `useMemo` – hook służący do memoizacji **wartości** lub wyniku obliczeń wewnątrz komponentu (zapobiega ponownemu uruchamianiu ciężkich funkcji przy każdym renderze).
- `React.memo` – komponent wyższego rzędu (HOC), który memoizuje **cały komponent UI**. Zapobiega jego ponownemu renderowaniu, jeśli jego propsy nie uległy zmianie.

**Kiedy pogarszają wydajność?**
Memoizacja nie jest darmowa. Każde użycie `useMemo` lub `React.memo` zmusza procesor do wykonywania dodatkowych operacji (porównywanie tablicy zależności albo płytkie porównanie propsów – shallow comparison).

- Jeśli owiniemy w `React.memo` komponent, który i tak niemal zawsze dostaje nowe propsy (lub często się zmienia), aplikacja będzie działać wolniej, bo React za każdym razem wykona test porównawczy, który i tak zakończy się renderem.
- Używanie `useMemo` dla prostych operacji (np. filtrowanie małej tablicy z 5 elementami) kosztuje więcej procesora na zarządzanie hookiem niż na samo wykonanie tej operacji.

**Wniosek/zasada do zapamiętania:** memoizacja to optymalizacja dla konkretnego, zmierzonego problemu (drogie obliczenie, komponent renderujący się rzadko w stosunku do rodzica), a nie domyślna praktyka stosowana "na wszelki wypadek" wszędzie.

### 3. Dlaczego używanie indeksu tablicy (`key={index}`) jako klucza w React jest antywzorcem i jakie błędy w UI może to spowodować?

Wyobraź sobie komponent renderujący listę elementów pobieranych z API.

**Wyjaśnienie:**
React używa właściwości `key`, aby podczas procesu uzgadniania (reconciliation) zorientować się, które elementy na liście zmieniły pozycję, zostały dodane, lub usunięte.

**Problem:** indeks jest powiązany z **pozycją** w tablicy, a nie z konkretną treścią/tożsamością elementu.

**Konsekwencje w UI:**
- Jeśli zaimplementujesz filtrowanie, sortowanie lub usuwanie elementów z wnętrza listy, indeksy się przesuną. React pomyśli, że element pod indeksem `0` to wciąż ten sam komponent co wcześniej, tylko zmieniły mu się właściwości.
- Jeśli elementy listy zawierają wewnętrzny stan (np. niezapisany tekst w polu `<input>`, zaznaczony checkbox albo lokalny timer), ten stan **pozostanie na starej pozycji w UI**, mimo że dane wokół niego się zmieniły. Użytkownik zobaczy np., że usunął pierwszy produkt z koszyka, ale pole tekstowe z komentarzem do tego produktu przeskoczyło na produkt, który wskoczył na jego miejsce.

**Wniosek/zasada do zapamiętania:** jako `key` używaj stabilnego, unikalnego identyfikatora niezależnego od pozycji (np. `id` z bazy danych), a nie indeksu tablicy. Indeks jako `key` jest akceptowalny tylko wtedy, gdy lista jest statyczna i nigdy nie jest reorderowana/filtrowana/mutowana.

## 🛠️ Szybka rada na koniec

Podczas rozmowy rekruterzy bardzo lubią pytać o zarządzanie stanem i architekturę (czysty kod). Jeśli dostaniesz zadanie na żywo, zawsze pamiętaj o wydzielaniu powtarzalnej logiki do custom hooków (np. `useFetch` czy `useAuth`). To natychmiast pokazuje im, że piszesz kod w nowoczesny, produkcyjny sposób, a nie jak amator.
