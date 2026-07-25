"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "🏠" },
  { label: "Explore Plants", href: "/", icon: "🌿" },
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
    <aside className="w-60 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm">
            🌿
          </div>
          <span className="font-semibold text-gray-900">
            Nature <span className="font-normal text-muted">&</span> Nurture
          </span>
        </Link>
      </div>

      <div className="p-5 border-b border-gray-100">
        <p className="font-medium text-gray-900 text-sm">{user?.name}</p>
        <p className="text-xs text-muted">Member</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
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