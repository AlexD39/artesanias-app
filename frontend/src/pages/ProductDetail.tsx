import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getProductBySlug } from "../services/api";
import type { Product } from "../types/product";
import { useSite } from "../context/SiteContext";
import { buildProductMessage, buildWhatsAppUrl } from "../services/whatsapp";

export function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;

      try {
        const data = await getProductBySlug(slug);
        setProduct(data);
      } catch (err) {
        setError("Producto no encontrado.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-center text-neutral-600">Cargando producto...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/tienda" className="mt-4 inline-block text-yellow-700">
          Volver a tienda
        </Link>
      </main>
    );
  }

  const { settings } = useSite();

  const storeName = settings?.storeName || "Artesanía MX";

const whatsappUrl = buildWhatsAppUrl(
  buildProductMessage(
    storeName,
    product.name,
    product.price,
    settings?.whatsappMessage
  ),
  settings?.whatsappNumber
);

  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-2">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <img
          src={product.mainImage || "https://placehold.co/900x700?text=Producto"}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
          {product.category.name}
        </p>

        <h1 className="mt-4 text-4xl font-black text-neutral-900">
          {product.name}
        </h1>

        <p className="mt-4 text-3xl font-bold text-neutral-900">
          ${product.price.toFixed(2)}
        </p>

        <p className="mt-6 text-lg text-neutral-700">
          {product.longDescription || product.shortDescription}
        </p>

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
          <p className="font-semibold text-neutral-900">Disponibilidad</p>
          <p className="mt-1 text-neutral-600">
            {product.stock > 0
              ? `${product.stock} piezas disponibles`
              : "Producto agotado"}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-yellow-700"
          >
            Pedir por WhatsApp
          </a>

          <Link
            to="/tienda"
            className="rounded-full border border-neutral-900 px-6 py-3 font-semibold text-neutral-900 hover:bg-white"
          >
            Volver
          </Link>
        </div>
      </section>
    </main>
  );
}