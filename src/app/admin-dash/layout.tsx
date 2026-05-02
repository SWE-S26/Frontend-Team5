import AdminAuthGuard from "@/components/layout/guards/AdminAuthGuard";
import SideNavbar from "@/components/layout/navbar/SideNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-chinese-black flex">
        <SideNavbar />
        {/* Desktop: margin-left for sidebar. Mobile: padding-bottom for bottom tab bar */}
        <main className="md:ml-16 flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-auto w-full">
          {children}
        </main>
      </div>
    </AdminAuthGuard>
  );
}