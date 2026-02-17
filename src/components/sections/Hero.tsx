import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center pt-10 pb-20">
      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          Catat Tugas & Daftar Kerja Karyawan di Aplikasi <br />
          <span className="text-yellow-300 underline">Performance Online</span>
        </h1>
        <p className="text-white/80 text-lg max-w-md">
          Berbagi tugas secara jarak jauh, tidak masalah! Pantau performa tim dengan data yang akurat.
        </p>
        <div className="flex space-x-4">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
            Coba Gratis
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 rounded-full">
            Pelajari Selengkapnya
          </Button>
        </div>
      </div>

      <div className="relative flex justify-center">
        {/* Mockup Image atau Ilustrasi */}
        <div className="w-full max-w-md bg-white/10 p-4 rounded-3xl backdrop-blur-sm">
             <img 
               src="https://www.hadirr.com/static/images/features/ngopi-man.webp" 
               alt="Mockup App" 
               className=""
             />
        </div>
      </div>
    </section>
  );
};