export async function logout(_, res) {
  res.clearCookie("auth", {
    secure: true,
    httpOnly: true,
    sameSite: true
  });

  res.status(200).json({ data: "Farewell" });
}
