export default function UserScores({ totals = [0, 0, 0, 0], winnings = [0, 0, 0, 0] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Grid</th>
          <th>Wins</th>
          <th>Loss</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Small</td>
          <td>{winnings[0]}</td>
          <td>{totals[0] - winnings[0]}</td>
          <td>{totals[0]}</td>
        </tr>
        <tr>
          <td>Medium</td>
          <td>{winnings[1]}</td>
          <td>{totals[1] - winnings[1]}</td>
          <td>{totals[1]}</td>
        </tr>
        <tr>
          <td>Large</td>
          <td>{winnings[2]}</td>
          <td>{totals[2] - winnings[2]}</td>
          <td>{totals[2]}</td>
        </tr>
        <tr>
          <td>Huge</td>
          <td>{winnings[3]}</td>
          <td>{totals[3] - winnings[3]}</td>
          <td>{totals[3]}</td>
        </tr>
      </tbody>
    </table>
  );
}
