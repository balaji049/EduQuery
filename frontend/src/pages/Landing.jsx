import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F3F4F4]">

      {/* ================= BACKGROUND IMAGE ================= */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/eduquery-bg.png')" }}
      />

      {/* SUBTLE ENTERPRISE OVERLAY */}
      <div className="absolute inset-0 bg-[#061E29]/35" />


      {/* ================= CONTENT LAYER ================= */}
      <div className="relative z-10 min-h-screen flex flex-col text-white">


        {/* ================= HEADER ================= */}
        <header className="h-16 bg-[#061E29]/70 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

            {/* LOGO */}
            <span className="text-sm font-semibold tracking-wide text-[#5F9598]">
              EduQuery
            </span>

            {/* ACTIONS */}
            <div className="flex gap-3 text-sm">

              {/* OUTLINE BUTTON */}
              <button
                onClick={() => navigate("/login/admin")}
                className="px-4 py-2 rounded-md border border-[#5F9598]/50 text-[#5F9598]
                           hover:border-[#5F9598] hover:text-white transition"
              >
                Admin Access
              </button>

              {/* PRIMARY BUTTON */}
              <button
                onClick={() => navigate("/login/user")}
                className="px-4 py-2 rounded-md bg-[#1D546D] hover:bg-[#163F52]
                           text-white transition shadow-sm"
              >
                Login
              </button>
            </div>
          </div>
        </header>


        {/* ================= HERO ================= */}
        <main className="flex-1 flex items-center justify-center px-6">

          <h1
            className="
              text-center
              text-3xl md:text-5xl
              font-semibold
              tracking-wide
              text-white/95
              drop-shadow-lg
              animate-fade-up
            "
          >
            Knowledge-Grounded AI Assistance for Trusted Answers
          </h1>

        </main>


        {/* ================= FOOTER ================= */}
        <footer className="h-14 bg-[#061E29]/70 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between text-xs text-white/70">

            <span>© {new Date().getFullYear()} EduQuery</span>

            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer transition">
                Privacy
              </span>
              <span className="hover:text-white cursor-pointer transition">
                Contact
              </span>
            </div>

          </div>
        </footer>

      </div>
    </div>
  );
}
