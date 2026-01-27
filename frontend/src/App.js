import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// PAGES
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import LoginAdmin from "./pages/LoginAdmin";
import LoginUser from "./pages/LoginUser";
import RegisterAdmin from "./pages/RegisterAdmin";
import Register from "./pages/Register";
import UserChat from "./pages/UserChat";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// ================================
// ROLE-BASED ROUTE GUARD
// ================================
function RoleRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;
  if (role && userRole !== role) return <Navigate to="/" replace />;

  return children;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* LANDING */}
        <Route path="/" element={<Landing />} />

        {/* AUTH */}
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/login/user" element={<LoginUser />} />
        <Route path="/register/admin" element={<RegisterAdmin />} />
        <Route path="/register/user" element={<Register />} />
        <Route path="/register" element={<Register />} />

        {/* PROFILE (ADMIN + USER) */}
        <Route
          path="/profile"
          element={
            <RoleRoute>
              <Profile />
            </RoleRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RoleRoute role="admin">
              <AdminDashboard />
            </RoleRoute>
          }
        />

        {/* USER */}
        <Route
          path="/chat"
          element={
            <RoleRoute role="user">
              <UserChat />
            </RoleRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
