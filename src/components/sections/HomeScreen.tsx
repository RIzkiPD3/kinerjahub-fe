const Home = () => {
  const stats = [
    {
      label: "Pengguna Aktif",
      value: "10K+",
      color: "text-primary",
    },
    {
      label: "Perusahaan",
      value: "500+",
      color: "text-accent",
    },
    {
      label: "Peningkatan",
      value: "40%",
      color: "text-primary",
    },
  ];

  return (
    <main className="relative overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-primary text-white px-6 py-2 rounded-full text-sm font-medium mb-8 shadow-md">
            ✨ Transformasi Digital untuk Tim Anda
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="text-primary">Kelola Kinerja Tim</span>
            <br />
            <span className="text-foreground">Lebih Cerdas</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Platform all-in-one untuk monitoring kinerja, tracking progress, dan
            meningkatkan produktivitas tim Anda secara real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-lg transition-all">
              Mulai Gratis 14 Hari
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">
                →
              </span>
            </button>
            <button className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/5 transition-all">
              Lihat Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="backdrop-blur-sm bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
