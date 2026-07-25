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
        }
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
      {/* Left panel - image + quote */}
      <div className="hidden md:flex relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary/40 flex-col justify-between p-10 overflow-hidden">
        <div className="flex items-center gap-2 z-10">
          <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm">
            🌿
          </div>
          <span className="text-white font-semibold text-lg">
            Nature <span className="font-normal text-gray-300">&</span> Nurture
          </span>
        </div>

        <div className="z-10">
          <p className="text-white text-xl italic leading-relaxed mb-2">
            "The art of healing comes from nature, not from the physician."
          </p>
          <p className="text-gray-400 text-sm">— Paracelsus</p>
        </div>

        <div className="z-10 flex gap-8">
          <div>
            <p className="text-white text-2xl font-bold">15+</p>
            <p className="text-gray-400 text-sm">Medicinal plants</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">AI</p>
            <p className="text-gray-400 text-sm">Powered assistant</p>
          </div>
          <div>
            <p className="text-white text-2xl font-bold">Free</p>
            <p className="text-gray-400 text-sm">To get started</p>
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
                  : "text-muted"
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
              : "Start your medicinal plant journey today."}
          </p>

          {/* OAuth buttons - visual only for now */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              onClick={() => alert("Google sign-in coming soon!")}
              className="border border-gray-300 rounded-lg py-2 text-sm font-medium text-black hover:bg-gray-50 transition-colors"
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => alert("Apple sign-in coming soon!")}
              className="border border-gray-300 rounded-lg py-2 text-sm  text-black font-medium hover:bg-gray-50 transition-colors"
            >
              Apple
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