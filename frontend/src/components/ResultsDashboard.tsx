import type { PredictionData } from '../api';

interface ResultsDashboardProps {
  data: PredictionData;
}

export default function ResultsDashboard({ data }: ResultsDashboardProps) {
  // Determine color based on Opportunity Index
  let oiColor = "text-yellow-500"; // Medium
  let bgGlow = "shadow-yellow-500/10";
  if (data.opportunity_index >= 20) {
    oiColor = "text-success"; // Good
    bgGlow = "shadow-success/10";
  } else if (data.opportunity_index < 10) {
    oiColor = "text-danger"; // Bad
    bgGlow = "shadow-danger/10";
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Verdict Card */}
      <div className={`bg-white p-8 rounded-2xl shadow-xl border border-slate-100 ${bgGlow} transition-all`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
          <div className="flex-shrink-0 text-center md:text-left">
            <p className="text-slate-500 text-sm uppercase tracking-widest font-semibold mb-2">Opportunity Index</p>
            <div className={`text-6xl font-display font-bold tracking-tighter ${oiColor}`}>
              {data.opportunity_index.toFixed(1)}
            </div>
          </div>
          
          <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
            <h3 className="text-xl font-display font-semibold text-slate-900 mb-3">Strategic Verdict</h3>
            <p className="text-slate-600 text-lg leading-relaxed italic">
              "{data.verdict}"
            </p>
          </div>
        </div>
      </div>

      {/* Top 5 Competitors Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-display font-semibold text-slate-900">Top Local Competitors</h3>
          <span className="bg-white text-slate-600 px-3 py-1 rounded-full text-sm font-medium border border-slate-200 shadow-sm">
            Total in Market: {data.competitor_count}
          </span>
        </div>
        
        {data.top_competitors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">Restaurant Name</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold text-right">Votes</th>
                  <th className="px-6 py-4 font-semibold text-right">MDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.top_competitors.map((comp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 group-hover:text-primary transition-colors">{comp.Name}</div>
                      <div className="text-xs text-slate-500 mt-1">₹{comp.Price} avg.</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                        <span className="text-slate-700 font-medium">{comp.Rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-600">{comp.Votes.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-blue-50 text-primary px-3 py-1 rounded border border-blue-100 font-mono text-sm font-semibold">
                        {comp.MDS.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M8 16l4-4 4 4M12 4v16"></path>
            </svg>
            <p>No immediate competitors found in this exact segment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
