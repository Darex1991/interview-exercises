import { DeleteAccountDialog } from "./components/DeleteAccountDialog/DeleteAccountDialog";
import "./index.css";

function App() {
  return (
    <div
      style={{ maxWidth: 480, margin: "4rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Ustawienia konta</h1>
      <p>Tu normalnie byłyby ustawienia profilu, powiadomień itd.</p>
      <DeleteAccountDialog />
    </div>
  );
}

export default App;
