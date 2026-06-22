import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  createAdminCategory,
  getAdminCategories,
  updateAdminCategory,
  type AdminCategoryPayload,
} from "../../services/api";

type AdminCategory = {
  id: number;
  name: string;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE";
};

const emptyForm: AdminCategoryPayload = {
  name: "",
  description: "",
  status: "ACTIVE",
};

export function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<AdminCategoryPayload>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategory() {
      if (!isEdit) return;

      try {
        const categories = await getAdminCategories();
        const category = categories.find(
          (item: AdminCategory) => item.id === Number(id)
        );

        if (!category) {
          setError("Categoría no encontrada.");
          return;
        }

        setForm({
          name: category.name,
          description: category.description || "",
          status: category.status,
        });
      } catch {
        setError("No se pudo cargar la categoría.");
      } finally {
        setLoading(false);
      }
    }

    loadCategory();
  }, [id, isEdit]);

  function updateField<K extends keyof AdminCategoryPayload>(
    field: K,
    value: AdminCategoryPayload[K]
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

    try {
      setSaving(true);

      if (isEdit) {
        await updateAdminCategory(Number(id), form);
      } else {
        await createAdminCategory(form);
      }

      navigate("/admin/categorias");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar la categoría."
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
            Categorías
          </p>
          <h1 className="mt-2 text-4xl font-black text-neutral-900">
            {isEdit ? "Editar categoría" : "Nueva categoría"}
          </h1>
        </div>

        <Link
          to="/admin/categorias"
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

        <div>
          <label className="text-sm font-bold text-neutral-700">
            Nombre de categoría
          </label>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            placeholder="Ej. Bolsas"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-700">
            Descripción
          </label>
          <textarea
            value={form.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            className="mt-2 min-h-28 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            placeholder="Descripción breve de la categoría"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-700">Estado</label>
          <select
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target.value as AdminCategoryPayload["status"]
              )
            }
            className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to="/admin/categorias"
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
              ? "Actualizar categoría"
              : "Crear categoría"}
          </button>
        </div>
      </form>
    </section>
  );
}