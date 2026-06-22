import { Link, NavLink } from "react-router";
import { useSite } from "../context/SiteContext";

export function Navbar() {
  const { settings } = useSite();
  const storeName = settings?.storeName || "Artesanía MX";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-yellow-700 font-semibold"
      : "text-neutral-700 hover:text-yellow-700";

  return (
    <header className="bg-[#f3c13a] shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold tracking-wide text-neutral-900">
          {storeName}
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