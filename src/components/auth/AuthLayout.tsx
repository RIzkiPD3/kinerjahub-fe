import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
  formPosition: "left" | "right";
  title: string;
  subtitle: string;
  marketingContent: {
    hero: string;
    description: string;
    features: string[];
  };
}

const AuthLayout = ({
  children,
  formPosition,
  title,
  subtitle,
  marketingContent,
}: AuthLayoutProps) => {
  const isFormLeft = formPosition === "left";

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Visual/Marketing Section */}
      <div
        className={`hidden lg:flex flex-1 relative flex-col justify-center p-16 overflow-hidden ${
          isFormLeft ? "order-2" : "order-1"
        }`}
      >
        {/* Premium Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[100px] animate-pulse delay-700" />
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-foreground mb-12 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              K
            </div>
            <span>
              Kinerja<span className="text-primary">Hub</span>
            </span>
          </Link>

          <h1 className="text-5xl font-black text-foreground leading-[1.1] tracking-tight mb-6">
            {marketingContent.hero}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            {marketingContent.description}
          </p>

          <div className="space-y-6">
            {marketingContent.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-border group-hover:border-primary/30 group-hover:shadow-md transition-all">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                </div>
                <span className="text-lg font-semibold text-foreground/80">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-border/50">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Trusted by modern teams
            </p>
            <div className="flex gap-8 opacity-40 grayscale">
              <div className="text-xl font-bold">LOGOCORP</div>
              <div className="text-xl font-bold">TECHFLOW</div>
              <div className="text-xl font-bold">NEXUS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div
        className={`flex-1 flex flex-col justify-center items-center p-8 relative ${
          isFormLeft ? "order-1 bg-white" : "order-2 bg-secondary/20"
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden absolute top-8 left-8 right-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Kinerja<span className="text-primary">Hub</span>
          </Link>
        </div>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-10 lg:text-left text-center">
            <h2 className="text-4xl font-extrabold text-foreground tracking-tight mb-3">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              {subtitle}
            </p>
          </div>

          <div className="bg-white lg:bg-transparent rounded-3xl p-2 lg:p-0 shadow-xl lg:shadow-none border lg:border-none border-border/50">
            {children}
          </div>

          <div className="mt-10 pt-8 border-t border-border/50 text-center lg:text-left">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
