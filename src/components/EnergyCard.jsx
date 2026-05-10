import React from 'react';
import { Zap, Sun, Wind, Battery } from 'lucide-react';

function MiniBar({ label, value, max, color, icon, isSlidable = false, onChange }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[11px] text-slate-400">{label}</span>
        </div>
        <span className="text-[11px] font-bold text-white">{value}W</span>
      </div>
      {isSlidable ? (
        <input 
          type="range" min="0" max={max} value={value} 
          onChange={e => onChange && onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none bg-white/10 outline-none cursor-pointer"
          style={{ accentColor: color }}
        />
      ) : (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
      )}
    </div>
  );
}

export default function EnergyCard({ energy, simPaused, onEnergyChange }) {
  if (!energy) return <div className="glass-card h-64 shimmer" />;

  const battColor = energy.battery > 60 ? '#28a745' : energy.battery > 30 ? '#ffc107' : '#dc3545';

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="card-header">
        <span className="text-xl">⚡</span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">ENERGY STATUS</h3>
          <p className="text-[10px] text-slate-400">Solar · Wind · Biogas</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {simPaused && <span className="text-[9px] text-red-400 font-bold">⏸</span>}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
            energy.status === 'SURPLUS'
              ? 'badge-optimal'
              : 'badge-warning'
          }`}>
            {energy.status}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Total + Net */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-xl bg-white/5 p-3 text-center">
            <div className="text-2xl font-extrabold text-yellow-400">{energy.total}W</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Total Gen.</div>
          </div>
          <div className="flex-1 rounded-xl bg-white/5 p-3 text-center">
            <div className={`text-2xl font-extrabold ${energy.netPower >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {energy.netPower >= 0 ? '+' : ''}{energy.netPower}W
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Net Power</div>
          </div>
        </div>

        {/* Source bars */}
        <div className="space-y-2">
          <MiniBar label="Solar" value={energy.solar} max={220} color="#facc15"
            icon={<Sun size={12} className="text-yellow-400" />} 
            isSlidable={simPaused} onChange={v => onEnergyChange && onEnergyChange({...energy, solar: v})} />
          <MiniBar label="Wind" value={energy.wind} max={200} color="#60a5fa"
            icon={<Wind size={12} className="text-blue-400" />} 
            isSlidable={simPaused} onChange={v => onEnergyChange && onEnergyChange({...energy, wind: v})} />
          <MiniBar label="Biogas" value={energy.biogas} max={100} color="#4ade80"
            icon={<Zap size={12} className="text-green-400" />} 
            isSlidable={simPaused} onChange={v => onEnergyChange && onEnergyChange({...energy, biogas: v})} />
        </div>

        {/* Battery */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5">
              <Battery size={14} style={{ color: battColor }} />
              <span className="text-xs text-slate-400">Battery</span>
            </div>
            <span className="text-xs font-bold" style={{ color: battColor }}>
              {energy.battery.toFixed(0)}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${energy.battery}%`, background: battColor }} />
          </div>
        </div>

        {/* Consumption */}
        <div className="metric-row">
          <span className="metric-label">Consumption</span>
          <span className="metric-value">{energy.consumption}W</span>
        </div>
      </div>
    </div>
  );
}
