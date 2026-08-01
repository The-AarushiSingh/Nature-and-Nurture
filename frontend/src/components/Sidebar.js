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
  { label: "Nursery Locator", href: "/nursery", icon: "📍" }, // New item
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

   console.log(user); 

  const handleLogout = async () => {
  await logout();
  router.replace("/login");
};


  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      {/* <div className="p-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img
            src="/images/logo.png"
            alt="Nature & Nurture"
            className="w-8 h-8 rounded-lg"
          />
          <span
            className="font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Nature <span className="font-normal text-muted">&</span> Nurture
          </span>
        </Link> */}
      {/* </div> */}

      {/* User */}
      <div className="
  p-5
  border-b
  border-primary/10
  flex
  items-center
  gap-3
">

  <div className="
    w-11
    h-11
    rounded-2xl
    bg-gold/90
    flex
    items-center
    justify-center
    text-white
    font-bold
    text-sm
    shadow-[0_8px_20px_-10px_rgba(193,122,31,0.6)]
  ">
    {user?.name?.[0]?.toUpperCase() || "U"}
  </div>


  <div className="min-w-0">

    <p
      className="
        font-semibold
        text-primary
        text-sm
        truncate
      "
      style={{ fontFamily: "var(--font-display)" }}
    >
      {user?.name || "User"}
    </p>

    <p className="
  text-[11px]
  text-muted
  mt-1
  flex
  items-center
  gap-1
">
  <span className="w-1.5 h-1.5 rounded-full bg-sage" />
  Member
</p>



  </div>

</div>


      {/* Navigation */}
      <nav className="
  flex-1
  p-3
  space-y-1
  overflow-y-auto
  sidebar-scroll
">



        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
  onClick={handleLogout}
  className="
    w-full
    flex
    items-center
    gap-3
    px-4
    py-3
    rounded-2xl
    text-sm
    font-medium
    text-muted
    transition-all
    duration-200
    hover:bg-clay/10
    hover:text-clay
    hover:translate-x-1
  "
>
  <span className="
    w-8
    h-8
    rounded-xl
    bg-clay/10
    flex
    items-center
    justify-center
  ">
    🚪
  </span>

  <span>Sign Out</span>
</button>

      </div>
    </aside>
  );
}
