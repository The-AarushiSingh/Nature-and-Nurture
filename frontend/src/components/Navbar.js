"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

if (pathname === "/login") {
  return null;
}

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm">
            🌿
          </div>
          <span className="font-semibold text-gray-900">
            Nature <span className="font-normal text-muted">&</span> Nurture
          </span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/explore" className="text-gray-700 hover:text-primary">
            Explore
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  <span className="text-gray-700">
                    Hi, <span className="font-medium">{user.name.split(" ")[0]}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-white bg-primary px-4 py-1.5 rounded-full hover:bg-primary-light transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-white bg-primary px-4 py-1.5 rounded-full hover:bg-primary-light transition-colors"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}