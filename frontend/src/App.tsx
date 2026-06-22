import { Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { ProductDetail } from "./pages/ProductDetail";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/admin/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { Products } from "./pages/admin/Products";
import { ProductForm } from "./pages/admin/ProductForm";
import { Categories } from "./pages/admin/Categories";
import { CategoryForm } from "./pages/admin/CategoryForm";
import { StoreSettings } from "./pages/admin/StoreSettings";
import { SocialLinks } from "./pages/admin/SocialLinks";
import { SocialLinkForm } from "./pages/admin/SocialLinkForm";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/tienda" element={<Shop />} />
        <Route path="/producto/:slug" element={<ProductDetail />} />
        <Route path="/contacto" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Products />} />
          <Route path="productos/nuevo" element={<ProductForm />} />
          <Route path="productos/editar/:id" element={<ProductForm />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="categorias/nueva" element={<CategoryForm />} />
          <Route path="categorias/editar/:id" element={<CategoryForm />} />
          <Route path="configuracion" element={<StoreSettings />} />
          <Route path="redes" element={<SocialLinks />} />
          <Route path="redes/nueva" element={<SocialLinkForm />} />
          <Route path="redes/editar/:id" element={<SocialLinkForm />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;