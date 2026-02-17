import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";

const HomePage = () => {
  return (
    <div className="w-full min-h-screen overflow-x-hidden"> 
      <header className="bg-[#11999E] text-white px-6 md:px-20 pb-20 rounded-b-[50px] md:rounded-b-[100px]">
        <Navbar />
        <Hero />
      </header>

      <main className="px-6 md:px-20 py-16">
        
        {/* Kamu bisa menambahkan Section Tabel Performa di sini nanti */}
        <section className="mt-20">
            <h2 className="text-center text-3xl font-bold text-gray-800">Performa Tim Minggu Ini</h2>
            {/* <PerformanceTable /> */}
        </section>
      </main>
    </div>
  );
};

export default HomePage;