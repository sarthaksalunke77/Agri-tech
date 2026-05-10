import React, { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Area, AreaChart, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs"
         style={{ background: 'rgba(13,33,55,0.95)', border: '1px solid rgba(0,168,150,0.4)', color: '#e2e8f0' }}>
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-bold" style={{ color: p.color }}>
          Moisture: {p.value?.toFixed(1)}%
        </p>
      ))}
    </div>
  );
};

export default function MoistureGraph({ data, simPaused }) {
  return (
    <div className="glass-card overflow-hidden flex flex-col h-full">
      <div className="card-header">
        <span className="text-xl">📊</span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">SOIL MOISTURE – REAL-TIME</h3>
          <p className="text-[10px] text-slate-400">Rolling 30-minute window · Updates every 2 s</p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[10px] text-slate-400">
          {simPaused && (
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <span>⏸</span> FROZEN
            </span>
          )}
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-px bg-green-400"></span>Optimal (65-75%)</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-px bg-yellow-400"></span>Caution</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-px bg-red-400"></span>Critical</span>
        </div>
      </div>

      <div className="flex-1 p-4 pt-2 min-h-0">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Collecting data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00A896" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00A896" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                interval="preserveStartEnd"
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Threshold lines */}
              <ReferenceLine y={60} stroke="#f87171" strokeDasharray="5 3" strokeWidth={1.5}
                label={{ value: '60% Low', fill: '#f87171', fontSize: 9, position: 'insideTopRight' }} />
              <ReferenceLine y={75} stroke="#fde047" strokeDasharray="5 3" strokeWidth={1.5}
                label={{ value: '75% High', fill: '#fde047', fontSize: 9, position: 'insideTopRight' }} />

              <Area
                type="monotone"
                dataKey="moisture"
                stroke="#00A896"
                strokeWidth={2.5}
                fill="url(#moistureGrad)"
                dot={false}
                activeDot={{ r: 5, fill: '#00A896', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={300}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
