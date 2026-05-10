import React from 'react';

function PlantRow({ emoji, name, count, growth }) {
  const color = growth >= 90 ? '#4ade80' : growth >= 80 ? '#fde047' : '#f87171';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <div>
            <span className="text-xs text-white font-semibold">{name}</span>
            <span className="text-[10px] text-slate-500 ml-1">({count} plants)</span>
          </div>
        </div>
        <span className="text-xs font-bold" style={{ color }}>{growth}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${growth}%`, background: color }} />
      </div>
    </div>
  );
}

export default function HydroponicsCard({ hydro, simPaused }) {
  if (!hydro) return <div className="glass-card h-64 shimmer" />;

  const totalPlants = hydro.lettuce.count + hydro.spinach.count + hydro.basil.count;

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      <div className="card-header">
        <span className="text-xl">🌿</span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">HYDROPONICS</h3>
          <p className="text-[10px] text-slate-400">{totalPlants} Plants · NFT System</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {simPaused && <span className="text-[9px] text-red-400 font-bold">⏸</span>}
          <span className="badge-optimal text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">GROWING</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Plant rows */}
        <div className="space-y-2">
          <PlantRow emoji="🥬" name="Lettuce" count={hydro.lettuce.count} growth={hydro.lettuce.growth} />
          <PlantRow emoji="🍃" name="Spinach" count={hydro.spinach.count} growth={hydro.spinach.growth} />
          <PlantRow emoji="🌱" name="Basil"   count={hydro.basil.count}  growth={hydro.basil.growth} />
        </div>

        {/* Divider */}
        <div className="border-t border-white/5" />

        {/* Nutrient params */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'pH', value: hydro.ph, color: hydro.ph >= 6.0 && hydro.ph <= 6.5 ? '#4ade80' : '#fde047' },
            { label: 'EC', value: `${hydro.ec}`, color: '#c084fc' },
            { label: 'Temp', value: `${hydro.waterTemp}°C`, color: '#fb923c' },
          ].map((m, i) => (
            <div key={i} className="rounded-lg bg-white/5 p-2 text-center">
              <div className="text-[10px] text-slate-500">{m.label}</div>
              <div className="text-sm font-bold mt-0.5" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Light hours */}
        <div className="metric-row mt-auto">
          <span className="metric-label">Photoperiod</span>
          <span className="metric-value text-yellow-400">☀️ {hydro.lightHours}h/day</span>
        </div>
      </div>
    </div>
  );
}
