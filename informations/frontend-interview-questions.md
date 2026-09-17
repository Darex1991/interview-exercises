# Pytania rekrutacyjne – Frontend Engineer (pełne spektrum)

Zbiór pytań i odpowiedzi pokrywających typowy proces rekrutacyjny na frontendowca (Senior/Mid): pytania techniczne o JS/CSS/React, DSA, machine coding, behawioralne, HLD/LLD, data pipelines, skalowalność i REST API. Powiązane, bardziej rozwinięte tematy są w osobnych plikach: [system-design.md](./system-design.md), [microservices.md](./microservices.md), [nextjs-architecture.md](./nextjs-architecture.md).

---

## 1. Pytania frontendowe (JS / CSS / przeglądarka / React)

**Czym różni się `var`, `let` i `const`?**
`var` ma zasięg funkcyjny i jest hoistowana z wartością `undefined` (Temporal-Dead-Zone jej nie dotyczy). `let`/`const` mają zasięg blokowy i podlegają TDZ – odwołanie przed deklaracją rzuca `ReferenceError`. `const` nie pozwala na ponowne przypisanie referencji (ale obiekt pod spodem nadal jest mutowalny).

**Co to jest closure (domknięcie) i do czego się je wykorzystuje?**
Funkcja "pamięta" zmienne ze swojego zasięgu leksykalnego nawet po zakończeniu działania funkcji zewnętrznej. Zastosowania: enkapsulacja stanu (moduły, liczniki), memoizacja, curry, implementacja `debounce`/`throttle`, prywatne zmienne przed ES2022 `#private`.

**Czym jest Promise i jakie ma stany?**
Obiekt reprezentujący wynik operacji asynchronicznej, który w danym momencie jest w jednym z trzech stanów: **pending** (oczekująca, jeszcze nierozstrzygnięta), **fulfilled** (zakończona sukcesem – ma wartość) albo **rejected** (zakończona błędem – ma powód odrzucenia). Stan zmienia się tylko raz i jest nieodwracalny (settled promise nie może później zmienić wyniku). Obsługuje się go przez `.then(onFulfilled, onRejected)` / `.catch()` / `.finally()`, albo składniowo przez `async/await` (który jest "cukrem" na promisach – `await` po prostu czeka na rozstrzygnięcie i rozpakowuje wartość albo rzuca wyjątek przy odrzuceniu).

Przydatne metody statyczne:
- `Promise.all([...])` – czeka na wszystkie, odrzuca się przy pierwszym błędzie (fail-fast).
- `Promise.allSettled([...])` – czeka na wszystkie i zawsze się rozwiązuje, zwracając status każdej (`fulfilled`/`rejected`) – dobre gdy chcesz wyniki niezależnie od tego, czy któraś się nie powiodła.
- `Promise.race([...])` – rozstrzyga się jak tylko pierwsza z promis się rozstrzygnie (sukcesem lub błędem) – używane np. do implementacji timeoutu (`Promise.race([fetch(url), timeout(5000)])`).
- `Promise.any([...])` – rozstrzyga się sukcesem jak tylko pierwsza się powiedzie, odrzuca dopiero gdy wszystkie zawiodą.

**Event loop – jak działa kolejność wykonania `setTimeout`, `Promise` i kodu synchronicznego?**
JS jest jednowątkowy: najpierw wykonuje się cały synchroniczny call stack, potem **microtaski** (Promise `.then`, `queueMicrotask`, `async/await`) aż do wyczerpania kolejki, dopiero potem **macrotaski** (`setTimeout`, `setInterval`, I/O). Dlatego `Promise.resolve().then(...)` wykona się przed `setTimeout(..., 0)`.

**Różnica między `==` a `===`?**
`==` wykonuje koercję typów przed porównaniem (często zaskakujące wyniki, np. `'' == 0` → `true`), `===` porównuje bez konwersji. W praktyce zawsze używaj `===`, chyba że świadomie chcesz koercji (np. porównanie z `null`/`undefined`: `x == null`).

**Co to jest event bubbling/capturing i delegacja zdarzeń?**
Zdarzenie DOM przechodzi 3 fazy: capturing (od `window` w dół do targetu), target, bubbling (od targetu w górę). Delegacja zdarzeń wykorzystuje bubbling – zamiast podpinać listener do każdego elementu listy, podpinasz jeden do rodzica i sprawdzasz `event.target`. Zaleta: mniej listenerów, działa też na dynamicznie dodane elementy.

**Czym jest problem CORS i jak go rozwiązać?**
CORS (Cross-Origin Resource Sharing) to mechanizm bezpieczeństwa przeglądarki, który domyślnie blokuje odczyt odpowiedzi z requestu JS do **innego origin** (inna kombinacja schemat + domena + port) niż ten, z którego pochodzi strona – tzw. *Same-Origin Policy*. Sam request często faktycznie leci do serwera (backend go widzi i wykonuje!), ale przeglądarka **blokuje dostęp do odpowiedzi** po stronie klienta, jeśli serwer nie zezwoli na to jawnie.

Jak to działa:
- Dla prostych requestów (`GET`/`POST` z podstawowymi nagłówkami) przeglądarka od razu wysyła request i sprawdza w odpowiedzi nagłówek `Access-Control-Allow-Origin` – jeśli nie zgadza się z origin strony (i nie jest `*`), JS nie dostaje dostępu do odpowiedzi.
- Dla "nieprostych" requestów (np. `PUT`/`DELETE`, custom nagłówki typu `Authorization`, `Content-Type: application/json`) przeglądarka najpierw wysyła **preflight** – zapytanie `OPTIONS` – i dopiero po otrzymaniu zgody (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`) wysyła właściwy request.
- Przy requestach z ciasteczkami/credentials trzeba dodatkowo ustawić `Access-Control-Allow-Credentials: true` po stronie serwera i `credentials: 'include'` po stronie klienta – wtedy `Access-Control-Allow-Origin` **nie może** być `*`, musi być konkretną domeną.

Rozwiązanie leży **po stronie backendu/serwera**, nie frontendu – trzeba skonfigurować poprawne nagłówki CORS (albo przez framework, reverse proxy/API Gateway, albo np. CDN). Częsty obejściowy (i niepolecany na produkcji) sposób w developmencie to proxy w dev-serwerze (np. `devServer.proxy` w Vite/CRA), które sprawia, że z perspektywy przeglądarki request idzie do tego samego origin, a serwer developerski przekazuje go dalej do właściwego API.

**`Object.freeze` a immutability w React/Redux – po co?**
Reference equality (`===`) jest tanim sposobem wykrywania zmian (React `memo`, Redux `connect`, `useMemo`) – jeśli mutujesz obiekt w miejscu, referencja się nie zmienia i komponent/selektor "nie widzi" zmiany, mimo że dane są inne. Stąd wzorce immutable update (spread, `structuredClone`, biblioteki jak Immer).

**Box model w CSS: `content-box` vs `border-box`?**
`content-box` (domyślny) – `width`/`height` dotyczą tylko treści, padding i border się dodają. `border-box` – `width`/`height` obejmują content + padding + border, co ułatwia liczenie layoutu (dlatego często ustawia się globalnie `* { box-sizing: border-box; }`).

**Flexbox vs CSS Grid – kiedy co?**
Flexbox – układ jednowymiarowy (rząd lub kolumna), dobry do rozkładania elementów w linii (nawigacja, karty w rzędzie). Grid – układ dwuwymiarowy (rzędy i kolumny naraz), lepszy do całych layoutów strony/siatek kart.

**Czym jest reflow i repaint i jak ich unikać?**
Reflow (layout) – przeglądarka przelicza geometrię elementów (zmiana rozmiaru/pozycji) – kosztowne. Repaint – tylko przemalowanie (np. zmiana koloru) bez zmiany layoutu – tańsze. Unikanie: batchowanie odczytów/zapisów DOM (nie czytaj `offsetHeight` zaraz po zmianie stylu w pętli), animowanie `transform`/`opacity` zamiast `top`/`left`/`width` (te pierwsze idą przez GPU, omijają layout).

**React: różnica między `useEffect` a `useLayoutEffect`?**
`useEffect` uruchamia się asynchronicznie po namalowaniu ekranu przez przeglądarkę (nie blokuje renderu). `useLayoutEffect` uruchamia się synchronicznie **przed** namalowaniem – używany, gdy trzeba zmierzyć/zmodyfikować DOM zanim użytkownik zobaczy migotanie (np. pozycjonowanie tooltipa).

**Po co jest `key` w listach w React i dlaczego index jako key bywa problemem?**
`key` pomaga reconciliation algorithmowi zidentyfikować, który element listy odpowiada któremu w poprzednim renderze (żeby nie remountować wszystkiego). Index jako `key` psuje się, gdy lista jest reorderowana/filtrowana – React może pomylić który stan (np. wartość inputa) należy do którego elementu wizualnego.

**Czym jest wirtualny DOM i czy to "magia wydajności"?**
To lekka reprezentacja drzewa UI w JS. React porównuje (diffing) nowe i stare drzewo i aktualizuje realny DOM minimalnym zestawem operacji. To nie zawsze szybsze niż ręczna manipulacja DOM – zaletą jest **przewidywalny model programowania** (deklaratywny UI = f(state)), a nie sama surowa wydajność.

**Jak działa `this` w JS – różnica między function declaration a arrow function?**
Zwykła funkcja ma własne `this` ustalane w momencie **wywołania** (zależy od tego, jak jest wołana – `obj.method()`, `call/apply/bind`). Arrow function nie ma własnego `this` – dziedziczy je leksykalnie z otaczającego zasięgu. Dlatego w klasach/komponentach arrow function jest wygodna do handlerów zdarzeń (nie trzeba `.bind(this)`).

**Web Performance: co to Core Web Vitals?**
- **LCP** (Largest Contentful Paint) – jak szybko renderuje się największy widoczny element.
- **INP** (Interaction to Next Paint, następca FID) – responsywność na interakcje użytkownika.
- **CLS** (Cumulative Layout Shift) – ile "skacze" layout podczas ładowania (np. obrazy bez zarezerwowanego miejsca).

---

## 2. DSA (struktury danych i algorytmy)

Rzadziej dominują na rozmowach frontendowych niż backendowych, ale nadal się pojawiają – zwykle na poziomie easy/medium (LeetCode).

**Two Sum** – znajdź dwa indeksy, których wartości sumują się do targetu.
Rozwiązanie: hash mapa `wartość → indeks`, jeden przebieg – dla każdego elementu sprawdź, czy `target - x` już jest w mapie. Złożoność: O(n) czasu, O(n) pamięci (zamiast O(n²) brute force).

**Sliding Window – najdłuższy podciąg bez powtarzających się znaków.**
Dwa wskaźniki (`left`, `right`) + `Set`/mapa ostatnich pozycji znaków. Rozszerzaj `right`, a gdy natrafisz na duplikat – przesuwaj `left` za jego poprzednie wystąpienie. O(n) zamiast O(n²).

**Debounce vs Throttle – zaimplementuj oba (klasyczne pytanie na pograniczu DSA/machine coding).**
```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (inThrottle) return;
    fn(...args);
    inThrottle = true;
    setTimeout(() => (inThrottle = false), limit);
  };
}
```
Debounce – wykonaj dopiero, gdy zdarzenia przestaną napływać przez `delay` (np. autocomplete – czekaj aż user przestanie pisać). Throttle – wykonuj co najwyżej raz na `limit` ms niezależnie od częstotliwości zdarzeń (np. scroll handler).

**Walidacja nawiasów (Valid Parentheses).**
Stos: dla `(`, `[`, `{` odkładaj na stos, dla zamykających sprawdź czy szczyt stosu pasuje – jeśli nie, `false`. Na końcu stos musi być pusty. O(n).

**Spłaszczanie zagnieżdżonej tablicy (`flatten`).**
Rekurencyjnie: jeśli element jest tablicą, wywołaj `flatten` na nim i rozlej wynik (`concat`/spread), inaczej dodaj element. `Array.prototype.flat(Infinity)` robi to natywnie, ale implementacja "z głowy" to częste pytanie.

**BFS/DFS na drzewie DOM.**
DOM to drzewo – "przejdź po wszystkich elementach i policz X" to w praktyce DFS (rekurencja po `element.children`) albo BFS (kolejka). Częste w kontekście np. implementacji własnego "querySelectora" albo liczenia głębokości drzewa komponentów.

**LRU Cache.**
Mapa (zachowuje kolejność wstawiania w JS) + limit rozmiaru: przy odczycie – usuń i wstaw ponownie klucz (przesuwa go na koniec = "najświeższy"), przy przekroczeniu limitu – usuń pierwszy klucz z mapy (najdawniej używany). O(1) get/put.
```js
class LRUCache {
  constructor(capacity) { this.capacity = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value);
    this.map.set(key, value);
  }
}
```

**Czego szuka rekruter przy DSA na frontend?**
Zwykle nie oczekuje się algorytmów grafowych/DP na poziomie hard – liczy się umiejętność rozłożenia problemu, dobór właściwej struktury danych (hash mapa zamiast zagnieżdżonej pętli), analiza złożoności i czyste nazewnictwo/edge case'y (pusta tablica, `null`, duplikaty).

---

## 3. Machine Coding Questions (implementacja "z palca")

Typowe zadania 45–90 minut: napisz działający kod (czasem z UI), bez frameworka albo z React, bez korzystania z gotowych bibliotek.

**Custom `debounce`/`throttle`** – patrz sekcja DSA wyżej.

**Polyfill `Promise.all`.**
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = new Array(promises.length);
    let completed = 0;
    if (promises.length === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p).then((val) => {
        results[i] = val;
        if (++completed === promises.length) resolve(results);
      }, reject);
    });
  });
}
```
Kluczowe: zachować kolejność wyników mimo że promisy mogą się rozwiązać w innej kolejności, i odrzucić całość przy pierwszym błędzie (`reject`).

**Event Emitter (pub/sub) od zera.**
```js
class EventEmitter {
  #listeners = new Map();
  on(event, cb) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(cb);
    return () => this.off(event, cb);
  }
  off(event, cb) {
    this.#listeners.set(event, (this.#listeners.get(event) ?? []).filter((f) => f !== cb));
  }
  emit(event, ...args) {
    (this.#listeners.get(event) ?? []).forEach((cb) => cb(...args));
  }
}
```
To baza pod pytania o architekturę pub/sub, komunikację między komponentami bez propsów, albo "zaimplementuj mini-Redux".

**Curry.**
```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...next) => curried(...args, ...next);
  };
}
```

**Deep Clone (bez `structuredClone`).**
Rekurencja po kluczach obiektu/tablicy, obsługa `Date`, `Map`, `Set`, cykli referencyjnych (mapa `WeakMap` odwiedzonych obiektów → klon), zachowanie prototypu.

**Komponent Autocomplete/Typeahead.**
Wymagania do omówienia z rekruterem: debounce zapytań, anulowanie nieaktualnych requestów (żeby wolniejsza wcześniejsza odpowiedź nie nadpisała nowszej – `AbortController` albo porównanie "id ostatniego zapytania"), nawigacja klawiaturą (strzałki, Enter, Escape), dostępność (`aria-activedescendant`, `role="listbox"`).

**Infinite Scroll / Virtualized List.**
Infinite scroll: `IntersectionObserver` na "sentinelu" na dole listy, przy wejściu w viewport – doładuj kolejną stronę. Virtualizacja (dla dużych list, np. 10 000 elementów): renderuj tylko elementy widoczne w oknie przewijania + bufor, licz ich pozycję na podstawie `scrollTop` i wysokości elementu (biblioteki: `react-window`, `react-virtual`).

**Modal / Dialog od zera (dostępny).**
Wymagania: focus trap (Tab nie wychodzi poza modal), zamknięcie na `Escape` i kliknięcie w overlay, zwrot focusu do elementu, który otworzył modal, `role="dialog"` + `aria-modal="true"`, blokada scrolla body w tle.

**Todo App / Tabs / Accordion / Star Rating.**
Klasyczne "zbuduj mały komponent UI ze stanem" – oceniane jest: podział na komponenty, unikanie zbędnego re-renderu, kontrolowany vs niekontrolowany komponent, obsługa klawiatury i podstawowa dostępność (`aria-*`).

---

## 4. Behavioral Questions (pytania behawioralne)

Odpowiadaj metodą **STAR**: **S**ituation (kontekst) → **T**ask (twoje zadanie/cel) → **A**ction (co konkretnie zrobiłeś, "ja", nie "zespół") → **R**esult (mierzalny efekt + czego się nauczyłeś).

Najczęstsze pytania:

- "Opowiedz o sytuacji konfliktu w zespole – jak go rozwiązałeś?"
- "Opisz najtrudniejszy bug, jaki naprawiłeś." (pokaż proces debugowania, nie tylko fix)
- "Kiedy nie zgodziłeś się z decyzją techniczną managera/tech leada?"
- "Opowiedz o projekcie, który się nie udał – co poszło nie tak i co byś zrobił inaczej?"
- "Jak priorytetyzujesz zadania, gdy masz kilka deadline'ów naraz?"
- "Opisz sytuację, gdy musiałeś nauczyć się nowej technologii pod presją czasu."
- "Jak dajesz i przyjmujesz feedback w code review?"
- "Opowiedz o sytuacji, gdy musiałeś przekonać zespół do swojego pomysłu technicznego."

Wskazówki:

- Miej przygotowane 4-6 konkretnych historii (z liczbami: "skróciłem czas ładowania o 40%", "zredukowałem liczbę buggów o X") i dopasowuj je do pytania, zamiast improwizować od zera.
- Unikaj obwiniania innych ("mój kolega zawalił") – pokazuj co **ty** zrobiłeś, żeby naprawić sytuację.
- Krótkie R (Result) z liczbą/wnioskiem jest ważniejsze niż długi opis A (Action).

---

## 5. High-Level Design (HLD)

Pełniejsze wprowadzenie do system design ogólnie: [system-design.md](./system-design.md). Tu przykładowe pytania stosowane głównie na rozmowach frontendowych/full-stack.

**Zaprojektuj system autocomplete/wyszukiwarki (jak Google Search suggestions).**
Kluczowe elementy: debounce inputu (200–300ms), cache odpowiedzi po stronie klienta (te same zapytanie nie leci drugi raz), anulowanie przestarzałych requestów, backend z indeksem typu Trie/prefix-index albo Elasticsearch, CDN/edge cache dla najpopularniejszych fraz, ranking po popularności + personalizacji.

**Zaprojektuj infinite-scrolling news feed (jak Instagram/Facebook).**
Paginacja kursorowa (nie offsetowa – offset "jedzie" przy nowych postach), fan-out on read (feed budowany przy odczycie – dobre dla użytkowników z małą liczbą znajomych) vs fan-out on write (feed prekomputowany przy publikacji – dobre dla dużych "gwiazd"/celebrytów – hybrydowo w praktyce), cache CDN dla mediów, optymistyczne UI przy polubieniach/komentarzach.

**Zaprojektuj real-time collaborative editor (jak Google Docs).**
Operational Transformation (OT) albo CRDT do rozwiązywania konfliktów jednoczesnej edycji, WebSocket do propagacji zmian w czasie rzeczywistym, presence (kto jest online, gdzie ma kursor), okresowe snapshoty dokumentu + log operacji do odtwarzania historii/undo.

**Zaprojektuj system powiadomień (notifications) na froncie.**
WebSocket/SSE do push w czasie rzeczywistym (fallback: polling), kolejka po stronie backendu (Kafka/SQS) między producentami zdarzeń a serwisem powiadomień, batching/deduplikacja (nie wysyłaj 50 osobnych powiadomień o tej samej akcji), przechowywanie stanu przeczytane/nieprzeczytane, throttling żeby nie zalać usera.

**Zaprojektuj skalowalną architekturę frontendu dla dużej organizacji (wiele zespołów).**
Micro-frontends (Module Federation) albo monorepo ze współdzielonymi pakietami (patrz [nextjs-architecture.md – sekcja o monorepo](./nextjs-architecture.md#10-organizacja-większych-aplikacji)), design system jako osobny pakiet, niezależne wdrażanie per zespół/domenę, wspólna warstwa auth/routing, feature flagi do stopniowego wypuszczania funkcji.

**Zaprojektuj system do obsługi uploadu dużych plików (np. wideo).**
Chunked upload (dzielenie pliku na fragmenty) z możliwością wznowienia po zerwaniu połączenia, upload bezpośrednio do storage (np. presigned URL do S3) zamiast przez własny backend (odciążenie), pasek postępu per chunk, walidacja typu/rozmiaru po stronie klienta przed wysyłką (UX) i ponownie po stronie serwera (bezpieczeństwo).

---

## 6. Low-Level Design (LLD)

LLD to zwykle: zaprojektuj klasy/interfejsy (OOP) dla konkretnego mechanizmu, bez rozwiązywania problemów skali sieciowej.

**Zaprojektuj mini-Redux (store, reducer, subscribe).**
```js
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((l) => l());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
```
Rozmowa idzie dalej w stronę: jak dodać middleware (np. logger, thunk – funkcja opakowująca `dispatch`), jak zapewnić immutability, jak podpiąć do React (`useSyncExternalStore`).

**Zaprojektuj klasę Promise od zera (uproszczoną).**
Stany `pending/fulfilled/rejected`, kolejka callbacków zarejestrowanych przez `.then()` zanim promise się rozstrzygnie, wywołanie callbacków asynchronicznie (mikrotaski) nawet jeśli promise jest już rozstrzygnięty w momencie wywołania `.then`.

**Zaprojektuj rate limiter (klasa, do użycia np. w middleware).**
Token Bucket: `capacity`, `tokens`, `refillRate`. Metoda `tryConsume()` – dolicz tokeny na podstawie czasu, który minął od ostatniego refill, jeśli `tokens >= 1` odejmij i zwróć `true`, inaczej `false`. Alternatywa: sliding window log (lista timestampów, licz ile mieści się w oknie).

**Zaprojektuj system komponentów formularza (walidacja, zależne pola).**
Osobny "model" stanu formularza (wartości, błędy, dotknięte pola) niezależny od UI, walidacja per-pole i on-submit, obsługa pól zależnych (np. "województwo" filtruje listę "miasto"), debounce walidacji asynchronicznej (np. sprawdzenie unikalności emaila).

**Klasyczne LLD spoza świata frontendu (czasem pytane niezależnie od stacku): Parking Lot, Tic-Tac-Toe, System rezerwacji biletów kinowych.**
Ćwiczenie modelowania: identyfikacja encji (klasy), relacji między nimi, strategii (np. `PricingStrategy` jako interfejs z różnymi implementacjami), stanów (maszyna stanów rezerwacji: `available → reserved → paid → cancelled`).

---

## 7. Data Pipelines (perspektywa frontendu)

Frontend rzadko *buduje* pipeline'y danych, ale **jest ich źródłem** i musi się z nimi integrować.

**Jak zaprojektować zbieranie zdarzeń analitycznych (event tracking) z aplikacji frontendowej?**
- Zdarzenia batchowane po stronie klienta i wysyłane okresowo/na `visibilitychange`/`beforeunload` (żeby nie robić requestu na każdy klik) – często przez `navigator.sendBeacon` (nie blokuje/nie ginie przy zamykaniu karty).
- Kolejka lokalna (np. w pamięci/`IndexedDB`) na wypadek offline – wysyłka po powrocie połączenia.
- Backend odbiera zdarzenia i wrzuca je do brokera (Kafka/Kinesis) → dalsze przetwarzanie (agregacje, ETL do hurtowni danych typu BigQuery/Snowflake).
- Kluczowe wymagania niefunkcjonalne: nie blokować głównego wątku, nie wpływać na wydajność (Core Web Vitals), zgodność z RODO/consent (nie wysyłaj eventów przed zgodą na cookies analityczne).

**Jak monitorować błędy i wydajność produkcyjną (RUM – Real User Monitoring)?**
Narzędzia typu Sentry/Datadog RUM zbierają: nieobsłużone wyjątki (`window.onerror`, `unhandledrejection`), metryki Core Web Vitals z prawdziwych użytkowników, source maps do deobfuskacji stack trace z zminifikowanego builda. Pipeline: SDK w aplikacji → batchowanie → endpoint kolekcjonujący → przetwarzanie/alerting.

**Czym różni się pipeline CI/CD frontendu od backendu?**
Dodatkowe kroki: lint/typecheck, build (bundlowanie, tree-shaking), testy wizualne/regresyjne (Chromatic, Percy), analiza rozmiaru bundla (budget – fail build jeśli bundle urósł ponad limit), deployment na CDN/edge (często wielo-regionowy, z cache invalidation), feature flagi do stopniowego rolloutu zamiast pełnego przełącznika.

---

## 8. Scalable Systems (skalowalność – kontekst frontendowy)

Ogólne mechanizmy skalowania (load balancing, cache, bazy danych) są opisane w [system-design.md](./system-design.md). Tu specyficznie dla frontendu:

- **Code splitting / lazy loading** – dziel bundle per trasa/feature (`dynamic import()`), żeby użytkownik nie pobierał kodu, którego nie potrzebuje na start.
- **CDN + cache statycznych assetów** – pliki JS/CSS z hashem w nazwie (content hashing) mogą mieć `Cache-Control: immutable` na rok; HTML zwykle bez długiego cache (żeby dostać najnowsze odnośniki do assetów).
- **Micro-frontends** – niezależne wdrażanie fragmentów UI przez różne zespoły (Module Federation, single-spa) – kompromis: prostsza skalowalność organizacyjna kosztem złożoności runtime (duplikacja zależności, spójność UX).
- **Server-Side Rendering / edge rendering** – renderowanie bliżej użytkownika (patrz [nextjs-architecture.md](./nextjs-architecture.md)) zamiast całości logiki na jednym centralnym serwerze.
- **Performance budget** – twarde limity (np. "bundle JS < 200KB gzip", "LCP < 2.5s") pilnowane w CI, żeby wydajność nie degradowała się niezauważalnie z czasem.
- **Feature flags / progressive rollout** – wypuszczanie nowej funkcji na % ruchu zamiast 100% na raz, żeby ograniczyć blast radius błędu.

---

## 9. REST API – pytania

**Co to jest REST i jakie są jego zasady?**
Architektura oparta o zasoby (resources) identyfikowane przez URL, operowane standardowymi metodami HTTP, **bezstanowa** (każdy request niesie cały potrzebny kontekst – serwer nie trzyma sesji między requestami), z jednolitym interfejsem (uniform interface) i (opcjonalnie w pełnym REST) HATEOAS – odpowiedzi zawierają linki do powiązanych akcji/zasobów.

**Metody HTTP i idempotencja – co to znaczy, że metoda jest idempotentna?**
Idempotentna = wielokrotne wykonanie tej samej operacji daje ten sam efekt końcowy co jednokrotne.
- `GET` – bezpieczna i idempotentna (tylko odczyt).
- `PUT` – idempotentna (nadpisuje cały zasób tą samą wartością).
- `DELETE` – idempotentna (po pierwszym usunięciu kolejne dają ten sam stan "nie istnieje", nawet jeśli status kodu się różni).
- `POST` – **nie** jest idempotentna (każde wywołanie może tworzyć nowy zasób – ważne przy retry po timeoucie: podwójny `POST` = podwójny rekord, stąd wzorzec `idempotency key`).
- `PATCH` – częściowa aktualizacja, zwykle nieidempotentna (zależy od implementacji, np. `PATCH { "count": count + 1 }` nie jest, ale `PATCH { "count": 5 }` jest).

**Najważniejsze kody statusów HTTP.**
- `200 OK`, `201 Created`, `204 No Content` (sukces bez treści odpowiedzi, np. po `DELETE`).
- `304 Not Modified` (cache nadal aktualny, w parze z `ETag`/`If-None-Match`).
- `400 Bad Request` (błędne dane wejściowe), `401 Unauthorized` (brak/zła autentykacja), `403 Forbidden` (jest autentykacja, ale brak uprawnień), `404 Not Found`, `409 Conflict` (np. konflikt wersji zasobu), `422 Unprocessable Entity` (walidacja się nie powiodła).
- `429 Too Many Requests` (rate limiting), `500` (błąd serwera), `503 Service Unavailable`.

**Paginacja: offset-based vs cursor-based – różnice?**
- **Offset** (`?page=3&limit=20` / `?offset=40&limit=20`) – prosty, ale przy dodawaniu/usuwaniu rekordów w trakcie przeglądania strony "przeskakują" lub duplikują wyniki; wolny przy dużym offsecie (baza nadal musi przeliczyć pominięte wiersze).
- **Cursor-based** (`?after=<id_lub_token_ostatniego_elementu>`) – stabilny nawet przy zmieniających się danych, wydajny (bezpośredni skok w indeksie), ale nie pozwala łatwo "skoczyć na stronę 5" – tylko sekwencyjnie dalej/wstecz. Standard w API dużej skali (Twitter, Slack, Stripe).

**Jak wersjonować REST API?**
Najczęściej w URL (`/v1/users`) – proste i widoczne, ale "brudzi" URL. Alternatywy: nagłówek (`Accept: application/vnd.myapi.v2+json`) – czystszy URL, ale trudniejszy do przetestowania w przeglądarce. Zasada ogólna: unikaj wersjonowania jak długo się da poprzez **rozszerzanie** kontraktu w sposób wsteczny kompatybilny (dodawanie opcjonalnych pól, nigdy nie usuwaj/zmieniaj znaczenia istniejących).

**REST vs GraphQL vs gRPC – kiedy co?**
- **REST** – prosty, dobrze cache'owalny (po URL), szeroko wspierany, ale podatny na over-fetching/under-fetching (dostajesz cały zasób albo musisz robić wiele requestów po powiązane dane).
- **GraphQL** – klient deklaruje dokładnie jakie pola potrzebuje w jednym zapytaniu (rozwiązuje over/under-fetching), dobry przy złożonych, zagnieżdżonych danych z wielu źródeł, ale trudniejszy cache HTTP (zwykle jeden endpoint `POST /graphql`) i wymaga dodatkowej warstwy (resolversy, N+1 problem → DataLoader).
- **gRPC** – binarny protokół (Protocol Buffers) nad HTTP/2, bardzo wydajny, silne typowanie kontraktu – głównie do komunikacji **między serwisami** (service-to-service), rzadko bezpośrednio z przeglądarki (wymaga gRPC-Web + proxy).

**Jak zaprojektować bezpieczne REST API (autentykacja/autoryzacja)?**
- **Autentykacja**: token (JWT) w nagłówku `Authorization: Bearer ...`, albo sesja z cookie `HttpOnly` + `Secure` + `SameSite` (bardziej odporne na XSS niż token w `localStorage`).
- **Autoryzacja**: sprawdzana **zawsze po stronie serwera** dla każdego requestu (nigdy nie ufaj samemu ukryciu przycisku w UI).
- **OAuth2/OIDC** – standard do logowania przez zewnętrznego dostawcę (Google, GitHub) i do autoryzacji API "w imieniu użytkownika" (scopes, refresh tokeny).
- Rate limiting, CORS poprawnie skonfigurowany (nie `Access-Control-Allow-Origin: *` przy endpointach z danymi wrażliwymi/ciasteczkami), walidacja danych wejściowych po stronie serwera.

**Jak obsłużyć błędy w REST API w sposób spójny?**
Jeden format błędu w całym API, np.:
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Email is invalid", "field": "email" } }
```
Kod statusu HTTP niesie **kategorię** błędu (4xx = błąd klienta, 5xx = błąd serwera), a treść odpowiedzi niesie **szczegóły** – klient (frontend) powinien móc rozróżnić błędy programowo (po `code`), a nie parsować ludzki `message`.
