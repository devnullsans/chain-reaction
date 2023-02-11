import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Game() {
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    console.log(state);
    if (typeof state !== "string") navigate("/dash");
    const ws = new WebSocket(
      `${process.env.REACT_APP_WS_PROTO}${process.env.REACT_APP_API_DOMAIN}/api/join?g=${state}`
    );
    ws.onopen = (e) => console.log("websocker oppened", e);
    ws.onclose = (e) => console.log("websocker closed", e);
    ws.onerror = (e) => console.log("websocker error", e);
    ws.onmessage = (e) => console.log("websocker message", e);
    return () => {
      if (ws.readyState !== ws.CLOSED) ws.close();
    };
  }, [navigate, state]);

  return <div>Game</div>;
}
