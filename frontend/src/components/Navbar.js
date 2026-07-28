"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/login") return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-8 py-5">

        <div className="
          flex items-center justify-between
          rounded-full
          border border-primary/10
          bg-white/70
          px-6 py-3
          shadow-[0_10px_40px_rgba(31,61,43,0.08)]
        ">

          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="
              w-10 h-10
              rounded-full
              bg-primary
              flex items-center justify-center
              text-white
              text-lg
              rotate-[-8deg]
              group-hover:rotate-0
              transition-transform
            ">
              🌿
            </div>

            <div className="leading-none">
              <p
                className="
                  font-bold 
                  text-primary
                  text-sm
                  tracking-tight
                "
              >
                Nature
                <span className="text-gold"> & </span>
                Nurture
              </p>

              <p className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-primary/50
                mt-1
              ">
                Botanical Intelligence
              </p>
            </div>
          </Link>


          {/* Center links */}
          <div className="
            hidden md:flex
            items-center
            gap-8
            text-sm
            font-medium
          ">

            <Link
              href="/explore"
              className="
                text-gray-600
                hover:text-primary
                transition
                relative
                after:absolute
                after:left-0
                after:-bottom-2
                after:h-[2px]
                after:w-0
                after:bg-gold
                hover:after:w-full
                after:transition-all
              "
            >
              Explore Plants
            </Link>


            <Link
              href="/assistant"
              className="
                text-gray-600
                hover:text-primary
                transition
              "
            >
              AI Assistant
            </Link>


            <Link
              href="/garden"
              className="
                text-gray-600
                hover:text-primary
                transition
              "
            >
              My Garden
            </Link>

          </div>



          {/* Right */}
          <div className="flex items-center gap-4">

            {!loading && (
              <>
              {user ? (
                <>
                  <span className="
                    hidden sm:block
                    text-sm
                    text-primary
                  ">
                    Hi, {user.name.split(" ")[0]}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="
                      rounded-full
                      bg-primary
                      text-white
                      px-5 py-2
                      text-sm
                      font-semibold
                      hover:bg-primary-light
                      transition
                    "
                  >
                    Logout
                  </button>
                </>
              ) : (

                <Link
                  href="/login"
                  className="
                    rounded-full
                    bg-primary
                    text-white
                    px-6 py-2.5
                    text-sm
                    font-bold
                    shadow-lg
                    shadow-primary/20
                    hover:-translate-y-0.5
                    transition
                  "
                >
                  Get Started
                </Link>

              )}
              </>
            )}

          </div>

        </div>

      </div>
    </nav>
  );
}