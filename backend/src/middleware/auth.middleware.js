export function requireAuth(req, res, next) {
  const session = req.cookies?.admin_session;
  if (session && session === process.env.ADMIN_SECRET) {
    return next();
  }
  return res.status(401).json({ message: "Não autorizado." });
}
