export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

let tasks: Task[] = [
  { id: "1", title: "Przygotować prezentację dla klienta", completed: false },
  { id: "2", title: "Zaktualizować dokumentację API", completed: true },
  { id: "3", title: "Code review dla PR #482", completed: false },
  { id: "4", title: "Naprawić error w module płatności", completed: false },
  { id: "5", title: "Zaplanować retrospektywę sprintu", completed: true },
  { id: "6", title: "Odpowiedzieć na maile od zespołu QA", completed: false },
  { id: "7", title: "Zamówić sprzęt dla nowego pracownika", completed: false },
  { id: "8", title: "Przygotować raport error rate za Q3", completed: false },
  { id: "9", title: "Umówić 1:1 z managerem", completed: true },
  { id: "10", title: "Zrefaktoryzować komponent koszyka", completed: false },
];

let nextId = tasks.length + 1;

function isDoomedToFail(title: string): boolean {
  return title.toLowerCase().includes("error");
}

function runOnNetwork<T>(
  compute: () => T,
  options?: { signal?: AbortSignal },
): Promise<T> {
  const signal = options?.signal;
  const delay = 200 + Math.random() * 700;

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
 * Pobiera listę zadań. Symuluje opóźnienie sieciowe 200-900ms.
 */
export function fetchTasks(options?: {
  signal?: AbortSignal;
}): Promise<Task[]> {
  return runOnNetwork(() => tasks.map((t) => ({ ...t })), options);
}

/**
 * Tworzy nowe zadanie. Tytuły zawierające słowo "error" (bez względu na wielkość liter)
 * zawsze kończą się niepowodzeniem - do testowania stanu błędu.
 */
export function createTask(
  title: string,
  options?: { signal?: AbortSignal },
): Promise<Task> {
  return runOnNetwork(() => {
    if (isDoomedToFail(title)) {
      throw new Error(`Nie udało się utworzyć zadania: "${title}"`);
    }
    const task: Task = { id: String(nextId++), title, completed: false };
    tasks = [task, ...tasks];
    return { ...task };
  }, options);
}

/**
 * Aktualizuje status ukończenia zadania. Zadania, których tytuł zawiera słowo "error",
 * zawsze kończą się niepowodzeniem - do testowania rollbacku i retry.
 */
export function updateTaskStatus(
  id: string,
  completed: boolean,
  options?: { signal?: AbortSignal },
): Promise<Task> {
  return runOnNetwork(() => {
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      throw new Error(`Zadanie o id "${id}" nie istnieje`);
    }
    if (isDoomedToFail(task.title)) {
      throw new Error(`Nie udało się zaktualizować zadania: "${task.title}"`);
    }
    task.completed = completed;
    return { ...task };
  }, options);
}

/**
 * Usuwa zadanie. Zadania, których tytuł zawiera słowo "error",
 * zawsze kończą się niepowodzeniem - do testowania rollbacku po usunięciu.
 */
export function deleteTask(
  id: string,
  options?: { signal?: AbortSignal },
): Promise<void> {
  return runOnNetwork(() => {
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      return;
    }
    if (isDoomedToFail(task.title)) {
      throw new Error(`Nie udało się usunąć zadania: "${task.title}"`);
    }
    tasks = tasks.filter((t) => t.id !== id);
  }, options);
}
