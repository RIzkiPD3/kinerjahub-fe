import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./components/sections/HomeScreen";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/AuthPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DepartmentsPage from "./pages/DepartmentsPage";
import DivisionsPage from "./pages/DivisionsPage";
import UsersPage from "./pages/UsersPage";
import TasksPage from "./pages/TasksPage";
import { ToastContainer } from "./components/ui/Toast";
import ProtectedRoute from "./components/auth/protected-route";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="departments"
            element={
              <ProtectedRoute allowedRoles="admin">
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route path="divisions" element={<DivisionsPage />} />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles="admin">
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="tasks" element={<TasksPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
