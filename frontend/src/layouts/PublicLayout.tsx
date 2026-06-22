import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SiteProvider } from "../context/SiteContext";

export function PublicLayout() {
  return (
    <SiteProvider>
      <div className="min-h-screen bg-[#fffaf0]">
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </SiteProvider>
  );
}