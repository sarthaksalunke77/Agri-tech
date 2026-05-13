import React from 'react';
import { Power, Settings, Droplets, Waves, Box } from 'lucide-react';

function MotorRow({ title, icon, isOn, mode, setMode, simPaused }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${isOn ? 'bg-accent/20 text-accent' : 'bg-slate-700/50 text-slate-400'}`}>
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <span className={`text-[10px] font-bold tracking-wider ${isOn ? 'text-accent' : 'text-slate-500'}`}>
            {isOn ? '🟢 RUNNING' : '⚫ IDLE'}
          </span>
        </div>
      </div>
      
      <div className="flex bg-slate-800/80 rounded-lg p-1">
        {['AUTO', 'ON', 'OFF'].map(m => (
          <button
            key={m}
            disabled={simPaused}
            onClick={() => setMode(m)}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-colors ${
              mode === m 
                ? (m === 'ON' ? 'bg-accent text-slate-900' : m === 'OFF' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white') 
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            } ${simPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function MotorControlCard({
  dripMotorOn, dripMotorMode, setDripMotorMode,
  wellMotorOn, wellMotorMode, setWellMotorMode,
  fishMotorOn, fishMotorMode, setFishMotorMode,
  simPaused
}) {
  return (
    <div className="glass-card overflow-hidden flex flex-col col-span-1 md:col-span-3">
      <div className="card-header border-b border-white/10">
        <Settings className="text-blue-400" size={20} />
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider">IOT MOTOR CONTROLS</h3>
          <p className="text-[10px] text-slate-400">Automated & Manual Override</p>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <MotorRow 
          title="Drip Motor" 
          icon={<Droplets size={16} />}
          isOn={dripMotorOn} 
          mode={dripMotorMode} 
          setMode={setDripMotorMode} 
          simPaused={simPaused} 
        />
        <MotorRow 
          title="Well Motor" 
          icon={<Waves size={16} />}
          isOn={wellMotorOn} 
          mode={wellMotorMode} 
          setMode={setWellMotorMode} 
          simPaused={simPaused} 
        />
        <MotorRow 
          title="Fish Tank Motor" 
          icon={<Box size={16} />}
          isOn={fishMotorOn} 
          mode={fishMotorMode} 
          setMode={setFishMotorMode} 
          simPaused={simPaused} 
        />
      </div>
    </div>
  );
}
