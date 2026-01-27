import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);


        window.location.href =
          data.role === "admin" ? "/admin" : "/chat";
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch {
      alert("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F4]">

      {/* LOGIN CARD */}
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl px-8 py-10">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-lg font-medium text-[#061E29]">
            Welcome back
          </h1>
          <p className="text-sm text-[#5F9598] mt-1">
            Sign in to continue
          </p>
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm text-[#061E29] mb-1">
            Email
          </label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-slate-300
                       focus:outline-none focus:ring-2 focus:ring-[#1D546D]/40
                       focus:border-[#1D546D]"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="block text-sm text-[#061E29] mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-lg border border-slate-300
                       focus:outline-none focus:ring-2 focus:ring-[#1D546D]/40
                       focus:border-[#1D546D]"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2.5 rounded-lg text-white text-sm font-medium transition
            ${
              loading
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-[#1D546D] hover:bg-[#163F52]"
            }`}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-sm text-center text-[#5F9598] mt-6">
          Don’t have an account?{" "}
          <span
            className="text-[#1D546D] font-medium cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}
