import { useNavigate, Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
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
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-primary/5" />
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] opacity-50" />

            <div className="w-full max-w-md relative z-10 transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-8">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <Link to="/" className="text-4xl font-bold text-foreground">
                        Kinerja<span className="text-primary">Hub</span>
                    </Link>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Transformasi Digital untuk Tim Anda
                    </p>
                </div>

                <div className="bg-background rounded-3xl shadow-2xl border border-border overflow-hidden ring-1 ring-border/50">
                    {/* Header */}
                    <div className="bg-primary p-8 text-center">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            Selamat Datang Kembali
                        </h2>
                        <p className="text-white/80 text-sm mt-2">
                            Masuk ke akun KinerjaHub Anda untuk mengelola kinerja tim
                        </p>
                    </div>

                    <div className="p-8">
                        {successMessage && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium rounded-xl animate-in fade-in slide-in-from-top-2">
                                {successMessage}
                            </div>
                        )}

                        <LoginForm
                            onSuccess={handleLoginSuccess}
                            onSwitchToRegister={() => navigate("/register")}
                        />
                    </div>
                </div>

                {/* Footer links */}
                <div className="text-center mt-8 space-x-6 text-sm text-muted-foreground font-medium">
                    <Link to="/" className="hover:text-primary transition-colors">
                        Beranda
                    </Link>
                    <span className="text-border">|</span>
                    <Link to="#" className="hover:text-primary transition-colors">
                        Butuh Bantuan?
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
