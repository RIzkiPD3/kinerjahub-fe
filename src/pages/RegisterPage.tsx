import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      alert("Registrasi Berhasil!");
      navigate("/login");
    } catch (error) {
      console.error("Registrasi Gagal", error);
      alert("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-brandTeal">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Mulai kelola performa karyawan Anda sekarang
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input 
                placeholder="John Doe" 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="name@company.com" 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input 
                type="password" 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-brandTeal hover:bg-teal-700 text-white"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;