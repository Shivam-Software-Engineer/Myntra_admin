import { Outlet } from "react-router";
import Header from "./Common Components/Header";
import Sidebar from "./Pages/Sidebar";

export default function Layout() {
  return (
    <section className="grid grid-cols-[20%_auto] min-h-screen">
      <Sidebar />

      <div className="bg-[#f5f7fb]">
        <Header />
        <Outlet />
      </div>
    </section>
  );
}