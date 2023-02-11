import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  async function login(credential: CredentialResponse) {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_PROTO}${process.env.REACT_APP_API_DOMAIN}/api/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(credential)
        }
      );
      const ctype = res.headers.get("Content-Type");
      if (typeof ctype === "string" && ctype.startsWith("application/json")) {
        const { data, error } = await res.json();
        if (res.ok) {
          console.log(data);
          navigate("/dash");
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
      <h1>Chain Reaction Multiplayer</h1>
      <div>Some GIF Image To Show Off</div>
      <GoogleLogin
        useOneTap
        size="large"
        shape="pill"
        text="continue_with"
        theme="filled_blue"
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          login(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      <article>Article on how to play</article>
    </>
  );
}
