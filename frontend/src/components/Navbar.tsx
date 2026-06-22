import { Link, NavLink } from "react-router";

export function Navbar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-yellow-700 font-semibold"
      : "text-neutral-700 hover:text-yellow-700";

  return (
    <header className="bg-[#f3c13a] shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-wide text-neutral-900">
          Artesanía MX
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium uppercase tracking-widest">
          <NavLink to="/" className={linkClass}>
            Inicio
          </NavLink>
          <NavLink to="/tienda" className={linkClass}>
            Tienda
          </NavLink>
          <NavLink to="/contacto" className={linkClass}>
            Contacto
          </NavLink>
        </div>
      </nav>
    </header>
  );
}