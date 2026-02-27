import { useNavigate, Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";

const LoginPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    setSuccessMessage("Login berhasil! Mengalihkan...");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <AuthLayout
      formPosition="left"
      title="Selamat Datang"
      subtitle="Masuk untuk mengelola tim Anda dengan lebih efisien."
      marketingContent={{
        hero: "Kelola Kinerja Tanpa Hambatan.",
        description:
          "Platform manajemen tim all-in-one untuk meningkatkan produktivitas dan transparansi organisasi Anda.",
        features: [
          "Tracking KPI waktu nyata",
          "Visualisasi struktur organisasi",
          "Delegasi tugas cerdas",
          "Laporan kinerja instan",
        ],
      }}
    >
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-semibold rounded-2xl animate-in fade-in slide-in-from-top-2">
          {successMessage}
        </div>
      )}

      <LoginForm
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => navigate("/register")}
      />
    </AuthLayout>
  );
};

export default LoginPage;
