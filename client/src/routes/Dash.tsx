import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserStats } from "../types";
import LogoutButton from "../comps/LogoutButton";
import UserInfo from "../comps/UserInfo";
import UserScores from "../comps/UserScores";
import CreateGame from "../comps/CreateGame";
import SearchGames from "../comps/SearchGames";

export default function Dash() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [option, setOption] = useState<boolean | null>(null);

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

  return Boolean(stats) ? (
    <>
      <h1>Your Dashboard</h1>
      <LogoutButton />
      <UserInfo name={stats?.name} picture={stats?.picture} />
      <UserScores totals={stats?.totals} winnings={stats?.winnings} />
      {option === null ? (
        <div>
          <button onClick={() => setOption(true)}>Create Game</button>
          <button onClick={() => setOption(false)}>Search Games</button>
        </div>
      ) : option ? (
        <CreateGame reset={() => setOption(null)} />
      ) : (
        <SearchGames reset={() => setOption(null)} />
      )}
    </>
  ) : (
    <>Loading ...</>
  );
}
