import { TaskList } from "./components/TaskList/TaskList";
import "./index.css";

function App() {
  return (
    <div
      style={{ maxWidth: 480, margin: "4rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Lista zadań</h1>
      <TaskList />
    </div>
  );
}

export default App;
