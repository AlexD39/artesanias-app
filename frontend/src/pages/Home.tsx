import { Link } from "react-router";

export function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
            Hecho a mano
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight text-neutral-900 md:text-6xl">
            Artesanía mexicana hecha con amor
          </h1>

          <p className="mt-6 max-w-xl text-lg text-neutral-700">
            Descubre piezas únicas elaboradas por manos artesanas. Productos con
            historia, color y tradición para tu hogar.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/tienda"
              className="rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-yellow-700"
            >
              Ver tienda
            </Link>

            <Link
              to="/contacto"
              className="rounded-full border border-neutral-900 px-6 py-3 font-semibold text-neutral-900 hover:bg-white"
            >
              Contacto
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] shadow-xl">
          <img
            src="https://placehold.co/900x700/f3c13a/222222?text=Artesania+Mexicana"
            alt="Artesanía mexicana"
            className="h-full w-full object-cover"
          />
        </div>
      </section>
    </main>
  );
}