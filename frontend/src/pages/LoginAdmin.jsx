import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // 🔐 ROLE CHECK
    if (data.role !== "admin") {
      setError("You are not authorized as Admin");
      return;
    }

    // ✅ STORE AUTH
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", data.email);
    localStorage.setItem("role", data.role);
    window.location.href = "/admin";

    // 🚀 ADMIN REDIRECT
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061E29] px-4">

      {/* CARD */}
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 p-8 shadow-sm">

        {/* HEADER */}
        <h2 className="text-xl font-medium text-[#061E29] text-center mb-6">
          Admin Login
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full mb-3 px-4 py-2 rounded-lg
            bg-[#F3F4F4]
            border border-gray-200
            text-[#061E29]
            outline-none
            focus:border-[#1D546D]
            focus:ring-1 focus:ring-[#1D546D]
          "
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full mb-5 px-4 py-2 rounded-lg
            bg-[#F3F4F4]
            border border-gray-200
            text-[#061E29]
            outline-none
            focus:border-[#1D546D]
            focus:ring-1 focus:ring-[#1D546D]
          "
        />

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          className="
            w-full py-2 rounded-lg
            bg-[#1D546D] text-white
            hover:bg-[#163F52]
            transition
            font-medium
          "
        >
          Login as Admin
        </button>

        {/* FOOTER TEXT */}
        <p className="text-xs text-center mt-5 text-[#5F9598]">
          Admin access only
        </p>
      </div>
    </div>
  );
}
