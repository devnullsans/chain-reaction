import { useState } from 'react';

export default function CreateGame({ reset = () => undefined as void }) {
  const [players, setPlayers] = useState('2');
  const [visible, setVisible] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // fetch api to create a new game for this user
        const ws = new WebSocket(`${process.env.REACT_APP_SOK}/api/join`);
        ws.onopen = (e) => console.log('websocker oppened', e);
        ws.onclose = (e) => console.log('websocker closed', e);
        ws.onerror = (e) => console.log('websocker error', e);
        ws.onmessage = (e) => console.log('websocker message', e);
      }}>
      <select value={players} onChange={(e) => setPlayers(e.target.value)} required>
        <option value="2">2 Player</option>
        <option value="3">3 Player</option>
        <option value="4">4 Player</option>
        <option value="5">5 Player</option>
        <option value="6">6 Player</option>
        <option value="7">7 Player</option>
        <option value="8">8 Player</option>
      </select>
      <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
      Public ? <button>Create</button>
      <button type="button" onClick={reset}>
        Cancel
      </button>
    </form>
  );
}
