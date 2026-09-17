import { OrdersTable } from "./components/OrdersTable/OrdersTable";
import "./index.css";

function App() {
  return (
    <div
      style={{ maxWidth: 720, margin: "4rem auto", fontFamily: "sans-serif" }}
    >
      <h1>Zamówienia</h1>
      <OrdersTable />
    </div>
  );
}

export default App;
