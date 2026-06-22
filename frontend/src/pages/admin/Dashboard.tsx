import { useEffect, useState } from "react";
import { getAdminProducts } from "../../services/api";
import type { Product } from "../../types/product";

export function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAdminProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  const activeProducts = products.filter((product) => product.status === "ACTIVE");
  const inactiveProducts = products.filter(
    (product) => product.status === "INACTIVE"
  );
  const outOfStockProducts = products.filter(
    (product) => product.status === "OUT_OF_STOCK" || product.stock <= 0
  );

  return (
    <section>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
          Resumen
        </p>
        <h1 className="mt-2 text-4xl font-black text-neutral-900">
          Dashboard
        </h1>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Total productos</p>
          <p className="mt-2 text-4xl font-black text-neutral-900">
            {products.length}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Activos</p>
          <p className="mt-2 text-4xl font-black text-green-700">
            {activeProducts.length}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Inactivos</p>
          <p className="mt-2 text-4xl font-black text-red-700">
            {inactiveProducts.length}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm text-neutral-500">Agotados</p>
          <p className="mt-2 text-4xl font-black text-yellow-700">
            {outOfStockProducts.length}
          </p>
        </div>
      </div>
    </section>
  );
}