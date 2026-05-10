import React from 'react';
import { AlertTriangle, CheckCircle, AlertCircle, Database, Radio, PauseCircle, PlayCircle } from 'lucide-react';

export default function Footer({ alerts, connected, dataCount, simPaused, onToggleSim }) {
  const now = new Date().toLocaleTimeString();

  return (
    <footer className="footer-bar px-6 py-3 flex items-center gap-4 flex-wrap">
      {/* Alert section */}
      <div className="flex-1 flex items-center gap-2 overflow-x-auto min-w-0">
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider flex-shrink-0">Alerts:</span>
        <div className="flex gap-2 flex-wrap">
          {alerts.map((alert, i) => (
            <div key={i}
              className={`alert-item flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                alert.type === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                alert.type === 'warning'  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}
            >
              {alert.type === 'critical' ? <AlertCircle size={10} /> :
               alert.type === 'warning'  ? <AlertTriangle size={10} /> :
               <CheckCircle size={10} />}
              {alert.msg}
            </div>
          ))}
        </div>
      </div>

      {/* Right side indicators */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Farm scale info */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-500">
          <span>🌾 5 ac</span>
          <span>·</span>
          <span>🐓 50</span>
          <span>·</span>
          <span>🐟 50</span>
        </div>

        <div className="hidden md:block w-px h-4 bg-white/10"></div>

        {/* Data log */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
          <Database size={11} className="text-accent" />
          <span>{dataCount.toLocaleString()} records</span>
        </div>

        {/* Simulation status */}
        <div className="flex items-center gap-1.5 text-[10px]">
          {simPaused ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-red-400 font-semibold">PAUSED</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
              <span className="text-accent font-semibold">LOGGING</span>
            </>
          )}
        </div>

        {/* Footer pause/resume toggle */}
        <button
          onClick={onToggleSim}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
            simPaused
              ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
              : 'bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/25'
          }`}
        >
          {simPaused
            ? <><PlayCircle size={11} /> Resume</>
            : <><PauseCircle size={11} /> Pause</>
          }
        </button>

        {/* Connection */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <Radio size={11} className={connected ? 'text-green-400' : 'text-yellow-400'} />
          <span className={connected ? 'text-green-400' : 'text-yellow-400'}>
            {connected ? 'ESP32' : 'Simulated'}
          </span>
        </div>

        <div className="w-px h-4 bg-white/10" />
        <span className="text-[10px] text-slate-500">Updated: {now}</span>
      </div>
    </footer>
  );
}
