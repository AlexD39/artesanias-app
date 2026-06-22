import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#fffaf0]">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}