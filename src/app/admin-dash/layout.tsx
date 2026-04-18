import AuthGuard from "@/components/layout/AuthGuard";
import SideNavbar from "@/components/layout/navbar/SideNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-chinese-black flex">
        <SideNavbar />
        <main className="ml-16 flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}