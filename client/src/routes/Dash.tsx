import { useEffect, useState } from "react";

export default function Dash() {
  const [stats, setStats] = useState(null);
  const [finding, setFinding] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/stats`, {
      method: "GET",
      credentials: "include"
    })
      .then((res) => res.json())
      .then((json) => setStats(json.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h1>Your Dashboard</h1>
      <pre>{JSON.stringify(stats)}</pre>
      <section>
        {creating ? (
          <form onSubmit={(e) => e.preventDefault() ?? setCreating(false)}>
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
          <button onClick={() => setCreating(true) ?? setFinding(false)}>Create Game</button>
        )}
        {finding ? (
          <form onSubmit={(e) => e.preventDefault() ?? setFinding(false)}>
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
          <button onClick={() => setFinding(true) ?? setCreating(false)}>Find Game</button>
        )}
      </section>
    </>
  );
}
