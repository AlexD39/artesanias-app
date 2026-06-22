import { buildWhatsAppUrl } from "../services/whatsapp";

export function Contact() {
  const whatsappUrl = buildWhatsAppUrl(
    "Hola, vengo de la tienda web. Quisiera más información sobre sus productos."
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
          Escríbenos por WhatsApp para consultar disponibilidad o pedidos especiales.
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
    </main>
  );
}