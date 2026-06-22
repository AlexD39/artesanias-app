import { useSite } from "../context/SiteContext";

export function Footer() {
  const { settings, socialLinks } = useSite();

  const storeName = settings?.storeName || "Artesanía MX";

  return (
    <footer className="mt-20 bg-neutral-900 px-6 py-10 text-center text-sm text-white">
      <p className="font-semibold">{storeName}</p>

      <p className="mt-2 text-neutral-300">
        Piezas mexicanas hechas a mano con amor.
      </p>

      {socialLinks.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-2 text-white hover:bg-white hover:text-neutral-900"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}

      {settings?.contactEmail && (
        <p className="mt-6 text-neutral-400">{settings.contactEmail}</p>
      )}
    </footer>
  );
}