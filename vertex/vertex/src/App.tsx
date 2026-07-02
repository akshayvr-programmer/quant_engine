import AppLayout from "./layouts/AppLayout";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./components/dashboard/Dashboard";

export default function App() {
  return (
    <AppLayout
      sidebar={<Sidebar />}
      topbar={<Topbar />}
    >
      <Dashboard />

      <div className="text-[#A79B91]">
        Dashboard coming soon...
      </div>
    </AppLayout>
  );
}
