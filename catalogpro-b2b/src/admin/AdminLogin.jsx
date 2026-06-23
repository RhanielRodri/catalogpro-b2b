import { useState } from "react";
import { loginAdmin } from "../services/api";

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await loginAdmin(password);
      onLogin();
    } catch (err) {
      setError(err.message || "Senha incorreta. Verifique e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <span className="admin-brandMark">C</span>
          <div>
            <strong>CatalogPro B2B</strong>
            <small>Painel comercial</small>
          </div>
        </div>

        <p className="admin-login-desc">
          Acesso demonstrativo para avaliação do sistema.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            Senha de acesso
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite a senha"
              autoComplete="current-password"
              autoFocus
              required
            />
          </label>

          {error && (
            <p className="admin-login-error" role="alert">{error}</p>
          )}

          <button
            className="admin-primaryButton"
            type="submit"
            disabled={isLoading || !password}
          >
            {isLoading ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>

        <p className="admin-login-hint">
          Senha demo: <code>catalogpro-demo</code>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
