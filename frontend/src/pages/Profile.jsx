import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Profile() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");


  // 🔐 Guard
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-70px)] bg-[#F3F4F4] flex justify-center py-12 px-4 text-[#061E29]">
        <div className="w-full max-w-3xl bg-white border border-black/10 rounded-xl p-8">

          {/* ================= HEADER ================= */}
          <div className="flex items-center gap-4 pb-6 border-b border-black/10">
            <div className="w-14 h-14 rounded-full bg-[#1D546D] text-white flex items-center justify-center text-xl font-medium">
              {role?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-lg font-medium">{email}</p>
              <span className="text-xs px-2 py-1 rounded bg-[#E6EFF2] text-[#1D546D] capitalize">
                {role}
              </span>
            </div>
          </div>

          {/* ================= ACCOUNT INFO ================= */}
          <section className="mt-6">
            <h3 className="text-sm font-medium mb-3">Account Information</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#5F9598]">Email</p>
                <p className="font-medium">{email}</p>
              </div>

              <div>
                <p className="text-[#5F9598]">Role</p>
                <p className="font-medium capitalize">{role}</p>
              </div>
            </div>
          </section>

          {/* ================= SECURITY ================= */}
          <section className="mt-8">
            <h3 className="text-sm font-medium mb-3">Security</h3>

            <button
              className="px-4 py-2 rounded-lg border border-black/10 text-sm hover:bg-[#F3F4F4] transition"
            >
              Change Password
            </button>
          </section>

          {/* ================= ROLE SPECIFIC ================= */}
          {role === "admin" && (
            <section className="mt-10">
              <h3 className="text-sm font-medium mb-3">Admin Controls</h3>

              <div className="flex justify-between items-center bg-[#E6EFF2] rounded-lg p-4 text-sm">
                <span>Manage uploaded knowledge resources</span>
                <button
                  onClick={() => navigate("/admin")}
                  className="px-4 py-2 rounded-lg bg-[#1D546D] text-white hover:bg-[#163F52] transition"
                >
                  Go to Dashboard
                </button>
              </div>
            </section>
          )}

          {role === "user" && (
            <section className="mt-10">
              <h3 className="text-sm font-medium mb-3">User Activity</h3>

              <div className="flex justify-between items-center bg-[#E6EFF2] rounded-lg p-4 text-sm">
                <span>Ask questions from uploaded resources</span>
                <button
                  onClick={() => navigate("/chat")}
                  className="px-4 py-2 rounded-lg bg-[#1D546D] text-white hover:bg-[#163F52] transition"
                >
                  Go to Chat
                </button>
              </div>
            </section>
          )}

          {/* ================= DANGER ================= */}
          <section className="mt-12 pt-6 border-t border-black/10">
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:underline"
            >
              Logout
            </button>
          </section>

        </div>
      </div>
    </>
  );
}
