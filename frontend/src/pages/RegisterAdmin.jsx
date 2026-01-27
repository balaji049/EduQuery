import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  /* =========================
     PROTECT MANUAL ACCESS
  ========================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/register", {
      method: "OPTIONS"
    })
      .then((res) => {
        if (!res.ok) {
          alert("Admin registration is disabled");
          navigate("/");
        }
      })
      .catch(() => {
        alert("Admin registration is disabled");
        navigate("/");
      });
  }, [navigate]);

  /* =========================
     REGISTER
  ========================= */
  const handleRegister = async () => {
    setError("");

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "admin" })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Registration failed");
      return;
    }

    alert("Admin registered successfully");
    navigate("/login/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F4] text-[#061E29] px-4">

      {/* CARD */}
      <div className="w-full max-w-sm bg-white border border-black/10 rounded-xl p-8">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-center mb-6">
          Admin Registration
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        {/* NAME */}
        <input
          placeholder="Admin Name"
          className="w-full mb-3 px-3 py-2 rounded-lg border border-black/10 bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#1D546D]"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        {/* EMAIL */}
        <input
          placeholder="Admin Email"
          className="w-full mb-3 px-3 py-2 rounded-lg border border-black/10 bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#1D546D]"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 px-3 py-2 rounded-lg border border-black/10 bg-white
                     focus:outline-none focus:ring-2 focus:ring-[#1D546D]"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        {/* BUTTON */}
        <button
          onClick={handleRegister}
          className="w-full py-2 rounded-lg text-white bg-[#1D546D] hover:bg-[#163F52] transition"
        >
          Register Admin
        </button>

        {/* FOOTER LINK */}
        <p className="text-sm text-center text-[#5F9598] mt-5">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login/admin")}
            className="cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
