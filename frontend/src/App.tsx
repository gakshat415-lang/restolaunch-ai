import { useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultsDashboard from './components/ResultsDashboard';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';
import { getPrediction } from './api';
import type { RestaurantRequest, PredictionData } from './api';
import './App.css';

function App() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PredictionData | null>(null);

  const handleSearch = async (request: RestaurantRequest) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await getPrediction(request);
      setResults(response.data);
      // Automatically scroll down to results smoothly
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || err.message || 'Failed to fetch predictions.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <div className="bg-background font-sans text-slate-800 relative overflow-hidden">
      
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold font-display tracking-tighter shadow-lg shadow-black/5">
              R
            </div>
            <h1 className="text-xl font-display font-bold tracking-tight text-slate-900">
              RestoLaunch <span className="text-primary font-normal">AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 font-medium hidden sm:block">{user.email}</span>
            <button 
              onClick={signOut}
              className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-full border border-slate-200 hover:border-red-100"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Original Elements */}
          <img src="/3d_coffee.png" alt="" className="absolute top-[15%] left-[12%] w-32 h-32 object-contain opacity-95 animate-float-slow drop-shadow-2xl" />
          <img src="/3d_star.png" alt="" className="absolute top-[10%] right-[18%] w-24 h-24 object-contain opacity-95 animate-float-medium drop-shadow-2xl" style={{ animationDelay: '1s' }} />
          <img src="/3d_pin.png" alt="" className="absolute bottom-[20%] left-[25%] w-28 h-28 object-contain opacity-95 animate-float-fast drop-shadow-2xl" style={{ animationDelay: '2s' }} />
          <img src="/3d_coffee.png" alt="" className="absolute bottom-[25%] right-[10%] w-40 h-40 object-contain opacity-85 animate-float-slow drop-shadow-2xl" style={{ animationDelay: '1.5s', transform: 'scaleX(-1)' }} />
          
          {/* New Duplicated Corner Elements */}
          <img src="/3d_star.png" alt="" className="absolute -top-[5%] -left-[2%] w-48 h-48 object-contain opacity-70 animate-float-medium drop-shadow-2xl blur-[2px]" style={{ animationDelay: '0.5s' }} />
          <img src="/3d_pin.png" alt="" className="absolute top-[35%] -right-[5%] w-36 h-36 object-contain opacity-60 animate-float-fast drop-shadow-2xl blur-[1px]" style={{ animationDelay: '2.5s', transform: 'rotate(-15deg)' }} />
          <img src="/3d_coffee.png" alt="" className="absolute -bottom-[5%] left-[5%] w-44 h-44 object-contain opacity-50 animate-float-slow drop-shadow-2xl blur-[2px]" style={{ animationDelay: '3s', transform: 'rotate(20deg)' }} />
          <img src="/3d_star.png" alt="" className="absolute -top-[10%] right-[5%] w-32 h-32 object-contain opacity-60 animate-float-fast drop-shadow-2xl blur-[1px]" style={{ animationDelay: '1.2s' }} />

          {/* subtle radial gradients for depth */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-sm font-medium text-slate-600 mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Market Intelligence Engine
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-extrabold text-slate-900 tracking-tighter leading-[1.05] mb-8">
            The smarter way to <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">start a food business</span><br/>
            in Bangalore
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Analyze hyper-local competition, optimize your budget, and discover untapped market opportunities with real-time AI insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="px-8 py-4 rounded-full bg-primary text-white font-semibold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-primary/20 hover:scale-105"
              >
               Analyze a Market
             </button>
             <button 
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 rounded-full bg-white text-slate-800 border border-slate-200 font-semibold text-lg hover:bg-slate-50 transition-all shadow-sm hover:scale-105"
              >
               See how it works
             </button>
          </div>
        </div>

      </section>

      {/* Main Content Tool */}
      <section className="relative min-h-screen bg-slate-50 py-24 px-6 border-t border-slate-100 overflow-hidden">
        
        {/* Floating Elements for the Bottom Section */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img src="/3d_star.png" alt="" className="absolute top-[5%] right-[2%] w-32 h-32 object-contain opacity-40 animate-float-slow drop-shadow-2xl blur-[1px]" style={{ animationDelay: '0.2s', transform: 'rotate(10deg)' }} />
          <img src="/3d_coffee.png" alt="" className="absolute bottom-[10%] left-[2%] w-48 h-48 object-contain opacity-30 animate-float-medium drop-shadow-2xl blur-[3px]" style={{ animationDelay: '1.8s', transform: 'scaleX(-1) rotate(-15deg)' }} />
          <img src="/3d_pin.png" alt="" className="absolute top-[40%] -left-[3%] w-24 h-24 object-contain opacity-50 animate-float-fast drop-shadow-2xl blur-[1px]" style={{ animationDelay: '0.8s', transform: 'rotate(25deg)' }} />
          <img src="/3d_star.png" alt="" className="absolute bottom-[5%] right-[5%] w-28 h-28 object-contain opacity-40 animate-float-slow drop-shadow-2xl blur-[2px]" style={{ animationDelay: '2.4s' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column - Input */}
            <div className="lg:col-span-4 space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-3 tracking-tight">Market Criteria</h2>
                <p className="text-slate-500">Enter your restaurant parameters to analyze the competitive landscape and viability in real-time.</p>
              </div>
              <SearchForm onSearch={handleSearch} isLoading={isLoading} />
              
              {error && (
                <div className="mt-6 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-lg flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-sm">{error}</p>
                </div>
              )}
            </div>
            
            {/* Right Column - Results */}
            <div className="lg:col-span-8">
              {results ? (
                <ResultsDashboard data={results} />
              ) : (
                <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-slate-700 mb-3">Awaiting Parameters</h3>
                  <p className="max-w-md text-slate-500 text-lg">Submit your market criteria on the left to generate the strategic Opportunity Index and competitor breakdown.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight">How we calculate the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Opportunity Index</span></h2>
            <p className="text-xl text-slate-500">Our engine uses a proprietary mathematical model running across thousands of real-world Zomato data points.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold shadow-sm mb-6 text-primary">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Market Demand Score</h3>
              <p className="text-slate-600 leading-relaxed">
                First, we calculate the MDS (Market Demand Score) for every existing competitor by evaluating their rating exponentially and applying a logarithmic scale to their total user votes.
              </p>
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-[0.03] font-display font-bold text-primary group-hover:scale-110 transition-transform">⭐</div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold shadow-sm mb-6 text-primary">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Supply Saturation</h3>
              <p className="text-slate-600 leading-relaxed">
                Next, we scan your exact chosen neighborhood, budget range (±30%), and format to count how many literal competitors already exist in the exact space you want to enter.
              </p>
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-[0.03] font-display font-bold text-primary group-hover:scale-110 transition-transform">📍</div>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold shadow-sm mb-6 text-primary">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">The Algorithm</h3>
              <p className="text-slate-600 leading-relaxed">
                We pit average market demand against the square root of local supply. A high score means a hungry market with low competition. A low score means an oversaturated "Red Ocean."
              </p>
              <div className="absolute -bottom-4 -right-4 text-8xl opacity-[0.03] font-display font-bold text-primary group-hover:scale-110 transition-transform">📈</div>
            </div>
          </div>
          
        </div>
      </section>
      
    </div>
  );
}

export default App;
