export default function SearchGames({ reset = () => undefined as void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
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
      <button type="button" onClick={reset}>
        Cancel
      </button>
    </form>
  );
}
