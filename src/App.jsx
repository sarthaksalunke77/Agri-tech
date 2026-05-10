import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SugarcaneCard from './components/SugarcaneCard';
import EnergyCard from './components/EnergyCard';
import WaterSystemCard from './components/WaterSystemCard';
import ChickenCard from './components/ChickenCard';
import FishTankCard from './components/FishTankCard';
import HydroponicsCard from './components/HydroponicsCard';
import MoistureGraph from './components/MoistureGraph';
import EnergyGraph from './components/EnergyGraph';
import SettingsPanel from './components/SettingsPanel';
import {
  generateEnergyData,
  generateEnergyHistory,
  generateChickenData,
  generateFishData,
  generateHydroData,
  generateWaterData,
  calculateSugarcaneHealth,
  generateAlerts,
} from './utils/dataGenerator';
import { fetchESP32Data } from './utils/esp32Client';

// ── Constants ──────────────────────────────────
const MAX_MOISTURE_POINTS = 900; // 30 min × 2 s = 900
const MOISTURE_INTERVAL   = 2000;
const SENSOR_INTERVAL     = 5000;
const ENERGY_INTERVAL     = 300000; // 5 min

// ── Helpers ────────────────────────────────────
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function fmtTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function exportCSV(moistureHistory) {
  const header = 'Time,Moisture(%)\n';
  const rows   = moistureHistory.map((d) => `${d.time},${d.moisture}`).join('\n');
  const blob   = new Blob([header + rows], { type: 'text/csv' });
  const url    = URL.createObjectURL(blob);
  const a      = document.createElement('a');
  a.href       = url;
  a.download   = `aquaintal_moisture_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── App ────────────────────────────────────────
export default function App() {
  // ─ Simulation pause ─
  const [simPaused, setSimPaused]       = useState(false);
  const simPausedRef                    = useRef(false); // mutable ref for closure access

  const toggleSim = () => {
    setSimPaused((prev) => {
      simPausedRef.current = !prev;
      return !prev;
    });
  };

  // ─ Sensor State ─
  const [moisture, setMoisture]               = useState(68);
  const [pumpOn, setPumpOn]                   = useState(false);
  const [pumpSeconds, setPumpSeconds]         = useState(0);
  const [connected, setConnected]             = useState(false);
  const [moistureHistory, setMoistureHistory] = useState([]);

  const [energy, setEnergy]                   = useState(null);
  const [energyHistory, setEnergyHistory]     = useState([]);
  const [chicken, setChicken]                 = useState(null);
  const [fish, setFish]                       = useState(null);
  const [hydro, setHydro]                     = useState(null);
  const [water, setWater]                     = useState(null);
  const [alerts, setAlerts]                   = useState([{ type: 'ok', msg: 'Initializing…' }]);
  const [dataCount, setDataCount]             = useState(0);
  const [lastUpdate, setLastUpdate]           = useState('—');
  const [showSettings, setShowSettings]       = useState(false);

  // Pump duration timer
  const pumpTimerRef = useRef(null);
  // Store latest moisture for closure access
  const moistureRef  = useRef(68);
  const pumpOnRef    = useRef(false);

  // Keep refs in sync
  useEffect(() => { moistureRef.current = moisture; }, [moisture]);
  useEffect(() => { pumpOnRef.current   = pumpOn;   }, [pumpOn]);

  // ─ Moisture / ESP32 tick ─
  const moistureTick = useCallback(async () => {
    if (simPausedRef.current) return; // ◀ PAUSED – skip update

    let m, pumpStatus;
    const esp32 = await fetchESP32Data();

    if (esp32) {
      m          = esp32.moisture;
      pumpStatus = esp32.pumpStatus;
      setConnected(true);
    } else {
      // Simulated: random walk around last value
      const prev = moistureRef.current;
      m          = parseFloat(Math.min(100, Math.max(0, prev + (Math.random() - 0.48) * 3)).toFixed(1));
      pumpStatus = m < 60 ? true : m > 75 ? false : pumpOnRef.current;
      setConnected(false);
    }

    setMoisture(m);

    // Pump state changes
    setPumpOn((prev) => {
      if (pumpStatus !== prev) {
        if (pumpStatus) {
          setPumpSeconds(0);
          pumpTimerRef.current = setInterval(() => setPumpSeconds((s) => s + 1), 1000);
        } else {
          clearInterval(pumpTimerRef.current);
        }
      }
      return pumpStatus;
    });

    // Append to history (rolling 30-min window)
    setMoistureHistory((prev) => {
      const point = { time: fmtTime(new Date()), moisture: m };
      const next  = [...prev, point];
      return next.length > MAX_MOISTURE_POINTS ? next.slice(next.length - MAX_MOISTURE_POINTS) : next;
    });

    setDataCount((c) => c + 1);
    setLastUpdate('just now');
  }, []);

  // ─ Sensor tick (chicken / fish / hydro / water / energy) ─
  const sensorTick = useCallback(() => {
    if (simPausedRef.current) return; // ◀ PAUSED – skip update
    setChicken(generateChickenData());
    setFish(generateFishData());
    setHydro(generateHydroData());
    setWater(generateWaterData(pumpOnRef.current));
    setEnergy(generateEnergyData());
  }, []);

  // ─ Energy history tick ─
  const energyHistoryTick = useCallback(() => {
    if (simPausedRef.current) return; // ◀ PAUSED – skip update
    setEnergyHistory(generateEnergyHistory());
  }, []);

  // ─ Alert tick ─
  useEffect(() => {
    const a = generateAlerts({ moisture, fish, energy, chicken });
    setAlerts(a);
  }, [moisture, fish, energy, chicken]);

  // ─ Mount – set up intervals ─
  useEffect(() => {
    sensorTick();
    energyHistoryTick();

    const mId = setInterval(moistureTick,      MOISTURE_INTERVAL);
    const sId = setInterval(sensorTick,        SENSOR_INTERVAL);
    const eId = setInterval(energyHistoryTick, ENERGY_INTERVAL);

    return () => {
      clearInterval(mId);
      clearInterval(sId);
      clearInterval(eId);
      clearInterval(pumpTimerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─ Derived state ─
  const sugarcane     = calculateSugarcaneHealth(moisture);
  const visibleMoisture = moistureHistory.slice(-90);

  // ─ Manual Handlers ─
  const handleEnergyChange = (newEnergy) => {
    const total = newEnergy.solar + newEnergy.wind + newEnergy.biogas;
    const netPower = total - newEnergy.consumption;
    setEnergy({
      ...newEnergy,
      total,
      netPower,
      status: netPower >= 0 ? 'SURPLUS' : 'DEFICIT'
    });
  };

  return (
    <div className="dashboard-bg min-h-screen flex flex-col">
      <Header
        connected={connected}
        simPaused={simPaused}
        onToggleSim={toggleSim}
        onOpenSettings={() => setShowSettings(true)}
      />


      {/* Main grid */}
      <main className="flex-1 overflow-auto p-4 space-y-4">
        {/* ── Row 1: Sugarcane / Energy / Water ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: '240px' }}>
          <SugarcaneCard moisture={moisture} sugarcane={sugarcane} lastUpdate={lastUpdate} simPaused={simPaused} onMoistureChange={setMoisture} />
          <EnergyCard    energy={energy} simPaused={simPaused} onEnergyChange={handleEnergyChange} />
          <WaterSystemCard water={water} pumpOn={pumpOn} pumpDuration={formatDuration(pumpSeconds)} simPaused={simPaused} />
        </div>

        {/* ── Row 2: Chicken / Fish / Hydro ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ minHeight: '240px' }}>
          <ChickenCard    chicken={chicken} simPaused={simPaused} onChickenChange={setChicken} />
          <FishTankCard   fish={fish}       simPaused={simPaused} />
          <HydroponicsCard hydro={hydro}    simPaused={simPaused} />
        </div>

        {/* ── Row 3: Graphs ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: '280px' }}>
          <MoistureGraph data={visibleMoisture} simPaused={simPaused} />
          <EnergyGraph   data={energyHistory}   simPaused={simPaused} />
        </div>
      </main>

      <Footer
        alerts={alerts}
        connected={connected}
        dataCount={dataCount}
        simPaused={simPaused}
        onToggleSim={toggleSim}
      />

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel
          onClose={() => setShowSettings(false)}
          connected={connected}
          onExportCSV={() => exportCSV(moistureHistory)}
        />
      )}
    </div>
  );
}
