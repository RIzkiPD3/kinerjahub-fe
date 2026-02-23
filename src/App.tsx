import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./components/sections/HomeScreen";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DepartmentsPage from "./pages/DepartmentsPage";
import DivisionsPage from "./pages/DivisionsPage";
import UsersPage from "./pages/UsersPage";
import { ToastContainer } from "./components/ui/Toast";
import ProtectedRoute from "./components/auth/protected-route";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="divisions" element={<DivisionsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;
