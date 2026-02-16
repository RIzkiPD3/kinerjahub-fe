const Home = () => {
  const stats = [
    {
      label: "Pengguna Aktif",
      value: "10K+",
      from: "from-(--color-primary)",
      to: "to-(--color-secondary)",
    },
    {
      label: "Perusahaan",
      value: "500+",
      from: "from-(--color-secondary)",
      to: "to-(--color-accent)",
    },
    {
      label: "Peningkatan",
      value: "40%",
      from: "from-(--color-accent)",
      to: "to-(--color-primary)",
    },
  ];

  return (
    <main className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-linear-to-br from-(--color-primary)/5 via-transparent to-(--color-secondary)/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-(--color-primary)/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-(--color-secondary)/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-linear-to-r from-(--color-primary) to-(--color-secondary) text-white px-6 py-2 rounded-full text-sm font-medium mb-8 shadow-lg">
            ✨ Transformasi Digital untuk Tim Anda
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
            <span className="bg-linear-to-r from-(--color-primary) to-(--color-secondary) bg-clip-text text-transparent">
              Kelola Kinerja Tim
            </span>
            <br />
            <span className="text-(--color-foreground)">Lebih Cerdas</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-(--color-foreground)/70 mb-12 max-w-3xl mx-auto">
            Platform all-in-one untuk monitoring kinerja, tracking progress, dan
            meningkatkan produktivitas tim Anda secara real-time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group bg-linear-to-r from-(--color-primary) to-(--color-secondary) text-(--color-primary-foreground) px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Mulai Gratis 14 Hari
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">
                →
              </span>
            </button>
            <button className="border-2 border-(--color-primary) text-(--color-primary) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-(--color-primary) hover:text-(--color-primary-foreground) transition-all">
              Lihat Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="backdrop-blur-sm bg-white/30 dark:bg-black/30 rounded-2xl p-6 border border-white/20 shadow-xl hover:scale-105 transition-transform"
              >
                <div
                  className={`text-3xl font-bold bg-linear-to-r ${stat.from} ${stat.to} bg-clip-text text-transparent mb-2`}
                >
                  {stat.value}
                </div>
                <div className="text-(--color-foreground)/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
