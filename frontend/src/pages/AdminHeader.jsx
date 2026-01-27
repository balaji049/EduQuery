import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="bg-[#061E29] border-b border-black/10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO + ROLE */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-lg tracking-wide">
            EduQuery
          </span>
          <span className="text-xs text-[#5F9598]">
            Admin
          </span>
        </div>

        {/* PROFILE */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                       bg-[#0B2A3B] hover:bg-[#12394D]
                       transition text-sm"
          >
            <span className="w-8 h-8 bg-[#1D546D] rounded-full flex items-center justify-center text-xs font-medium">
              A
            </span>

            <span className="font-medium">ADMIN</span>
            <ChevronDown size={16} />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-[#061E29] border border-[#E5E7EB] rounded-lg shadow-sm text-sm animate-fade-in">

              {/* ✅ FIXED PROFILE NAVIGATION */}
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="block w-full text-left px-4 py-2 hover:bg-[#F3F4F4] transition"
              >
                Profile
              </button>

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
              >
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
