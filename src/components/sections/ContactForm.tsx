import React, { useState } from 'react';
import api from '@/api/axiosInstance'; // Import config yang tadi dibuat
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner'; // Pakai sonner yang tadi kita bahas

export const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mengirim data ke backend
      await api.post('/v1/leads', { email });
      
      toast.success("Berhasil! Tim kami akan segera menghubungimu.");
      setEmail('');
    } catch (error) {
      toast.error("Waduh, ada masalah teknis. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input 
        type="email" 
        placeholder="Masukkan email kantor..." 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Coba Gratis"}
      </Button>
    </form>
  );
};