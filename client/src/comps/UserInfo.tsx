export default function UserInfo({ name = "", picture = "" }) {
  return (
    <figure>
      <img src={picture} alt="Avatar" />
      <figcaption>{name}</figcaption>
    </figure>
  );
}
