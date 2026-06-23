import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
  type StoreSettingsPayload,
} from "../../services/api";

const emptyForm: StoreSettingsPayload = {
  storeName: "",
  whatsappNumber: "",
  contactEmail: "",
  address: "",
  whatsappMessage: "",
};

export function StoreSettings() {
  const [form, setForm] = useState<StoreSettingsPayload>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const settings = await getAdminSettings();

        setForm({
          storeName: settings.storeName || "",
          whatsappNumber: settings.whatsappNumber || "",
          contactEmail: settings.contactEmail || "",
          address: settings.address || "",
          whatsappMessage: settings.whatsappMessage || "",
        });
      } catch {
        setError("No se pudo cargar la configuración.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateField<K extends keyof StoreSettingsPayload>(
    field: K,
    value: StoreSettingsPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.storeName.trim()) {
      setError("El nombre de la tienda es obligatorio.");
      return;
    }

    try {
      setSaving(true);
      await updateAdminSettings(form);
      setMessage("Configuración guardada correctamente.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la configuración."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-center text-neutral-600">Cargando configuración...</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-yellow-700">
          Administración
        </p>
        <h1 className="mt-2 text-4xl font-black text-neutral-900">
          Configuración de tienda
        </h1>
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

        {message && (
          <div className="rounded-2xl bg-green-50 p-4 text-sm font-semibold text-green-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-neutral-700">
              Nombre de tienda
            </label>
            <input
              value={form.storeName}
              onChange={(event) => updateField("storeName", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="Artesanía MX"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">
              WhatsApp
            </label>
            <input
              value={form.whatsappNumber}
              onChange={(event) =>
                updateField("whatsappNumber", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="5212361170217"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Usa formato internacional, sin espacios. Ejemplo: 5212361170217
            </p>
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">
              Correo de contacto
            </label>
            <input
              value={form.contactEmail}
              onChange={(event) =>
                updateField("contactEmail", event.target.value)
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="ventas@artesanias.com"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">
              Dirección
            </label>
            <input
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="México"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-700">
            Mensaje base de WhatsApp
          </label>
          <textarea
            value={form.whatsappMessage}
            onChange={(event) =>
              updateField("whatsappMessage", event.target.value)
            }
            className="mt-2 min-h-32 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            placeholder="Hola, vengo de la tienda web..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-2xl bg-neutral-900 px-5 py-3 font-bold text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Guardando..." : "Guardar configuración"}
          </button>
        </div>
      </form>
    </section>
  );
}