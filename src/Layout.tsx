import { Outlet } from "react-router";
import Header from "./components/Header";
import { Toaster } from "./components/ui/sonner";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto my-5">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}
