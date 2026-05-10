import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock, Activity, PauseCircle, PlayCircle } from 'lucide-react';

export default function Header({ connected, simPaused, onToggleSim, onOpenSettings }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt     = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const fmtDate = (d) => d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="header-gradient px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left – branding */}
      <div className="flex items-center gap-4">
        <div className="relative w-11 h-11 flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent to-primary opacity-30 blur-sm"></div>
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#00A896] to-[#065A82] flex items-center justify-center shadow-lg">
            <span className="text-xl">💧</span>
          </div>
        </div>

        <div>
          <h1 className="text-lg font-extrabold tracking-wide text-white glow-text"
              style={{ fontFamily: "'Outfit', sans-serif" }}>
            AQUAINTAL
          </h1>
          <p className="text-[10px] text-slate-300 font-medium tracking-widest uppercase">
            Smart Water Management · 5 Acres · 50 Hens · 50 Fish
          </p>
        </div>
      </div>

      {/* Center – tagline */}
      <div className="hidden lg:flex flex-col items-center">
        <span className="text-[10px] font-semibold text-accent tracking-widest uppercase">
          Real-time Integrated Farm Monitoring
        </span>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${simPaused ? 'bg-red-400' : 'bg-accent'} opacity-70`}
                 style={simPaused ? {} : { animation: `pulseDot ${1 + i * 0.2}s ease-in-out infinite` }}></div>
          ))}
        </div>
      </div>

      {/* Right – controls */}
      <div className="flex items-center gap-3">
        {/* Clock */}
        <div className="hidden md:flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-white font-bold text-base tracking-widest">
            <Clock size={14} className="text-accent" />
            {fmt(time)}
          </div>
          <span className="text-[10px] text-slate-400">{fmtDate(time)}</span>
        </div>

        <div className="hidden md:block w-px h-8 bg-white/10"></div>

        {/* ── PAUSE / RESUME BUTTON ── */}
        <button
          id="sim-toggle-btn"
          onClick={onToggleSim}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 border ${
            simPaused
              ? 'bg-red-500/25 text-red-300 border-red-500/50 hover:bg-red-500/40 shadow-lg shadow-red-500/20'
              : 'bg-accent/20 text-accent border-accent/40 hover:bg-accent/35 shadow-lg shadow-accent/10'
          }`}
          title={simPaused ? 'Resume all simulations' : 'Pause all simulations'}
        >
          {simPaused
            ? <><PlayCircle size={15} /> RESUME SIM</>
            : <><PauseCircle size={15} /> PAUSE SIM</>
          }
        </button>

        {/* ESP32 connection */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
            connected
              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
              : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/25'
          }`}
        >
          {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
          {connected ? 'ESP32' : 'SIM'}
        </button>

        {/* Live / Paused dot */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5`}>
          <div className={`w-2 h-2 rounded-full ${
            simPaused ? 'bg-red-400' : 'bg-accent pulse-dot'
          }`}></div>
          <Activity size={11} className={simPaused ? 'text-red-400' : 'text-accent'} />
          <span className={`text-[10px] font-bold tracking-wider ${simPaused ? 'text-red-400' : 'text-accent'}`}>
            {simPaused ? 'PAUSED' : 'LIVE'}
          </span>
        </div>
      </div>
    </header>
  );
}
