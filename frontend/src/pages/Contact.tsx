import { useSite } from "../context/SiteContext";
import { buildWhatsAppUrl } from "../services/whatsapp";

export function Contact() {
  const { settings, socialLinks } = useSite();

  const storeName = settings?.storeName || "Artesanía MX";
  const whatsappMessage =
    settings?.whatsappMessage ||
    "Hola, vengo de la tienda web. Quisiera más información sobre sus productos.";

  const whatsappUrl = buildWhatsAppUrl(
    whatsappMessage,
    settings?.whatsappNumber
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
        Contacto
      </p>

      <h1 className="mt-3 text-4xl font-black text-neutral-900">
        ¿Te interesa una pieza?
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-700">
        Escríbenos para consultar disponibilidad, colores, tamaños o pedidos
        especiales.
      </p>

      <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-lg font-bold text-neutral-900">WhatsApp</p>

        <p className="mt-2 text-neutral-600">
          Escríbenos por WhatsApp para consultar disponibilidad o pedidos
          especiales.
        </p>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white hover:bg-yellow-700"
        >
          Enviar mensaje
        </a>
      </div>

      <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-lg font-bold text-neutral-900">{storeName}</p>

        {settings?.contactEmail && (
          <p className="mt-2 text-neutral-600">{settings.contactEmail}</p>
        )}

        {settings?.address && (
          <p className="mt-2 text-neutral-600">{settings.address}</p>
        )}
      </div>

      {socialLinks.length > 0 && (
        <div className="mt-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-lg font-bold text-neutral-900">Redes sociales</p>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-yellow-600 px-5 py-2 font-semibold text-yellow-700 hover:bg-yellow-50"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}