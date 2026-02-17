import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="text-2xl font-bold text-white">KinerjaHub<span className="text-yellow-400">.</span></div>
      
      <div className="hidden md:flex space-x-8 text-white/90 font-medium">
        <a href="#" className="hover:text-white">Solusi</a>
        <a href="#" className="hover:text-white">Biaya</a>
        <a href="#" className="hover:text-white">Tentang Kami</a>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-white hover:bg-white/10">Masuk</Button>
      </div>
    </nav>
  );
};