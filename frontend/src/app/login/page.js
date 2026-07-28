"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = mode === "signin" ? "login" : "register";
    const body =
      mode === "signin" ? { email, password } : { name, email, password };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      login(data.user, data.token);
      router.push("/");
    } catch (err) {
      setError("Could not connect to server");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left panel - real image + quote */}
      <div
        className="hidden md:flex relative overflow-hidden bg-cover bg-center p-12"
        style={{ backgroundImage: "url('/images/login-hero.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />

        {/* Brand - Top Left */}
        <div className="absolute top-12 left-12 z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-full border border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
            <img
              src="/images/logo.jpg"
              alt="Nature & Nurture"
              className="h-12 w-12 object-contain"
            />
          </div>

          <div>
            <p className="text-white text-lg font-semibold tracking-wide">
              Nature & Nurture
            </p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="absolute top-[30%] left-12 z-10 max-w-lg">
          <p
            className="text-white text-4xl font-semibold tracking-wide"
            style={{
              textShadow:
                "0 2px 8px rgba(0,0,0,.45), 0 10px 30px rgba(0,0,0,.35)",
            }}
          >
            स्वास्थ्यम् धनसम्पदा
          </p>

          <h1
            className="
        mt-3
        text-6xl
        font-semibold
        leading-[1.05]
        tracking-tight
        font-[family-name:var(--font-display)]
        bg-gradient-to-r
        from-white
        via-stone-100
        to-green-100
        bg-clip-text
        text-transparent
      "
            style={{
              textShadow:
                "0 2px 8px rgba(0,0,0,.35), 0 10px 30px rgba(0,0,0,.25)",
            }}
          >
            Health is
            <br />
            true wealth.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-100">
            A tradition older than modern medicine.
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-10 left-12 right-12 z-10">
          <div className="flex items-center gap-10 rounded-2xl border border-white/15 bg-white/10 px-6 py-5 backdrop-blur-md">
            <div>
              <p className="text-3xl font-bold text-white font-[family-name:var(--font-display)]">
                35+
              </p>
              <p className="mt-1 text-sm text-white/75">Curated Plants</p>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div>
              <p className="text-3xl font-bold text-white font-[family-name:var(--font-display)]">
                AI
              </p>
              <p className="mt-1 text-sm text-white/75">Powered Assistant</p>
            </div>

            <div className="h-10 w-px bg-white/20" />

            <div>
              <p className="text-3xl font-bold text-white font-[family-name:var(--font-display)]">
                Free
              </p>
              <p className="mt-1 text-sm text-white/75">To Get Started</p>
            </div>
          </div>
        </div>
      </div>
      {/* Right panel - form */}
      <div className="flex items-center justify-center bg-cream px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-muted hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-muted"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted text-sm mb-6">
            {mode === "signin"
              ? "Sign in to your Nature & Nurture account."
              : "Start your journey today."}
          </p>

          {/* OAuth buttons - visual only for now */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => alert("Google sign-in coming soon!")}
              className="
    border border-gray-300
    rounded-xl
    py-2.5
    text-sm
    font-medium
    text-gray-800
    transition-all
    duration-200
    hover:border-emerald-800
  "
            >
              Google
            </button>

            <button
              type="button"
              onClick={() => alert("GitHub sign-in coming soon!")}
              className="
    border border-gray-300
    rounded-xl
    py-2.5
    text-sm
    font-medium
    text-gray-800
    transition-all
    duration-200
    hover:border-emerald-800
  "
            >
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-muted">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2 mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="mb-3">
                <label className="text-sm font-medium  text-gray-700">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}

            <div className="mb-3">
              <label className="text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300  text-black rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset coming soon!")}
                    className="text-xs text-primary font-medium "
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white rounded-lg py-2.5 font-medium hover:bg-primary-light transition-colors"
            >
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-muted text-center mt-5">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-primary font-medium"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-primary font-medium"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
