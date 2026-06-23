import { useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { getStoredToken, loginAdmin, saveSession } from "../../services/api";

export function Login() {
  const navigate = useNavigate();
  const token = getStoredToken();

  const [email, setEmail] = useState("admin@artesanias.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(email, password);
      saveSession(data.token, data.user);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffaf0] px-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
            Panel admin
          </p>

          <h1 className="mt-3 text-3xl font-black text-neutral-900">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Entra para administrar productos y categorías.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-neutral-700">
              Email
            </label>
            <input
              type="email"
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@artesanias.com"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-neutral-700">
              Contraseña
            </label>
            <input
              type="password"
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="admin123"
            />
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-neutral-900 px-5 py-3 font-bold text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}