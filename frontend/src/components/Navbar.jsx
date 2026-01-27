import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Hide navbar if not logged in
  if (!token) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="w-full bg-[#F3F4F4] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <h1
          onClick={() =>
            role === "admin"
              ? navigate("/admin/dashboard")
              : navigate("/chat")
          }
          className="text-lg font-medium text-[#1D546D] cursor-pointer"
        >
          EduQuery
        </h1>

        {/* NAV LINKS */}
        <div className="flex items-center gap-5 relative">

          {role === "admin" && (
            <Link
              to="/admin"
              className="text-sm text-[#061E29] hover:text-[#1D546D]"
            >
              Admin Dashboard
            </Link>
          )}

          {role === "user" && (
            <Link
              to="/chat"
              className="text-sm text-[#061E29] hover:text-[#1D546D]"
            >
              User Chat
            </Link>
          )}

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white hover:bg-slate-100"
            >
              <div className="w-7 h-7 rounded-full bg-[#5F9598] text-white flex items-center justify-center text-xs font-medium">
                {role?.charAt(0).toUpperCase()}
              </div>
              <span className="capitalize text-[#061E29]">
                {role}
              </span>
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-sm z-50 animate-fade-in">
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#061E29] hover:bg-slate-100"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
