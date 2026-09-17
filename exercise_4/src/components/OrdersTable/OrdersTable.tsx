import { useEffect, useState } from "react";
import { fetchOrders, type Order } from "../../api/mockOrders";

type Status = "loading" | "error" | "success";

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    fetchOrders({ sortBy: "date", sortDir: "desc", limit: 30 })
      .then((result) => {
        setOrders(result.items);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, []);

  // TODO: wyszukiwanie (debounce) po nazwie klienta, resetujące paginację.
  // TODO: sortowanie po dacie / kwocie klikane w nagłówkach (aria-sort), resetujące paginację.
  // TODO: doczytywanie kolejnych stron przy scrollu do końca kontenera (infinite scroll).
  // TODO: wirtualizacja wierszy - renderuj tylko wiersze widoczne w/koło viewportu,
  // zachowując realną wysokość scrolla (spacer), bez biblioteki do wirtualizacji.
  // TODO: bezpieczne odrzucanie nieaktualnych odpowiedzi przy szybkiej zmianie
  // wyszukiwania/sortowania (odpowiedzi ze starego zapytania nie mogą nadpisać nowych).

  if (status === "loading") {
    return <p>Ładowanie…</p>;
  }

  if (status === "error") {
    return <p>Nie udało się pobrać zamówień.</p>;
  }

  return (
    <div style={{ height: 480, overflow: "auto", border: "1px solid #ccc" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Klient</th>
            <th>Kwota</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.customer}</td>
              <td>{order.amount.toFixed(2)} zł</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
