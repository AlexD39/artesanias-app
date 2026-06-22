import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  createAdminSocialLink,
  getAdminSocialLinks,
  updateAdminSocialLink,
  type SocialLinkPayload,
} from "../../services/api";
import type { SocialLink } from "../../types/settings";

const emptyForm: SocialLinkPayload = {
  name: "",
  url: "",
  icon: "",
  status: "ACTIVE",
  order: 0,
};

export function SocialLinkForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<SocialLinkPayload>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSocialLink() {
      if (!isEdit) return;

      try {
        const socialLinks = await getAdminSocialLinks();
        const socialLink = socialLinks.find(
          (item: SocialLink) => item.id === Number(id)
        );

        if (!socialLink) {
          setError("Red social no encontrada.");
          return;
        }

        setForm({
          name: socialLink.name,
          url: socialLink.url,
          icon: socialLink.icon || "",
          status: socialLink.status,
          order: socialLink.order,
        });
      } catch {
        setError("No se pudo cargar la red social.");
      } finally {
        setLoading(false);
      }
    }

    loadSocialLink();
  }, [id, isEdit]);

  function updateField<K extends keyof SocialLinkPayload>(
    field: K,
    value: SocialLinkPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!form.url.trim()) {
      setError("La URL es obligatoria.");
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await updateAdminSocialLink(Number(id), form);
      } else {
        await createAdminSocialLink(form);
      }

      navigate("/admin/redes");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la red social."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-center text-neutral-600">Cargando formulario...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
            Redes sociales
          </p>
          <h1 className="mt-2 text-4xl font-black text-neutral-900">
            {isEdit ? "Editar red social" : "Nueva red social"}
          </h1>
        </div>

        <Link
          to="/admin/redes"
          className="rounded-2xl border border-neutral-300 px-5 py-3 font-bold text-neutral-700 hover:bg-white"
        >
          Volver
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-3xl bg-white p-8 shadow-sm"
      >
        {error && (
          <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-neutral-700">
              Nombre
            </label>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="Instagram"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">Icono</label>
            <select
              value={form.icon}
              onChange={(event) => updateField("icon", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            >
              <option value="">Sin icono</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="x">X / Twitter</option>
              <option value="youtube">YouTube</option>
              <option value="pinterest">Pinterest</option>
              <option value="web">Sitio web</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">URL</label>
            <input
              value={form.url}
              onChange={(event) => updateField("url", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="https://instagram.com/tu_tienda"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">Orden</label>
            <input
              type="number"
              value={form.order}
              onChange={(event) =>
                updateField("order", Number(event.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="1"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">Estado</label>
            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as SocialLinkPayload["status"]
                )
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/admin/redes"
            className="rounded-2xl border border-neutral-300 px-5 py-3 font-bold text-neutral-700 hover:bg-neutral-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-neutral-900 px-5 py-3 font-bold text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving
              ? "Guardando..."
              : isEdit
              ? "Actualizar red social"
              : "Crear red social"}
          </button>
        </div>
      </form>
    </section>
  );
}