import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Shield, LayoutDashboard, CreditCard } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />

      <header className="relative border-b border-dark-800/40 glass sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:shadow-brand-600/30 transition-shadow">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Stealth<span className="text-gradient">Text</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark-100 bg-dark-800/40 border border-dark-700/30 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-dark-400 hover:text-white hover:bg-dark-800/30 transition-all"
              >
                <CreditCard className="w-4 h-4" />
                Upgrade
              </Link>
            </nav>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 ring-2 ring-dark-700/50 hover:ring-brand-500/50 transition-all",
              },
            }}
          />
        </div>
      </header>

      <main className="relative flex-1">{children}</main>
    </div>
  );
}
