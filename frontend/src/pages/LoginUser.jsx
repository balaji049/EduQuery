import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginUser() {
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

    if (data.role !== "user") {
      setError("Please use Admin Login for admin accounts");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("email", data.email);


    navigate("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061E29] text-[#061E29]">

      {/* CARD */}
      <div className="w-full max-w-sm bg-white border border-black/10 rounded-xl p-8">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-center mb-6">
          User Login
        </h2>

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-center">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <input
          className="w-full mb-3 px-4 py-3 border border-black/10 rounded-lg text-sm
                     outline-none focus:ring-2 focus:ring-[#1D546D] focus:border-transparent"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="w-full mb-5 px-4 py-3 border border-black/10 rounded-lg text-sm
                     outline-none focus:ring-2 focus:ring-[#1D546D] focus:border-transparent"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg text-white text-sm font-medium
                     bg-[#1D546D] hover:bg-[#163F52] transition"
        >
          Login
        </button>

        {/* FOOTER LINK */}
        <p className="text-sm mt-5 text-center text-[#5F9598]">
          Don’t have an account?{" "}
          <span
            className="cursor-pointer text-[#1D546D] hover:underline"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
