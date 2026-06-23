import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  createAdminProduct,
  getAdminProducts,
  getCategories,
  updateAdminProduct,
  uploadAdminProductImage,
  type AdminProductPayload,
} from "../../services/api";
import type { Category, Product } from "../../types/product";

const emptyForm: AdminProductPayload = {
  name: "",
  shortDescription: "",
  longDescription: "",
  price: 0,
  stock: 0,
  categoryId: 0,
  mainImage: "",
  status: "ACTIVE",
  featured: false,
};


export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState<AdminProductPayload>(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

async function handleImageFileChange(file?: File) {
    if (!file) return;

    setError("");

    try {
      setUploadingImage(true);

      const imageUrl = await uploadAdminProductImage(file);

      setForm((prev) => ({
        ...prev,
        mainImage: imageUrl,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo subir la imagen"
      );
    } finally {
      setUploadingImage(false);
    }
  }

  useEffect(() => {
    async function loadBaseData() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        if (!isEdit) {
          if (categoriesData[0]) {
            setForm((prev) => ({
              ...prev,
              categoryId: categoriesData[0].id,
            }));
          }

          return;
        }

        const products = await getAdminProducts();
        const product = products.find((item: Product) => item.id === Number(id));

        if (!product) {
          setError("Producto no encontrado.");
          return;
        }

        setForm({
          name: product.name,
          shortDescription: product.shortDescription,
          longDescription: product.longDescription || "",
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
          mainImage: product.mainImage || "",
          status: product.status,
          featured: product.featured,
        });
      } catch {
        setError("No se pudo cargar la información.");
      } finally {
        setLoading(false);
      }
    }

    loadBaseData();
  }, [id, isEdit]);

  function updateField<K extends keyof AdminProductPayload>(
    field: K,
    value: AdminProductPayload[K]
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

    if (!form.shortDescription.trim()) {
      setError("La descripción corta es obligatoria.");
      return;
    }

    if (!form.categoryId) {
      setError("Selecciona una categoría.");
      return;
    }

    if (form.price <= 0) {
      setError("El precio debe ser mayor a 0.");
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await updateAdminProduct(Number(id), form);
      } else {
        await createAdminProduct(form);
      }

      navigate("/admin/productos");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo guardar el producto."
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
            Productos
          </p>
          <h1 className="mt-2 text-4xl font-black text-neutral-900">
            {isEdit ? "Editar producto" : "Nuevo producto"}
          </h1>
        </div>

        <Link
          to="/admin/productos"
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
              Nombre del producto
            </label>
            <input
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="Ej. Cojín artesanal rojo"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">
              Categoría
            </label>
            <select
              value={form.categoryId}
              onChange={(event) =>
                updateField("categoryId", Number(event.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            >
              <option value={0}>Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">Precio</label>
            <input
              type="number"
              value={form.price}
              onChange={(event) =>
                updateField("price", Number(event.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="490"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(event) =>
                updateField("stock", Number(event.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
              placeholder="6"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-neutral-700">Estado</label>
            <select
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as AdminProductPayload["status"]
                )
              }
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="OUT_OF_STOCK">Agotado</option>
            </select>
          </div>

          <div>
  <label className="text-sm font-bold text-neutral-700">
    Imagen principal URL
  </label>

  <input
    value={form.mainImage}
    onChange={(event) => updateField("mainImage", event.target.value)}
    className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
    placeholder="https://..."
  />

  <label className="mt-4 block text-sm font-bold text-neutral-700">
    Subir imagen
  </label>

  <input
    type="file"
    accept="image/jpeg,image/png,image/webp"
    onChange={(event) => handleImageFileChange(event.target.files?.[0])}
    className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-yellow-600"
  />

  {uploadingImage && (
    <p className="mt-2 text-sm font-semibold text-yellow-700">
      Subiendo imagen...
    </p>
  )}
</div>

        </div>

        <div>
          <label className="text-sm font-bold text-neutral-700">
            Descripción corta
          </label>
          <textarea
            value={form.shortDescription}
            onChange={(event) =>
              updateField("shortDescription", event.target.value)
            }
            className="mt-2 min-h-24 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            placeholder="Descripción breve para la tarjeta del producto"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-neutral-700">
            Descripción larga
          </label>
          <textarea
            value={form.longDescription}
            onChange={(event) =>
              updateField("longDescription", event.target.value)
            }
            className="mt-2 min-h-32 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-yellow-600"
            placeholder="Descripción completa para el detalle del producto"
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-4 font-semibold text-neutral-800">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => updateField("featured", event.target.checked)}
            className="h-5 w-5"
          />
          Producto destacado
        </label>

        {form.mainImage && (
          <div>
            <p className="mb-2 text-sm font-bold text-neutral-700">
              Vista previa
            </p>
            <img
              src={form.mainImage}
              alt="Vista previa"
              className="h-56 w-full max-w-md rounded-3xl object-cover"
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            to="/admin/productos"
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
              ? "Actualizar producto"
              : "Crear producto"}
          </button>
        </div>
      </form>
    </section>
  );
}