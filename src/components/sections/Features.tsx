// src/components/sections/Features.tsx
import { BarChart3, Clock, Users2, Target, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Analitik Real-time",
    description:
      "Pantau kinerja tim secara real-time dengan dashboard interaktif",
  },
  {
    icon: Target,
    title: "Penetapan Target",
    description: "Buat dan kelola target individu maupun tim dengan mudah",
  },
  {
    icon: Users2,
    title: "Manajemen Tim",
    description: "Kelola anggota tim dan peran mereka dalam satu platform",
  },
  {
    icon: Clock,
    title: "Tracking Waktu",
    description: "Lacak waktu pengerjaan project dan optimasi produktivitas",
  },
  {
    icon: Zap,
    title: "Feedback Cepat",
    description: "Berikan feedback real-time untuk peningkatan berkelanjutan",
  },
  {
    icon: Shield,
    title: "Keamanan Data",
    description: "Data perusahaan aman dengan enkripsi end-to-end",
  },
];

const Features = () => {
  return (
    <section id="fitur" className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fitur Unggulan
          </h2>
          <p className="text-muted-foreground">
            Semua yang Anda butuhkan untuk mengelola kinerja tim secara efektif
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
