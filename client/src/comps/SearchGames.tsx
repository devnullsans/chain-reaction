export default function SearchGames({ reset = () => undefined as void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}>
      <input type="text" />
      <button>Join</button>
      <button type="button" onClick={reset}>
        Cancel
      </button>
    </form>
  );
}
