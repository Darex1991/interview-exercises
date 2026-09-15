export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

const USERS: User[] = [
  {
    id: "1",
    name: "Alicja Nowak",
    username: "anowak",
    email: "a.nowak@example.com",
  },
  {
    id: "2",
    name: "Bartosz Kowalski",
    username: "bkowalski",
    email: "b.kowalski@example.com",
  },
  {
    id: "3",
    name: "Celina Wiśniewska",
    username: "cwisniewska",
    email: "c.wisniewska@example.com",
  },
  {
    id: "4",
    name: "Damian Wójcik",
    username: "dwojcik",
    email: "d.wojcik@example.com",
  },
  {
    id: "5",
    name: "Ewa Kowalczyk",
    username: "ekowalczyk",
    email: "e.kowalczyk@example.com",
  },
  {
    id: "6",
    name: "Filip Kamiński",
    username: "fkaminski",
    email: "f.kaminski@example.com",
  },
  {
    id: "7",
    name: "Gabriela Lewandowska",
    username: "glewandowska",
    email: "g.lewandowska@example.com",
  },
  {
    id: "8",
    name: "Hubert Zieliński",
    username: "hzielinski",
    email: "h.zielinski@example.com",
  },
  {
    id: "9",
    name: "Irena Szymańska",
    username: "iszymanska",
    email: "i.szymanska@example.com",
  },
  {
    id: "10",
    name: "Jakub Woźniak",
    username: "jwozniak",
    email: "j.wozniak@example.com",
  },
  {
    id: "11",
    name: "Klara Dąbrowska",
    username: "kdabrowska",
    email: "k.dabrowska@example.com",
  },
  {
    id: "12",
    name: "Łukasz Kozłowski",
    username: "lkozlowski",
    email: "l.kozlowski@example.com",
  },
  {
    id: "13",
    name: "Magdalena Jankowska",
    username: "mjankowska",
    email: "m.jankowska@example.com",
  },
  {
    id: "14",
    name: "Norbert Mazur",
    username: "nmazur",
    email: "n.mazur@example.com",
  },
  {
    id: "15",
    name: "Oliwia Krawczyk",
    username: "okrawczyk",
    email: "o.krawczyk@example.com",
  },
  {
    id: "16",
    name: "Patryk Piotrowski",
    username: "ppiotrowski",
    email: "p.piotrowski@example.com",
  },
  {
    id: "17",
    name: "Renata Grabowska",
    username: "rgrabowska",
    email: "r.grabowska@example.com",
  },
  {
    id: "18",
    name: "Sebastian Pawlak",
    username: "spawlak",
    email: "s.pawlak@example.com",
  },
  {
    id: "19",
    name: "Tamara Michalska",
    username: "tmichalska",
    email: "t.michalska@example.com",
  },
  {
    id: "20",
    name: "Urszula Adamczyk",
    username: "uadamczyk",
    email: "u.adamczyk@example.com",
  },
  {
    id: "21",
    name: "Wiktor Dudek",
    username: "wdudek",
    email: "w.dudek@example.com",
  },
  {
    id: "22",
    name: "Zofia Zając",
    username: "zzajac",
    email: "z.zajac@example.com",
  },
  {
    id: "23",
    name: "Adrian Wieczorek",
    username: "awieczorek",
    email: "a.wieczorek@example.com",
  },
  {
    id: "24",
    name: "Barbara Jabłońska",
    username: "bjablonska",
    email: "b.jablonska@example.com",
  },
  {
    id: "25",
    name: "Cezary Wróbel",
    username: "cwrobel",
    email: "c.wrobel@example.com",
  },
];

/**
 * Simuluje wywołanie sieciowe: losowe opóźnienie 200-900ms.
 * Zapytanie o frazę "error" zawsze kończy się odrzuceniem promise (symulacja błędu serwera).
 * Respektuje AbortSignal - po jego zadziałaniu promise powinien zostać odrzucony z DOMException('AbortError').
 */
export function fetchUsers(
  query: string,
  options?: { signal?: AbortSignal },
): Promise<User[]> {
  const signal = options?.signal;
  const delay = 200 + Math.random() * 700;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = setTimeout(() => {
      if (query.trim().toLowerCase() === "error") {
        reject(new Error("Błąd serwera podczas wyszukiwania użytkowników"));
        return;
      }

      const normalized = query.trim().toLowerCase();
      const results = normalized
        ? USERS.filter(
            (u) =>
              u.name.toLowerCase().includes(normalized) ||
              u.username.toLowerCase().includes(normalized),
          )
        : [];

      resolve(results);
    }, delay);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
