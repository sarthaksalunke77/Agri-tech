import React from 'react';

function StatChip({ label, value, color = '#e2e8f0' }) {
  return (
    <div className="rounded-lg bg-white/5 p-2 flex flex-col items-center text-center">
      <div className="text-[9px] text-slate-500 mb-0.5">{label}</div>
      <div className="text-xs font-bold" style={{ color }}>{value}</div>
    </div>
  );
}

export default function ChickenCard({ chicken, simPaused, onChickenChange }) {
  if (!chicken) return <div className="glass-card h-64 shimmer" />;

  const actColor = chicken.activity > 88 ? '#4ade80' : '#fde047';

  // Show up to 8 hen emojis to represent 50 hens (symbolic)
  const emojiCount = 8;

  return (
    <div className="glass-card overflow-hidden flex flex-col">
      <div className="card-header">
        <span className="text-xl">🐓</span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">CHICKEN COOP</h3>
          <p className="text-[10px] text-slate-400">Flock of {chicken.count} Hens</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {simPaused && <span className="text-[9px] text-red-400 font-bold">⏸</span>}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${
            chicken.health === 'EXCELLENT' ? 'badge-optimal' : 'badge-good'
          }`}>
            {chicken.health}
          </span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2.5">
        {/* Hen display row with activity */}
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-2.5">
          {/* Animated hens (8 symbolic icons) */}
          <div className="flex flex-wrap gap-0.5 flex-1">
            {[...Array(emojiCount)].map((_, i) => (
              <span key={i} className="text-base leading-none"
                style={{
                  animation: simPaused ? 'none' : `float ${2 + (i % 3) * 0.5}s ease-in-out infinite`,
                  animationDelay: `${(i * 0.25) % 1.5}s`,
                  display: 'inline-block',
                }}>🐔</span>
            ))}
            <span className="text-[9px] text-slate-400 self-end ml-1">+{chicken.count - emojiCount} more</span>
          </div>
          <div className="text-right">
            <div className="text-xl font-extrabold" style={{ color: actColor }}>{chicken.activity}%</div>
            <div className="text-[10px] text-slate-400">Activity</div>
          </div>
        </div>

        {/* Activity bar */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Flock Activity</span>
            <span style={{ color: actColor }}>{chicken.activity}%</span>
          </div>
          {simPaused ? (
            <input 
              type="range" min="0" max="100" value={chicken.activity} 
              onChange={e => onChickenChange && onChickenChange({...chicken, activity: Number(e.target.value)})}
              className="w-full h-1.5 rounded-full appearance-none bg-white/10 outline-none cursor-pointer"
              style={{ accentColor: actColor }}
            />
          ) : (
            <div className="progress-bar">
              <div className="progress-fill" style={{
                width: `${chicken.activity}%`,
                background: actColor,
              }} />
            </div>
          )}
        </div>

        {/* Stats grid – 3×2 */}
        <div className="grid grid-cols-3 gap-1.5">
          <StatChip label="Count" value={`${chicken.count} 🐔`} />
          <StatChip label="Body Temp" value={`${chicken.bodyTemp}°C`} color="#fb923c" />
          <StatChip label="Lay Rate" value={`${chicken.layRate}%`} color="#fbbf24" />
          <StatChip label="Feed/Day" value={`${(chicken.feedConsumed/1000).toFixed(1)} kg`} color="#fde047" />
          <StatChip label="Eggs Today" value={`${chicken.eggs} 🥚`} color="#fbbf24" />
          <StatChip label="Avg Weight" value={`${chicken.avgWeight} kg`} color="#94a3b8" />
        </div>

        <div className="metric-row mt-auto">
          <span className="metric-label">Water Intake</span>
          <span className="metric-value text-blue-400">
            {(chicken.waterIntake / 1000).toFixed(1)} L/day
          </span>
        </div>
      </div>
    </div>
  );
}
