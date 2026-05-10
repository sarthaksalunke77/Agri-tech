import React, { useState } from 'react';
import { X, Settings, Wifi, Download } from 'lucide-react';
import { getESP32IP, setESP32IP, sendPumpCommand } from '../utils/esp32Client';

export default function SettingsPanel({ onClose, connected, onExportCSV }) {
  const [ip, setIp] = useState(getESP32IP());
  const [saved, setSaved] = useState(false);
  const [pumpSent, setPumpSent] = useState(null);

  const handleSave = () => {
    setESP32IP(ip);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePump = async (state) => {
    const ok = await sendPumpCommand(state);
    setPumpSent(ok ? (state ? 'ON' : 'OFF') : 'failed');
    setTimeout(() => setPumpSent(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="card-header justify-between">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-accent" />
            <h2 className="text-sm font-bold text-white">Settings</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ESP32 Config */}
          <div>
            <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-3 flex items-center gap-2">
              <Wifi size={12} /> ESP32 Configuration
            </h3>
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block">ESP32 IP Address</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="192.168.1.100"
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleSave}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    saved
                      ? 'bg-green-500/30 text-green-400 border border-green-500/40'
                      : 'bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30'
                  }`}
                >
                  {saved ? '✓ Saved' : 'Save'}
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Status: {connected
                  ? <span className="text-green-400">● Connected</span>
                  : <span className="text-yellow-400">● Simulated (ESP32 unreachable)</span>}
              </p>
            </div>
          </div>

          <div className="border-t border-white/5" />

          {/* Pump override */}
          <div>
            <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
              💧 Manual Pump Override
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handlePump(true)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
              >
                Turn Pump ON
              </button>
              <button
                onClick={() => handlePump(false)}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30 hover:bg-slate-500/30 transition-all"
              >
                Turn Pump OFF
              </button>
            </div>
            {pumpSent && (
              <p className={`text-[10px] mt-2 ${
                pumpSent === 'failed' ? 'text-red-400' : 'text-green-400'
              }`}>
                {pumpSent === 'failed' ? '⚠ Command failed (ESP32 offline)' : `✓ Pump turned ${pumpSent}`}
              </p>
            )}
          </div>

          <div className="border-t border-white/5" />

          {/* Export */}
          <div>
            <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-3">
              📊 Data Export
            </h3>
            <button
              onClick={() => { onExportCSV(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
            >
              <Download size={14} /> Export Moisture Data as CSV
            </button>
          </div>

          <div className="border-t border-white/5" />

          {/* About */}
          <div className="text-center text-[10px] text-slate-500">
            <p className="font-bold text-slate-400 mb-1">AQUAINTAL v1.0</p>
            <p>Smart Water Management System · Hackathon Demo</p>
            <p>Data refreshes: Moisture 2s · Sensors 5s · Energy 5min</p>
          </div>
        </div>
      </div>
    </div>
  );
}
