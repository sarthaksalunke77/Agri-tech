import React, { useState, useEffect } from 'react';
import { Droplets, Thermometer, FlaskConical, Gauge } from 'lucide-react';

function WaterDrop({ delay = 0 }) {
  return (
    <div
      className="absolute w-2 h-2 rounded-full bg-blue-400 opacity-80"
      style={{
        animation: `waterDrop 1.2s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        left: `${30 + delay * 20}%`,
      }}
    />
  );
}

export default function WaterSystemCard({ water, pumpOn, pumpDuration, simPaused, onTdsChange }) {
  if (!water) return <div className="glass-card h-64 shimmer" />;

  const phColor = water.ph >= 6.5 && water.ph <= 7.5 ? '#28a745' : '#ffc107';

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Header */}
      <div className="card-header">
        <span className="text-xl">🚿</span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">WATER SYSTEM</h3>
          <p className="text-[10px] text-slate-400">5-Acre Irrigation · Quality Monitor</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {simPaused && <span className="text-[9px] text-red-400 font-bold">⏸</span>}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
            pumpOn ? 'badge-optimal' : 'text-slate-400 bg-white/10 border border-white/10'
          }`}>
            {pumpOn ? 'IRRIGATING' : 'IDLE'}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Pump status with animation */}
        <div className="relative rounded-xl bg-white/5 p-3 overflow-hidden flex items-center gap-3">
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            {pumpOn ? (
              <>
                <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                <span className="text-2xl relative">💧</span>
                {!simPaused && (
                  <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden">
                    <WaterDrop delay={0} />
                    <WaterDrop delay={0.4} />
                    <WaterDrop delay={0.8} />
                  </div>
                )}
              </>
            ) : (
              <span className="text-2xl opacity-40">💧</span>
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {pumpOn ? '🟢 Drip Motor Active' : '⚫ Drip Motor Idle'}
            </div>
            <div className="text-xs text-slate-400">
              {pumpOn ? `Irrigating: ${pumpDuration}` : 'Awaiting moisture threshold'}
            </div>
          </div>
          {pumpOn && (
            <div className="ml-auto text-xs font-bold text-blue-400 animate-pulse">
              {water.flowRate} L/min
            </div>
          )}
        </div>

        {/* Water quality metrics */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: <FlaskConical size={13} className="text-cyan-400" />, label: 'pH', value: water.ph, color: phColor },
            { icon: <Gauge size={13} className="text-purple-400" />, label: 'EC', value: `${water.ec} mS/cm`, color: '#c084fc' },
            { icon: <Droplets size={13} className="text-blue-400" />, label: 'TDS', value: `${water.tds} ppm`, color: '#60a5fa', isTds: true },
            { icon: <Thermometer size={13} className="text-orange-400" />, label: 'Temp', value: `${water.temp}°C`, color: '#fb923c' },
          ].map((m, i) => (
            <div key={i} className="rounded-lg bg-white/5 p-2.5 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                {m.icon}
                <div>
                  <div className="text-[10px] text-slate-500">{m.label}</div>
                  <div className="text-sm font-bold" style={{ color: m.color }}>{m.value}</div>
                </div>
              </div>
              {m.isTds && simPaused && (
                <input 
                  type="range" min="0" max="1000" value={water.tds} 
                  onChange={e => onTdsChange && onTdsChange(Number(e.target.value))}
                  className="w-full mt-2 h-1 rounded-full appearance-none bg-white/10 outline-none cursor-pointer"
                  style={{ accentColor: m.color }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Daily usage */}
        <div className="metric-row">
          <span className="metric-label">Daily Usage (5 acres)</span>
          <span className="metric-value text-blue-400">
            {water.dailyUsage ? `${(water.dailyUsage / 1000).toFixed(0)}k L/day` : '—'}
          </span>
        </div>

        {/* Reservoir */}
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-400">Reservoir Level</span>
            <span className="text-xs font-bold text-blue-400">{water.reservoir}%</span>
          </div>
          <div className="relative h-4 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${water.reservoir}%`,
                background: 'linear-gradient(90deg, #065A82, #00A896)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
              {water.reservoir}% Full
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
