let attemptCount = 0;

/**
 * Symuluje usunięcie konta. Opóźnienie sieciowe 400-1200ms.
 * Pierwsza próba ZAWSZE kończy się błędem (do przetestowania stanu błędu i retry
 * wewnątrz otwartego dialogu) - każda kolejna próba kończy się sukcesem.
 * Respektuje AbortSignal - po jego zadziałaniu promise zostaje odrzucony z AbortError.
 */
export function deleteAccount(options?: {
  signal?: AbortSignal;
}): Promise<void> {
  const signal = options?.signal;
  const delay = 400 + Math.random() * 800;
  const attempt = ++attemptCount;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = setTimeout(() => {
      if (attempt === 1) {
        reject(new Error("Serwer chwilowo niedostępny. Spróbuj ponownie."));
        return;
      }
      resolve();
    }, delay);

    signal?.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
