'use client';

import { ArrowRight, Zap, Building2, Wallet, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Only redirect if they are actively logged in.
    const role = localStorage.getItem('user_role');
    const token = localStorage.getItem('master_admin_token');
    
    if (role && token) {
      if (role === 'owner') router.replace('/owner');
      else if (role === 'tenant') router.replace('/tenant');
      else if (role === 'master' || role === 'admin') router.replace('/dashboard');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) return null;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-white">MeterApp.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-bold text-white/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register/owner" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:-translate-y-0.5 transition-all">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in slide-in-from-bottom-4">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute"></span>
          <span className="relative flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Next-Gen Property Management</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.1] animate-fade-in slide-in-from-bottom-8" style={{ animationDelay: '100ms' }}>
          Smart Utilities. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
            Smarter Properties.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl mb-12 animate-fade-in slide-in-from-bottom-8" style={{ animationDelay: '200ms' }}>
          The all-in-one platform for landlords and tenants to track electricity usage, manage rent collections, and streamline property operations effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in slide-in-from-bottom-8" style={{ animationDelay: '300ms' }}>
          <Link href="/register/owner" className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:-translate-y-1 active:scale-95 transition-all">
            Start as Owner
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register/tenant" className="group flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-full text-lg font-bold backdrop-blur-md hover:-translate-y-1 active:scale-95 transition-all">
            Join as Tenant
          </Link>
        </div>

      </main>

      {/* Feature Grid */}
      <section className="relative z-10 bg-black/40 border-t border-white/5 backdrop-blur-3xl py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Everything you need.</h2>
            <p className="text-white/50 font-medium text-lg">Powerful features wrapped in a stunning interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Automated Billing</h3>
              <p className="text-white/50 font-medium leading-relaxed">
                Generate dynamic invoices combining rent, water, and maintenance automatically every month.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-colors"></div>
              <div className="w-14 h-14 bg-yellow-500/20 text-yellow-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                <Zap size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white relative z-10">Smart Metering</h3>
              <p className="text-white/50 font-medium leading-relaxed relative z-10">
                Track live electricity consumption per tenant and integrate IoT meters for precise readings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.04] transition-colors">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Multi-Property</h3>
              <p className="text-white/50 font-medium leading-relaxed">
                Manage dozens of properties and hundreds of tenants from a single, unified master dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
