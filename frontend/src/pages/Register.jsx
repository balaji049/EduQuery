import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registration successful. Please login.");
      navigate("/login/user");
    } else {
      alert(data.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#061E29]">

      {/* CARD */}
      <div className="w-full max-w-sm bg-white border border-[#E5E7EB] rounded-xl p-8 shadow-sm">

        {/* TITLE */}
        <h2 className="text-xl font-medium text-center text-[#061E29] mb-6">
          Create Account
        </h2>

        {/* NAME */}
        <input
          className="w-full mb-3 px-4 py-2 rounded-lg border border-[#E5E7EB]
                     focus:border-[#1D546D] focus:ring-2 focus:ring-[#1D546D]/20
                     outline-none text-sm"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* EMAIL */}
        <input
          className="w-full mb-3 px-4 py-2 rounded-lg border border-[#E5E7EB]
                     focus:border-[#1D546D] focus:ring-2 focus:ring-[#1D546D]/20
                     outline-none text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="w-full mb-5 px-4 py-2 rounded-lg border border-[#E5E7EB]
                     focus:border-[#1D546D] focus:ring-2 focus:ring-[#1D546D]/20
                     outline-none text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          className="w-full py-2.5 rounded-lg bg-[#1D546D] text-white text-sm font-medium
                     hover:bg-[#163F52] transition"
        >
          Register
        </button>

        {/* FOOTER LINK */}
        <p className="text-sm text-center mt-5 text-[#5F9598]">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login/user")}
            className="text-[#1D546D] cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
