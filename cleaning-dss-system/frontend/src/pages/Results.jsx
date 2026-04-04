import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRecommendations } from '../services/api';

function Results() {
  const { state: formData } = useLocation();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getRecommendations(formData);
        setRecommendations(response.data);
      } catch {
        setError('Connection failed. Please ensure the DSS Engine is online.');
      } finally {
        setLoading(false);
      }
    };

    if (formData) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [formData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="relative w-32 h-32 mb-12">
          <div className="absolute inset-0 border-[12px] border-[--color-primary-blue]/10 rounded-full"></div>
          <div className="absolute inset-0 border-[12px] border-[--color-primary-blue] rounded-full animate-spin border-t-transparent shadow-lg shadow-blue-900/10"></div>
        </div>
        <h2 className="text-4xl font-black text-white animate-pulse tracking-tight">Analyzing Asset Life-Cycles...</h2>
        <p className="mt-6 text-xl text-white/70 font-semibold">Calculating TCO for Uganda market contexts</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="surface-card p-12 text-center space-y-10">
          <div className="text-6xl">⚠️</div>
          <p className="text-white/80 text-2xl font-black">{error}</p>
          <button onClick={() => navigate('/selector')} className="primary-button text-[10px] tracking-[0.3em]">
            Return to Parameters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-24 space-y-10">
      <header className="surface-panel p-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="tag-chip border-white/30">Intelligence</div>
            <h1 className="text-5xl font-black text-white mt-6">Optimized Recommendations</h1>
            <p className="text-white/70 mt-2">Based on multi-criteria decision modeling aligned to Ugandan conditions.</p>
          </div>
          <span className="text-lg uppercase tracking-[0.4em] text-white/50">Precision Match</span>
        </div>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={index} className="surface-card p-10 space-y-8">
              <div className="flex justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 border border-white/15 rounded-full px-4 py-1">
                      {rec.machine.type}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 border border-white/15 rounded-full px-4 py-1">
                      {rec.machine.brand}
                    </span>
                  </div>
                  <h3 className="text-4xl font-black text-white mt-5">{rec.machine.name}</h3>
                </div>
                <div
                  className={`w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center font-black text-xl border-4 shadow-2xl text-white/90 ${
                    rec.matchScore >= 80
                      ? 'border-[--color-primary-green] bg-[--color-primary-green]/20 text-[--color-primary-green]'
                      : rec.matchScore >= 50
                        ? 'border-yellow-400 bg-yellow-500/10 text-yellow-300'
                        : 'border-red-500 bg-red-500/10 text-red-400'
                  }`}
                >
                  <span className="text-2xl">{rec.matchScore}%</span>
                  <span className="text-[10px] tracking-[0.3em] uppercase opacity-70">Match</span>
                </div>
              </div>

              <p className="text-white/70 italic leading-relaxed">"{rec.reasoning}"</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="surface-card p-6 bg-[rgba(255,255,255,0.05)] border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Projected Annual TCO</p>
                  <p className="text-3xl font-black text-[--color-primary-green] mt-2">UGX {Math.round(rec.tcoScore).toLocaleString()}</p>
                </div>
                <div className="surface-card p-6 bg-[rgba(255,255,255,0.05)] border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Acoustic Spec</p>
                  <p className="text-3xl font-black text-white mt-2">{rec.machine.specifications.noiseLevel} dB</p>
                </div>
              </div>

              {rec.detergents.length > 0 && (
                <div className="p-6 rounded-[2.2rem] border border-[--color-primary-green]/30 bg-[rgba(143,242,190,0.08)] space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-[--color-primary-green]">{rec.detergents[0].phLevel}</span>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Chemical Pair</p>
                      <p className="text-xl font-black text-white">{rec.detergents[0].name}</p>
                      <p className="text-white/60 text-sm">Efficiency Ratio: {rec.detergents[0].dilutionRatio}</p>
                    </div>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                    {rec.detergents[0].ecoFriendly ? 'Eco Certified' : 'Performance Standard'} · pH {rec.detergents[0].phLevel}
                  </p>
                </div>
              )}

              <button
                onClick={() =>
                  navigate('/details', {
                    state: {
                      machine: rec.machine,
                      detergents: rec.detergents,
                      tcoScore: rec.tcoScore,
                      matchScore: rec.matchScore,
                      reasoning: rec.reasoning
                    }
                  })
                }
                className="primary-button w-full text-[10px] tracking-[0.25em]"
              >
                Economic Feasibility Analysis
              </button>
            </div>
          ))
        ) : (
          <div className="surface-card p-10 text-center space-y-6">
            <p className="text-2xl font-black text-white/70">No assets matching constraints were found.</p>
            <button onClick={() => navigate('/selector')} className="outline-button">
              Adjust Selection Parameters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
