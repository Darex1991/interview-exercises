import { useState } from "react";

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);

  // TODO: wywołać deleteAccount() z ../../api/mockAccount, obsłużyć stan ładowania
  // i błędu wewnątrz dialogu, zablokować przyciski na czas requestu i pokazać toast
  // po sukcesie. Obecnie przycisk "Usuń" tylko zamyka dialog, bez integracji z API.
  function handleConfirm() {
    setOpen(false);
  }

  // TODO: portal do document.body, focus trap, przywracanie fokusu po zamknięciu,
  // zamykanie Escape / kliknięciem w tło (poza trwającym requestem), aria-hidden/inert
  // dla reszty strony, właściwe role/aria-* na kontenerze dialogu.
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Usuń konto
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              color: "black",
              padding: "1.5rem",
              minWidth: 320,
              borderRadius: 8,
            }}
          >
            <h2>Usunąć konto?</h2>
            <p>Tej operacji nie można cofnąć.</p>
            <button type="button" onClick={() => setOpen(false)}>
              Anuluj
            </button>
            <button type="button" onClick={handleConfirm}>
              Usuń
            </button>
          </div>
        </div>
      )}

      {/* TODO: powiadomienie typu toast po udanym usunięciu konta */}
    </div>
  );
}
