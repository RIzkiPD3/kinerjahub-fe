import { useNavigate } from "react-router-dom";
import RegisterForm from "@/components/auth/RegisterForm";
import AuthLayout from "@/components/auth/AuthLayout";
import { useState } from "react";

const RegisterPage = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    setSuccessMessage("Registrasi berhasil! Silakan login dengan akun Anda.");
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <AuthLayout
      formPosition="right"
      title="Bergabunglah"
      subtitle="Mulailah perjalanan Anda menuju tim yang lebih produktif."
      marketingContent={{
        hero: "Bangun Tim yang Lebih Solid.",
        description:
          "Daftar sekarang untuk mengakses alat kolaborasi tercanggih yang dirancang untuk pertumbuhan eksponensial.",
        features: [
          "Kolaborasi tim tanpa batas",
          "Manajemen proyek terpadu",
          "Analitik pertumbuhan tim",
          "Keamanan data tingkat perusahaan",
        ],
      }}
    >
      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-semibold rounded-2xl animate-in fade-in slide-in-from-top-2">
          {successMessage}
        </div>
      )}

      <RegisterForm
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={() => navigate("/login")}
      />
    </AuthLayout>
  );
};

export default RegisterPage;
