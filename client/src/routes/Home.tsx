import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  async function login(credential) {
    try {
      const res = await fetch(`${process.env.REACT_APP_API}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential)
      });
      if (res.ok) navigate("/dash");
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
