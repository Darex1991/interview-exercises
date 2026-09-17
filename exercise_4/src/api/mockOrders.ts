export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  createdAt: string;
}

export interface FetchOrdersParams {
  search?: string;
  sortBy?: "date" | "amount";
  sortDir?: "asc" | "desc";
  /** Kursor zwrócony jako `nextCursor` z poprzedniej strony; pomiń dla pierwszej strony. */
  cursor?: string | null;
  /** Liczba zamówień na stronę, domyślnie 30. */
  limit?: number;
}

export interface FetchOrdersResult {
  items: Order[];
  nextCursor: string | null;
}

const STATUSES: Order["status"][] = ["pending", "paid", "cancelled"];

const CUSTOMERS = [
  "Alicja Nowak",
  "Bartosz Kowalski",
  "Celina Wiśniewska",
  "Damian Wójcik",
  "Ewa Kowalczyk",
  "Filip Kamiński",
  "Gabriela Lewandowska",
  "Hubert Zieliński",
  "Irena Szymańska",
  "Jakub Woźniak",
  "Klara Dąbrowska",
  "Łukasz Kozłowski",
  "Magdalena Jankowska",
  "Norbert Mazur",
  "Oliwia Krawczyk",
  "Patryk Piotrowski",
  "Renata Grabowska",
  "Sebastian Pawlak",
  "Tamara Michalska",
  "Urszula Adamczyk",
];

const TOTAL_ORDERS = 300;

const ALL_ORDERS: Order[] = Array.from({ length: TOTAL_ORDERS }, (_, i) => {
  const customer = CUSTOMERS[i % CUSTOMERS.length];
  const daysAgo = (i * 37) % 180;
  const createdAt = new Date(
    Date.now() - daysAgo * 24 * 60 * 60 * 1000,
  ).toISOString();
  const amount = Number((((i * 137) % 950) + 19.99).toFixed(2));
  const status = STATUSES[i % STATUSES.length];

  return {
    id: String(i + 1),
    customer,
    amount,
    status,
    createdAt,
  };
});

function runOnNetwork<T>(
  compute: () => T,
  options?: { signal?: AbortSignal },
): Promise<T> {
  const signal = options?.signal;
  const delay = 200 + Math.random() * 600;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        resolve(compute());
      } catch (error) {
        reject(error);
      }
    }, delay);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

/**
 * Pobiera stronę zamówień z opcjonalnym wyszukiwaniem po nazwie klienta i sortowaniem.
 * Symuluje opóźnienie sieciowe 200-800ms.
 * Wyszukiwanie frazy "error" zawsze kończy się błędem - do przetestowania stanu błędu.
 * Paginacja kursorowa: `cursor` to wartość `nextCursor` z poprzedniej odpowiedzi,
 * `nextCursor: null` oznacza koniec listy. Kursor jest liczony względem AKTUALNEGO
 * zestawu wyszukiwania/sortowania - zmiana `search`/`sortBy`/`sortDir` zaczyna od nowa.
 */
export function fetchOrders(
  params: FetchOrdersParams,
  options?: { signal?: AbortSignal },
): Promise<FetchOrdersResult> {
  return runOnNetwork(() => {
    const search = (params.search ?? "").trim().toLowerCase();
    if (search === "error") {
      throw new Error("Błąd serwera podczas pobierania zamówień");
    }

    const filtered = search
      ? ALL_ORDERS.filter((o) => o.customer.toLowerCase().includes(search))
      : ALL_ORDERS;

    const sortBy = params.sortBy ?? "date";
    const sortDir = params.sortDir ?? "desc";
    const sorted = [...filtered].sort((a, b) => {
      const cmp =
        sortBy === "amount"
          ? a.amount - b.amount
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });

    const limit = params.limit ?? 30;
    const offset = params.cursor ? Number(params.cursor) : 0;
    const page = sorted.slice(offset, offset + limit);
    const nextOffset = offset + limit;
    const nextCursor = nextOffset < sorted.length ? String(nextOffset) : null;

    return { items: page, nextCursor };
  }, options);
}
