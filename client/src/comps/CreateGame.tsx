import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateGame({ reset = () => undefined as void }) {
  const navigate = useNavigate();

  const [players, setPlayers] = useState("2");
  const [visible, setVisible] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_PROTO}${process.env.REACT_APP_API_DOMAIN}/api/create`,
            {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json; charset=utf-8" },
              body: JSON.stringify({ players, visible })
            }
          );
          const ctype = res.headers.get("Content-Type");
          if (typeof ctype === "string" && ctype.startsWith("application/json")) {
            const { data, error } = await res.json();
            if (res.ok) {
              console.log(data);
              navigate("/game", { state: data });
            } else {
              console.warn(res.status, res.statusText);
              throw new Error(error);
            }
          } else {
            console.warn(res.status, res.statusText, ctype);
            throw new Error("Invalid content received");
          }
        } catch (error) {
          console.error(error);
        }
      }}>
      <select value={players} onChange={(e) => setPlayers(e.target.value)} required>
        <option value="2">2 Player</option>
        <option value="3">3 Player</option>
        <option value="4">4 Player</option>
        <option value="5">5 Player</option>
        <option value="6">6 Player</option>
        <option value="7">7 Player</option>
        <option value="8">8 Player</option>
      </select>
      <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
      Public ? <button>Create</button>
      <button type="button" onClick={reset}>
        Cancel
      </button>
    </form>
  );
}
