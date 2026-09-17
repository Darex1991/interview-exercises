import { useEffect, useState } from "react";
import { fetchTasks, type Task } from "../../api/mockTasks";

type Status = "loading" | "error" | "success";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    fetchTasks()
      .then((result) => {
        setTasks(result);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  // TODO: dodawanie zadań (createTask) - optymistycznie, z tymczasowym id i jego
  // późniejszym pogodzeniem z id nadanym przez serwer.
  // TODO: przełączanie completed (updateTaskStatus) - optymistycznie, z rollbackiem
  // przy błędzie i poprawnym rozwiązaniem race condition przy szybkich kliknięciach.
  // TODO: usuwanie zadania z opóźnionym commitem i możliwością "Cofnij" (Undo).
  // TODO: a11y - aria-live dla komunikatów, etykiety, sensowne zarządzanie fokusem.

  if (status === "loading") {
    return <p>Ładowanie…</p>;
  }

  if (status === "error") {
    return <p>Nie udało się pobrać zadań.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <label>
            <input type="checkbox" checked={task.completed} readOnly />
            {task.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
