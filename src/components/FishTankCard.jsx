import React from 'react';

export default function FishTankCard({ fish, simPaused }) {
  if (!fish) return <div className="glass-card h-64 shimmer" />;

  const oxygenColor = fish.oxygen >= 7.5 ? '#4ade80' : fish.oxygen >= 7.0 ? '#fde047' : '#f87171';
  const phColor     = fish.ph >= 6.8 && fish.ph <= 7.2 ? '#4ade80' : '#fde047';
  const ammoniaColor = fish.ammonia <= 0.03 ? '#4ade80' : fish.ammonia <= 0.05 ? '#fde047' : '#f87171';

  // Show 10 fish emoji to represent 50 (5 per icon = 10 icons)
  const displayFish = 10;

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      <div className="card-header">
        <span className="text-xl">🐟</span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">FISH TANK</h3>
          <p className="text-[10px] text-slate-400">
            {fish.species} · {fish.count} fish · {fish.tankVolume}L tank
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {simPaused && <span className="text-[9px] text-red-400 font-bold">⏸</span>}
          <span className="badge-optimal text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
            OPTIMAL ✓
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2.5">
        {/* Tank visual */}
        <div className="relative rounded-xl overflow-hidden h-16"
             style={{ background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 40%, #065A82 100%)' }}>
          {/* Bubbles – only animate when not paused */}
          {!simPaused && [...Array(8)].map((_, i) => (
            <div key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                left: `${8 + i * 11}%`,
                animation: `waterDrop ${1 + i * 0.25}s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
          {/* Fish emojis */}
          {[...Array(displayFish)].map((_, i) => (
            <span key={i} className="absolute text-sm"
              style={{
                left: `${5 + i * 9}%`,
                top: `${15 + (i % 3) * 28}%`,
                animation: simPaused ? 'none' : `float ${1.8 + (i % 4) * 0.3}s ease-in-out infinite`,
                animationDelay: `${(i * 0.2) % 1.2}s`,
                display: 'inline-block',
              }}>🐟</span>
          ))}
          {/* Count badge */}
          <div className="absolute top-1.5 right-2 text-[9px] font-bold text-white bg-black/40 px-1.5 py-0.5 rounded-full">
            {fish.count} fish · {fish.activity}% active
          </div>
        </div>

        {/* Primary metrics 2×2 */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'O₂ Level', value: `${fish.oxygen} mg/L`, color: oxygenColor },
            { label: 'pH', value: fish.ph, color: phColor },
            { label: 'Water Temp', value: `${fish.waterTemp}°C`, color: '#fb923c' },
            { label: 'Ammonia', value: `${fish.ammonia} mg/L`, color: ammoniaColor },
          ].map((m, i) => (
            <div key={i} className="rounded-lg bg-white/5 px-2.5 py-1.5">
              <div className="text-[9px] text-slate-500">{m.label}</div>
              <div className="text-xs font-bold mt-0.5" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Biomass + feed row */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Biomass', value: `${fish.biomass} kg`, color: '#60a5fa' },
            { label: 'Avg Weight', value: `${fish.avgWeight} kg`, color: '#94a3b8' },
            { label: 'Feed/Day', value: `${fish.feedToday} g`, color: '#fde047' },
          ].map((m, i) => (
            <div key={i} className="rounded-lg bg-white/5 px-2 py-1.5 text-center">
              <div className="text-[9px] text-slate-500">{m.label}</div>
              <div className="text-xs font-bold mt-0.5" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* O2 bar */}
        <div className="mt-auto">
          <div className="flex justify-between text-[9px] text-slate-500 mb-1">
            <span>Dissolved O₂ (min 7.0 mg/L)</span>
            <span style={{ color: oxygenColor }}>{fish.oxygen} mg/L</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(fish.oxygen / 12) * 100}%`, background: oxygenColor }} />
          </div>
        </div>
      </div>
    </div>
  );
}
