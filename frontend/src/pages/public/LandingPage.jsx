import { Link } from 'react-router-dom';
import { Zap, Shield, Smartphone } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 lg:px-12">
        <div className="text-2xl font-bold text-primary">VTU<span className="text-secondary">Hub</span></div>
        <div className="space-x-4">
          <Link to="/login" className="text-secondary font-medium hover:text-primary transition-colors">Log In</Link>
          <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-full font-medium shadow-md shadow-orange-500/30 hover:-translate-y-0.5 transition-all">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 lg:px-12 py-12 lg:py-24 max-w-7xl mx-auto gap-12">
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-extrabold text-secondary leading-tight">
            Instant Top-Up, <br /> Zero <span className="text-primary">Hassle.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto lg:mx-0">
            Recharge your airtime, buy data bundles, and pay bills instantly. Experience the fastest and most secure VTU platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link to="/signup" className="bg-secondary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-900/20 hover:-translate-y-1 transition-transform">Get Started Now</Link>
            <Link to="/login" className="bg-orange-50 text-primary border border-primary px-8 py-3 rounded-full font-bold hover:bg-orange-100 transition-colors">Sign In</Link>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-72 h-96 lg:w-96 lg:h-[500px] bg-gradient-to-tr from-secondary to-primary rounded-[2rem] shadow-2xl p-4 rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="w-full h-full bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex flex-col justify-between p-6 overflow-hidden">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 animate-pulse"></div>
                  <div className="w-3/4 h-6 rounded-md bg-white/20 animate-pulse"></div>
                  <div className="w-1/2 h-6 rounded-md bg-white/20 animate-pulse"></div>
                </div>
                <div className="mt-8 space-y-3">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="w-full h-12 bg-white/20 rounded-lg flex items-center px-4 gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/30"></div>
                        <div className="w-full h-2 rounded bg-white/20"></div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 text-primary rounded-full flex items-center justify-center mx-auto">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold text-secondary">Lightning Fast</h3>
            <p className="text-gray-500">Your top-ups reflect instantly. No waiting, no delays.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-secondary rounded-full flex items-center justify-center mx-auto">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold text-secondary">Secure Payments</h3>
            <p className="text-gray-500">Your funds and details are protected with bank-level security.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 text-primary rounded-full flex items-center justify-center mx-auto">
              <Smartphone size={32} />
            </div>
            <h3 className="text-xl font-bold text-secondary">All Networks</h3>
            <p className="text-gray-500">We support all major telecommunication networks flawlessly.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
