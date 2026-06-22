import { Link } from "react-router";
import type { Product } from "../types/product";
import { useSite } from "../context/SiteContext";
import { buildProductMessage, buildWhatsAppUrl } from "../services/whatsapp";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
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
    <article className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/producto/${product.slug}`}>
        <img
          src={product.mainImage || "https://placehold.co/800x600?text=Producto"}
          alt={product.name}
          className="h-64 w-full object-cover"
        />
      </Link>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-yellow-700">
          {product.category.name}
        </p>

        <h3 className="mt-2 text-xl font-bold text-neutral-900">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-lg font-bold text-neutral-900">
            ${product.price.toFixed(2)}
          </span>

          <Link
            to={`/producto/${product.slug}`}
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
          >
            Ver detalle
          </Link>
        </div>
        <a
  href={whatsappUrl}
  target="_blank"
  rel="noreferrer"
  className="mt-4 block rounded-full border border-yellow-600 px-4 py-2 text-center text-sm font-semibold text-yellow-700 hover:bg-yellow-50"
>
  Pedir por WhatsApp
</a>
      </div>
    </article>
  );
}