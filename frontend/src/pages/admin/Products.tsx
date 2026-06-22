import { Link } from "react-router";
import { useEffect, useState } from "react";
import { deleteAdminProduct, getAdminProducts } from "../../services/api";
import type { Product } from "../../types/product";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      setError("No se pudieron cargar los productos admin.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function statusBadge(status: Product["status"]) {
    const classes = {
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-red-100 text-red-700",
      OUT_OF_STOCK: "bg-yellow-100 text-yellow-700",
    };

    async function handleDeactivate(product: Product) {
  const confirmDelete = confirm(
    `¿Seguro que deseas desactivar el producto "${product.name}"?`
  );

  if (!confirmDelete) return;

  try {
    await deleteAdminProduct(product.id);
    await loadProducts();
  } catch {
    alert("No se pudo desactivar el producto.");
  }
}


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
            Productos
          </h1>
        </div>

        <Link to="/admin/productos/nuevo" className="rounded-2xl bg-neutral-900 px-5 py-3 font-bold text-white hover:bg-yellow-700" >
            Nuevo producto
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
        {loading && (
          <p className="p-6 text-center text-neutral-600">Cargando productos...</p>
        )}

        {error && (
          <p className="p-6 text-center font-semibold text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="bg-neutral-900 text-sm uppercase tracking-wider text-white">
                <tr>
                  <th className="px-5 py-4">Imagen</th>
                  <th className="px-5 py-4">Producto</th>
                  <th className="px-5 py-4">Categoría</th>
                  <th className="px-5 py-4">Precio</th>
                  <th className="px-5 py-4">Stock</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b last:border-b-0">
                    <td className="px-5 py-4">
                      <img
                        src={
                          product.mainImage ||
                          "https://placehold.co/120x90?text=Producto"
                        }
                        alt={product.name}
                        className="h-16 w-20 rounded-xl object-cover"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-neutral-900">{product.name}</p>
                      <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                        {product.shortDescription}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-neutral-700">
                      {product.category.name}
                    </td>

                    <td className="px-5 py-4 font-bold text-neutral-900">
                      ${product.price.toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-neutral-700">
                      {product.stock}
                    </td>

                    <td className="px-5 py-4">{statusBadge(product.status)}</td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link
  to={`/admin/productos/editar/${product.id}`}
  className="rounded-xl bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800 hover:bg-yellow-200"
>
  Editar
</Link>

<button
  onClick={() => handleDeactivate(product)}
  className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
>
  Desactivar
</button>

                      </div>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-neutral-500">
                      No hay productos registrados.
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