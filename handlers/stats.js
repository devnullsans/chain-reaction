export async function stats(req, res) {
  const { name, picture, totals, winnings } = req.user;

  res.status(200).json({ data: { name, picture, totals, winnings } });
}
