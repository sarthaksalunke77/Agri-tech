import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Line, ComposedChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + (p.value || 0), 0);
  return (
    <div className="rounded-lg px-3 py-2 text-xs"
         style={{ background: 'rgba(13,33,55,0.95)', border: '1px solid rgba(0,168,150,0.4)', color: '#e2e8f0' }}>
      <p className="text-slate-400 font-semibold mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-slate-400 capitalize">{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}W</span>
        </p>
      ))}
      <div className="border-t border-white/10 mt-1.5 pt-1.5">
        <p className="font-bold text-white">Total: {Math.round(total)}W</p>
      </div>
    </div>
  );
};

export default function EnergyGraph({ data, simPaused }) {
  return (
    <div className="glass-card overflow-hidden flex flex-col h-full">
      <div className="card-header">
        <span className="text-xl">⚡</span>
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">ENERGY GENERATION – 24 HOURS</h3>
          <p className="text-[10px] text-slate-400">Solar · Wind · Biogas · Stacked view</p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[10px]">
          {simPaused && (
            <span className="text-red-400 font-bold">⏸ FROZEN</span>
          )}
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-yellow-400"></span>Solar</span>
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-400"></span>Wind</span>
          <span className="flex items-center gap-1"><span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-400"></span>Biogas</span>
        </div>
      </div>

      <div className="flex-1 p-4 pt-2 min-h-0">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Loading energy data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="hour"
                tick={{ fill: '#64748b', fontSize: 9 }}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                tickLine={false}
                tickFormatter={(v) => `${v}W`}
              />
              <Tooltip content={<CustomTooltip />} />

              <Bar dataKey="solar"  stackId="gen" fill="#facc15" radius={[0,0,0,0]} maxBarSize={20} />
              <Bar dataKey="wind"   stackId="gen" fill="#60a5fa" radius={[0,0,0,0]} maxBarSize={20} />
              <Bar dataKey="biogas" stackId="gen" fill="#4ade80" radius={[3,3,0,0]} maxBarSize={20} />

              {/* Total line overlay */}
              <Line
                type="monotone"
                dataKey={(d) => d.solar + d.wind + d.biogas}
                name="total"
                stroke="#00A896"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
