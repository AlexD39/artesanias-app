import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { getCategories, getProducts } from "../services/api";
import type { Category, Product } from "../types/product";

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "todos") return products;

    return products.filter(
      (product) => product.category.slug === selectedCategory
    );
  }, [products, selectedCategory]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
          Catálogo
        </p>
        <h1 className="mt-3 text-4xl font-black text-neutral-900">
          Nuestra tienda
        </h1>
        <p className="mt-3 text-neutral-600">
          Explora productos artesanales disponibles.
        </p>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategory("todos")}
          className={`rounded-full px-5 py-2 text-sm font-semibold ${
            selectedCategory === "todos"
              ? "bg-neutral-900 text-white"
              : "bg-white text-neutral-700 hover:bg-yellow-50"
          }`}
        >
          Todos
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.slug)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              selectedCategory === category.slug
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-700 hover:bg-yellow-50"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-center text-neutral-600">Cargando productos...</p>
      )}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="text-center text-neutral-600">
          No hay productos disponibles.
        </p>
      )}

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}