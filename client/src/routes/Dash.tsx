import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dash() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [finding, setFinding] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        const res = await fetch(`${process.env.REACT_APP_API}/api/stats`, {
          method: "GET",
          credentials: "include"
        });
        const ctype = res.headers.get("Content-Type");
        if (typeof ctype === "string" && ctype.startsWith("application/json")) {
          const { data, error } = await res.json();
          if (res.ok) {
            console.log(data);
            setStats(data);
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
        navigate("/");
      }
    })();
  }, [navigate]);

  async function logout() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/api/logout`, {
        method: "GET",
        credentials: "include"
      });
      const ctype = res.headers.get("Content-Type");
      if (typeof ctype === "string" && ctype.startsWith("application/json")) {
        const { data, error } = await res.json();
        if (res.ok) {
          console.log(data);
          navigate("/");
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
  }

  return (
    <>
      <h1>Your Dashboard</h1>
      <button onClick={() => logout()}>Logout</button>
      <pre>{JSON.stringify(stats)}</pre>
      <section>
        {creating ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCreating(false);
            }}>
            <select>
              <option value={2}>2 Player</option>
              <option value={3}>3 Player</option>
              <option value={4}>4 Player</option>
              <option value={5}>5 Player</option>
              <option value={6}>6 Player</option>
              <option value={7}>7 Player</option>
              <option value={8}>8 Player</option>
            </select>
            <input type="checkbox" /> Private ? <button>Create</button>
          </form>
        ) : (
          <button
            onClick={() => {
              setCreating(true);
              setFinding(false);
            }}>
            Create Game
          </button>
        )}
        {finding ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFinding(false);
            }}>
            <ul>
              <li>2 Player</li>
              <li>3 Player</li>
              <li>4 Player</li>
              <li>5 Player</li>
              <li>6 Player</li>
              <li>7 Player</li>
              <li>8 Player</li>
            </ul>
            <input type="text" />
            <button>Join</button>
          </form>
        ) : (
          <button
            onClick={() => {
              setFinding(true);
              setCreating(false);
            }}>
            Find Game
          </button>
        )}
      </section>
    </>
  );
}
