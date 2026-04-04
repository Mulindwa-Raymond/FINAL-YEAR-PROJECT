import { useLocation, useNavigate } from 'react-router-dom';

function Details() {
  const {
    state: { machine, detergents, tcoScore, matchScore, reasoning } = {}
  } = useLocation();
  const navigate = useNavigate();

  if (!machine) {
    return (
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="surface-card p-10 text-center space-y-6">
          <p className="text-2xl font-black text-white/80">Session state invalidated.</p>
          <button onClick={() => navigate('/')} className="primary-button text-[10px] tracking-[0.3em]">
            Return to Launchpad
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-24 space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="text-[--color-primary-green] font-black text-sm tracking-[0.4em] uppercase"
      >
        ← Back to Recommendations
      </button>

      <div className="surface-panel p-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">Decision Intelligence Report</h1>
            <p className="text-white/70 mt-2">Complete asset lifecycle & compatibility analysis.</p>
          </div>
          <div
            className={`text-4xl font-black px-10 py-6 rounded-[2.5rem] border-4 text-center ${
              matchScore >= 80
                ? 'border-[--color-primary-green] text-[--color-primary-green] bg-[--color-primary-green]/10'
                : matchScore >= 50
                  ? 'border-yellow-400 text-yellow-300 bg-yellow-500/10'
                  : 'border-red-500 text-red-300 bg-red-500/10'
            }`}
          >
            {matchScore}% Match
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
          <div className="surface-card p-8 space-y-6">
            <div className="border-b border-white/10 pb-6 space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Asset Focus</p>
              <h2 className="text-3xl font-black text-white">{machine.name}</h2>
              <p className="text-white/70">{machine.brand} Engineering</p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Asset Architecture', value: machine.type },
                { label: 'Power Source', value: machine.specifications.powerSource },
                { label: 'Noise Level', value: `${machine.specifications.noiseLevel} dB` },
                { label: 'Area Performance', value: `${machine.specifications.areaPerformance || 1200} m²/hr` }
              ].map((spec) => (
                <div key={spec.label} className="flex items-center justify-between text-sm text-white/70">
                  <span className="uppercase tracking-[0.3em] text-white/40">{spec.label}</span>
                  <span className="font-black text-white">{spec.value}</span>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10">
              <p className="text-white/70 text-sm italic">"{reasoning}"</p>
            </div>
          </div>

          <div className="surface-card p-10 space-y-8">
            <p className="tag-chip border-white/20 text-white/80">Lifecycle</p>
            <div className="space-y-6">
              {[{
                label: 'Acquisition',
                value: Math.round(machine.tcoData.purchasePrice / machine.tcoData.lifespanYears)
              },
              {
                label: 'Maintenance & Spares',
                value: Math.round(machine.tcoData.annualMaintenance + (machine.tcoData.annualSpareParts || 0))
              },
              {
                label: 'Utility Overhead',
                value: Math.round(machine.tcoData.annualEnergyCost || 0)
              }].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-white/70">
                  <span className="text-sm uppercase tracking-[0.3em]">{item.label}</span>
                  <span className="text-xl font-black">UGX {item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-black">Projected Annual TCO</span>
                <span className="text-2xl font-black text-[--color-primary-green]">UGX {Math.round(tcoScore).toLocaleString()}</span>
              </div>
              <p className="text-sm text-white/60">
                Includes local maintenance multipliers, grid volatility adjustments, and surface abrasion factors.
              </p>
            </div>
          </div>
        </div>

        <div className="surface-card p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-white">Chemical Compatibility Matrix</h3>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Validated</p>
          </div>

          {detergents && detergents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 rounded-[2.5rem] border border-[--color-primary-green]/30 bg-[rgba(143,242,190,0.08)] space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-[--color-primary-green]">{detergents[0].phLevel}</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Primary Surfactant</p>
                    <p className="text-2xl font-black text-white">{detergents[0].name}</p>
                    <p className="text-white/60 text-sm">{detergents[0].brand} Industrial</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-white/70 text-sm">
                  <div className="flex justify-between">
                    <span>Dilution Ratio</span>
                    <span>{detergents[0].dilutionRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sustainability</span>
                    <span>{detergents[0].ecoFriendly ? 'Certified' : 'Standard'}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-[2.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Intelligence Notes</p>
                <p className="text-white/70 text-sm">
                  This {detergents[0].phLevel > 7 ? 'alkaline' : detergents[0].phLevel < 7 ? 'acidic' : 'neutral'} chemical is validated for the chosen substrate to protect coatings and machines.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-[2.5rem] border border-white/10 bg-[rgba(255,255,255,0.03)] text-white/70 text-center">
              No chemical recommendation met the critical criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Details;
