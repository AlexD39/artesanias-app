import { useEffect, useState } from "react";
import { Link } from "react-router";
import { deleteAdminCategory, getAdminCategories } from "../../services/api";

type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE";
  _count?: {
    products: number;
  };
};

export function Categories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getAdminCategories();
      setCategories(data);
    } catch {
      setError("No se pudieron cargar las categorías.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleDeactivate(category: AdminCategory) {
    const confirmDelete = confirm(
      `¿Seguro que deseas desactivar la categoría "${category.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteAdminCategory(category.id);
      await loadCategories();
    } catch {
      alert("No se pudo desactivar la categoría.");
    }
  }

  function statusBadge(status: AdminCategory["status"]) {
    const classes = {
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-red-100 text-red-700",
    };

    return (
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`}>
        {status}
      </span>
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
            Administración
          </p>
          <h1 className="mt-2 text-4xl font-black text-neutral-900">
            Categorías
          </h1>
        </div>

        <Link
          to="/admin/categorias/nueva"
          className="rounded-2xl bg-neutral-900 px-5 py-3 font-bold text-white hover:bg-yellow-700"
        >
          Nueva categoría
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
        {loading && (
          <p className="p-6 text-center text-neutral-600">
            Cargando categorías...
          </p>
        )}

        {error && (
          <p className="p-6 text-center font-semibold text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-neutral-900 text-sm uppercase tracking-wider text-white">
                <tr>
                  <th className="px-5 py-4">Nombre</th>
                  <th className="px-5 py-4">Slug</th>
                  <th className="px-5 py-4">Productos</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b last:border-b-0">
                    <td className="px-5 py-4">
                      <p className="font-bold text-neutral-900">
                        {category.name}
                      </p>
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                        {category.description || "Sin descripción"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-neutral-700">
                      {category.slug}
                    </td>

                    <td className="px-5 py-4 text-neutral-700">
                      {category._count?.products ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      {statusBadge(category.status)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/categorias/editar/${category.id}`}
                          className="rounded-xl bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800 hover:bg-yellow-200"
                        >
                          Editar
                        </Link>

                        <button
                          onClick={() => handleDeactivate(category)}
                          className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {categories.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-neutral-500"
                    >
                      No hay categorías registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}