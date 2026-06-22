import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  deleteAdminSocialLink,
  getAdminSocialLinks,
} from "../../services/api";
import type { SocialLink } from "../../types/settings";

export function SocialLinks() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSocialLinks() {
    try {
      setLoading(true);
      const data = await getAdminSocialLinks();
      setSocialLinks(data);
    } catch {
      setError("No se pudieron cargar las redes sociales.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSocialLinks();
  }, []);

  async function handleDeactivate(socialLink: SocialLink) {
    const confirmDelete = confirm(
      `¿Seguro que deseas desactivar "${socialLink.name}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteAdminSocialLink(socialLink.id);
      await loadSocialLinks();
    } catch {
      alert("No se pudo desactivar la red social.");
    }
  }

  function statusBadge(status: SocialLink["status"]) {
    const classes = {
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${classes[status]}`}
      >
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
            Redes sociales
          </h1>
        </div>

        <Link
          to="/admin/redes/nueva"
          className="rounded-2xl bg-neutral-900 px-5 py-3 font-bold text-white hover:bg-yellow-700"
        >
          Nueva red social
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
        {loading && (
          <p className="p-6 text-center text-neutral-600">
            Cargando redes sociales...
          </p>
        )}

        {error && (
          <p className="p-6 text-center font-semibold text-red-600">{error}</p>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-neutral-900 text-sm uppercase tracking-wider text-white">
                <tr>
                  <th className="px-5 py-4">Nombre</th>
                  <th className="px-5 py-4">URL</th>
                  <th className="px-5 py-4">Icono</th>
                  <th className="px-5 py-4">Orden</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {socialLinks.map((socialLink) => (
                  <tr key={socialLink.id} className="border-b last:border-b-0">
                    <td className="px-5 py-4 font-bold text-neutral-900">
                      {socialLink.name}
                    </td>

                    <td className="px-5 py-4">
                      <a
                        href={socialLink.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-semibold text-yellow-700 hover:underline"
                      >
                        {socialLink.url}
                      </a>
                    </td>

                    <td className="px-5 py-4 text-neutral-700">
                      {socialLink.icon || "-"}
                    </td>

                    <td className="px-5 py-4 text-neutral-700">
                      {socialLink.order}
                    </td>

                    <td className="px-5 py-4">
                      {statusBadge(socialLink.status)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/redes/editar/${socialLink.id}`}
                          className="rounded-xl bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800 hover:bg-yellow-200"
                        >
                          Editar
                        </Link>

                        <button
                          onClick={() => handleDeactivate(socialLink)}
                          className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                        >
                          Desactivar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {socialLinks.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-8 text-center text-neutral-500"
                    >
                      No hay redes sociales registradas.
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