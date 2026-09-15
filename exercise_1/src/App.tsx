import { UserSearch } from "./components/UserSearch/UserSearch";
import "./index.css";

function App() {
  return (
    <div
      style={{ maxWidth: 480, margin: "4rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Wyszukiwarka użytkowników</h1>
      <UserSearch onSelect={(user) => console.log("Wybrano:", user)} />
    </div>
  );
}

export default App;
