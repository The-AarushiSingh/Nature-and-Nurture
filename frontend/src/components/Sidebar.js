"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "Explore Plants", href: "/explore", icon: "🌿" },
  { label: "AI Assistant", href: "/assistant", icon: "🤖" },
  { label: "Recommendations", href: "/recommendations", icon: "✨" },
  { label: "Plant ID", href: "/plant-id", icon: "📷" },
  { label: "Disease Diagnosis", href: "/diagnosis", icon: "🩺" },
  { label: "My Garden", href: "/garden", icon: "💚" },
  { label: "Compare Plants", href: "/compare", icon: "📊" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Nature & Nurture" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-primary" style={{ fontFamily: "var(--font-display)" }}>
            Nature <span className="font-normal text-muted">&</span> Nurture
          </span>
        </Link>
      </div>

      <div className="p-5 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.[0] || "U"}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
          <p className="text-xs text-muted">Member</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}