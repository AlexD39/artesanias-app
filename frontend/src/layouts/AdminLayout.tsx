import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { clearSession, getStoredUser } from "../services/api";

export function AdminLayout() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "rounded-xl bg-neutral-900 px-4 py-2 text-white"
      : "rounded-xl px-4 py-2 text-neutral-700 hover:bg-yellow-100";

  function handleLogout() {
    clearSession();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#fffaf0]">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/admin" className="text-xl font-black text-neutral-900">
            Admin Artesanía MX
          </Link>

          <div className="flex items-center gap-3">
            <NavLink to="/admin" end className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/productos" className={linkClass}>
              Productos
            </NavLink>

            <NavLink to="/admin/categorias" className={linkClass}>
              Categorías
            </NavLink>

            <Link
              to="/tienda"
              className="rounded-xl px-4 py-2 text-neutral-700 hover:bg-yellow-100"
            >
              Ver tienda
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
            >
              Salir
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-neutral-500">Sesión activa</p>
          <p className="font-semibold text-neutral-900">
            {user?.name || "Administrador"}
          </p>
        </div>

        <Outlet />
      </main>
    </div>
  );
}