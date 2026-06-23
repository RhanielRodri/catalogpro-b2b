const isProd = process.env.NODE_ENV === "production";

function cookieOptions(maxAge = 7 * 24 * 60 * 60 * 1000) {
  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge
  };
}

export function login(req, res) {
  const { password } = req.body;

  if (!password || !process.env.ADMIN_SECRET) {
    return res.status(500).json({ message: "Configuração de autenticação ausente." });
  }

  if (password !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ message: "Senha incorreta." });
  }

  res.cookie("admin_session", process.env.ADMIN_SECRET, cookieOptions());
  return res.json({ ok: true });
}

export function logout(req, res) {
  res.clearCookie("admin_session", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd
  });
  return res.json({ ok: true });
}

export function checkSession(req, res) {
  const session = req.cookies?.admin_session;
  if (session && session === process.env.ADMIN_SECRET) {
    return res.json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false, message: "Não autenticado." });
}
