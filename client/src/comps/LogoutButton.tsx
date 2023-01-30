import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = useCallback(async () => {
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
  }, [navigate]);

  return <button onClick={logout}>Logout</button>;
}
