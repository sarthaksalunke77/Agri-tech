import React, { useEffect, useRef } from 'react';

function ProgressBar({ value, max = 100, color = '#00A896', isSlidable = false, onChange }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  if (isSlidable) {
    return (
      <input 
        type="range" 
        min="0" 
        max={max} 
        value={value} 
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-white/10 outline-none cursor-pointer"
        style={{ accentColor: color }}
      />
    );
  }
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function Dot({ health }) {
  const filled = Math.round((health / 100) * 5);
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i < filled ? 'bg-accent' : 'bg-white/10'}`} />
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    OPTIMAL:   'badge-optimal',
    GOOD:      'badge-good',
    EXCELLENT: 'badge-optimal',
    STRESSED:  'badge-stressed',
    CRITICAL:  'badge-critical',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${map[status] || 'badge-warning'}`}>
      {status}
    </span>
  );
}

export default function SugarcaneCard({ moisture, sugarcane, lastUpdate, simPaused, onMoistureChange }) {
  const cardRef = useRef();

  useEffect(() => {
    if (simPaused) return;
    if (cardRef.current) {
      cardRef.current.classList.add('data-flash');
      setTimeout(() => cardRef.current?.classList.remove('data-flash'), 500);
    }
  }, [moisture, simPaused]);

  if (!sugarcane) return <div className="glass-card overflow-hidden shimmer h-64" />;

  const moistureColor =
    moisture < 60 ? '#dc3545' :
    moisture > 80 ? '#ffc107' : '#28a745';

  return (
    <div className="glass-card overflow-hidden flex flex-col" ref={cardRef}>
      {/* Header */}
      <div className="card-header">
        <span className="text-xl">🌾</span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">SUGARCANE ZONE</h3>
          <p className="text-[10px] text-slate-400">
            {sugarcane.acres} Acres · ~{sugarcane.totalPlants?.toLocaleString()} Plants
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {simPaused && <span className="text-[9px] text-red-400 font-bold">⏸ PAUSED</span>}
          <StatusBadge status={sugarcane.status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-2.5">
        {/* Health */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Health Score</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{sugarcane.health}%</span>
              <Dot health={sugarcane.health} />
            </div>
          </div>
          <ProgressBar value={sugarcane.health} color={
            sugarcane.health >= 80 ? '#28a745' :
            sugarcane.health >= 60 ? '#ffc107' : '#dc3545'
          } />
        </div>

        {/* Moisture */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Soil Moisture 💧</span>
            <span className="text-sm font-bold" style={{ color: moistureColor }}>
              {parseFloat(moisture).toFixed(1)}%
            </span>
          </div>
          <ProgressBar value={moisture} color={moistureColor} isSlidable={simPaused} onChange={onMoistureChange} />
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          {[
            { label: 'Growth Rate', value: `+${sugarcane.growthRate}%/day`, color: '#4ade80' },
            { label: 'Est. Yield',  value: `${sugarcane.estYieldTonnes} T`, color: '#fde047' },
            { label: 'Water Need',  value: `${(sugarcane.waterNeedLDay/1000).toFixed(0)}k L/day`, color: '#60a5fa' },
            { label: 'Ideal Range', value: '65 – 75%', color: '#e2e8f0' },
          ].map((m, i) => (
            <div key={i} className="rounded-lg bg-white/5 px-2.5 py-1.5">
              <div className="text-[9px] text-slate-500">{m.label}</div>
              <div className="text-xs font-bold mt-0.5" style={{ color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        <div className="metric-row mt-auto">
          <span className="metric-label">Last Update</span>
          <span className={`metric-value ${simPaused ? 'text-red-400' : 'text-accent'}`}>
            {simPaused ? '⏸ Frozen' : lastUpdate}
          </span>
        </div>
      </div>
    </div>
  );
}
