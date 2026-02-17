import HomePage from "@/pages/HomePage";
// Jika kamu menggunakan Toaster dari Shadcn, impor di sini
import { Toaster } from "sonner";

function App() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Halaman utama kita. 
        Nantinya jika ada React Router, <HomePage /> diganti dengan <Routes> 
      */}
      <HomePage />

      {/* Komponen global seperti Toast Notification dari Shadcn */}
      <Toaster />
    </div>
  );
}

export default App;