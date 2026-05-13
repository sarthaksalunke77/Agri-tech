// ─────────────────────────────────────────────
//  dataGenerator.js – Simulated sensor data
//  Scale: 50 hens · 50 Tilapia · 5 acres sugarcane
// ─────────────────────────────────────────────

/** Return a random float between min and max */
export const rand = (min, max) => Math.random() * (max - min) + min;

/** Clamp a value to [min, max] */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// ── Farm constants ────────────────────────────
export const FARM = {
  HENS:       50,
  FISH:       50,
  LAND_ACRES: 5,
};

// ── Energy ────────────────────────────────────
export function generateEnergyData() {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;

  // Solar: sine curve between 6 AM – 6 PM
  const solar = (h >= 6 && h <= 18)
    ? Math.max(0, 200 * Math.sin(((h - 6) * Math.PI) / 12))
    : 0;

  const wind   = rand(80, 180);
  const biogas = rand(60, 75);
  const total  = solar + wind + biogas;
  const battery = clamp(rand(85, 95), 0, 100);
  // 5-acre farm consumption scales up
  const consumption = 220; // larger pumps, lighting for 50 hens, aerators for 50 fish
  const netPower = total - consumption;

  return {
    solar:       Math.round(solar),
    wind:        Math.round(wind),
    biogas:      Math.round(biogas),
    total:       Math.round(total),
    battery,
    consumption,
    netPower:    Math.round(netPower),
    status:      netPower > 0 ? 'SURPLUS' : 'DEFICIT',
  };
}

// ── Hourly energy history (last 24 h) ─────────
export function generateEnergyHistory() {
  const history = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const h = ((now.getHours() - i + 24) % 24);
    const solar = (h >= 6 && h <= 18)
      ? Math.max(0, 200 * Math.sin(((h - 6) * Math.PI) / 12) * rand(0.85, 1.0))
      : 0;
    history.push({
      hour:   `${String(h).padStart(2,'0')}:00`,
      solar:  Math.round(solar),
      wind:   Math.round(rand(80, 180)),
      biogas: Math.round(rand(60, 75)),
    });
  }
  return history;
}

// ── Chicken Coop – 50 hens ────────────────────
export function generateChickenData() {
  const h = new Date().getHours();
  const isDaytime = h >= 6 && h < 20;
  const count = FARM.HENS; // 50 hens

  // Realistic metrics for 50 hens
  const layRate     = rand(isDaytime ? 0.78 : 0.72, isDaytime ? 0.92 : 0.84); // 78-92% lay rate
  const eggs        = Math.round(count * layRate);               // 39-46 eggs/day
  const feedPerHen  = rand(110, 130);                            // g/hen/day
  const feedTotal   = Math.round(count * feedPerHen);            // ~5,500-6,500 g
  const waterPerHen = rand(180, 260);                            // mL/hen/day
  const waterTotal  = Math.round(count * waterPerHen);           // 9-13 L total

  return {
    count,
    activity:    Math.round(rand(isDaytime ? 82 : 65, isDaytime ? 95 : 78)),
    feedConsumed: feedTotal,
    eggs,
    layRate:     Math.round(layRate * 100),
    health:      rand(0, 1) > 0.3 ? 'EXCELLENT' : 'GOOD',
    bodyTemp:    parseFloat(rand(39.0, 41.0).toFixed(1)),
    waterIntake: waterTotal,
    mortality:   0, // all healthy
    avgWeight:   parseFloat(rand(1.8, 2.2).toFixed(1)), // kg/hen
  };
}

// ── Fish Tank – 50 Tilapia ────────────────────
export function generateFishData() {
  const count = FARM.FISH; // 50 fish
  return {
    species:        'Tilapia',
    count,
    activity:       Math.round(rand(88, 96)),
    oxygen:         parseFloat(rand(7.8, 8.5).toFixed(1)),
    waterTemp:      parseFloat(rand(24, 27).toFixed(1)),
    ph:             parseFloat(rand(6.8, 7.2).toFixed(1)),
    turbidity:      parseFloat(rand(0.5, 2.0).toFixed(1)),
    health:         'OPTIMAL',
    avgWeight:      parseFloat(rand(0.18, 0.25).toFixed(2)), // kg/fish
    biomass:        parseFloat((count * rand(0.18, 0.25)).toFixed(1)), // total kg
    feedToday:      Math.round(count * rand(8, 12)),  // g/fish/day × 50
    tankVolume:     2000,  // litres (large tank for 50 fish)
    ammonia:        parseFloat(rand(0.01, 0.05).toFixed(2)),
  };
}

// ── Hydroponics ───────────────────────────────
export function generateHydroData() {
  return {
    lettuce:  { count: 12, growth: Math.round(rand(90, 98)) },
    spinach:  { count: 8,  growth: Math.round(rand(85, 95)) },
    basil:    { count: 6,  growth: Math.round(rand(88, 94)) },
    ph:       parseFloat(rand(6.0, 6.5).toFixed(1)),
    ec:       parseFloat(rand(1.8, 2.2).toFixed(2)),
    waterTemp:parseFloat(rand(20, 23).toFixed(1)),
    lightHours: Math.round(rand(14, 16)),
  };
}

let prevTds = 575;
let prevRes = 85;

// ── Water Quality (5-acre scale) ──────────────
export function generateWaterData(dripMotorOn = false, wellMotorOn = false) {
  // TDS drifts slowly
  prevTds += (Math.random() - 0.4) * 8; // slight upward drift
  prevTds = Math.max(500, Math.min(prevTds, 650));

  // Reservoir logic
  if (wellMotorOn) {
    prevRes += 3; // filling
  } else if (dripMotorOn) {
    prevRes -= 0.8; // draining quickly
  } else {
    prevRes -= 0.1; // draining slowly
  }
  prevRes = Math.max(10, Math.min(prevRes, 100));

  return {
    ph:         parseFloat(rand(6.5, 7.2).toFixed(1)),
    ec:         parseFloat(rand(1.0, 1.5).toFixed(2)),
    tds:        Math.round(prevTds),
    temp:       parseFloat(rand(22, 26).toFixed(1)),
    // Larger pump for 5 acres
    flowRate:   dripMotorOn ? parseFloat(rand(8.5, 12.0).toFixed(1)) : 0,
    reservoir:  Math.round(prevRes),
    // Daily volume needed for 5 acres
    dailyUsage: Math.round(rand(22000, 28000)), // litres/day for 5 acres
  };
}

// ── Sugarcane Health (5 acres) ────────────────
export function calculateSugarcaneHealth(moisture) {
  let health;
  if (moisture >= 65 && moisture <= 75) {
    health = 100;
  } else if (moisture < 65) {
    health = Math.max(0, 100 - (65 - moisture) * 3);
  } else {
    health = Math.max(0, 100 - (moisture - 75) * 3);
  }

  let status;
  if (moisture < 50 || moisture > 90) status = 'CRITICAL';
  else if (moisture < 60 || moisture > 80) status = 'STRESSED';
  else status = 'OPTIMAL';

  const growthRate = parseFloat(((health / 100) * 2.5).toFixed(1));

  // 5-acre derived metrics
  const PLANTS_PER_ACRE = 10000;
  const totalPlants     = FARM.LAND_ACRES * PLANTS_PER_ACRE; // 50,000
  const estYieldTonnes  = parseFloat((FARM.LAND_ACRES * (health / 100) * rand(35, 42)).toFixed(1));
  const waterNeedLDay   = Math.round(FARM.LAND_ACRES * 5000); // ~25,000 L/day

  return {
    health:        Math.round(health),
    status,
    growthRate,
    acres:         FARM.LAND_ACRES,
    totalPlants,
    estYieldTonnes,
    waterNeedLDay,
  };
}

// ── Alert generator ───────────────────────────
export function generateAlerts({ moisture, fish, energy, chicken }) {
  const alerts = [];

  if (moisture < 50)
    alerts.push({ type: 'critical', msg: `Moisture Critical: ${parseFloat(moisture).toFixed(1)}%` });
  else if (moisture < 60)
    alerts.push({ type: 'warning', msg: `Moisture Low: ${parseFloat(moisture).toFixed(1)}%` });
  else if (moisture > 80)
    alerts.push({ type: 'warning', msg: `Moisture High: ${parseFloat(moisture).toFixed(1)}%` });

  if (fish && fish.oxygen < 7.0)
    alerts.push({ type: 'critical', msg: `Fish Tank O₂ Critical: ${fish.oxygen} mg/L` });
  else if (fish && fish.oxygen < 7.5)
    alerts.push({ type: 'warning', msg: `Fish Tank O₂ Low: ${fish.oxygen} mg/L` });

  if (energy && energy.battery < 20)
    alerts.push({ type: 'critical', msg: `Battery Critical: ${energy.battery.toFixed(0)}%` });
  else if (energy && energy.battery < 30)
    alerts.push({ type: 'warning', msg: `Battery Low: ${energy.battery.toFixed(0)}%` });

  if (fish && (fish.ph < 6.5 || fish.ph > 7.5))
    alerts.push({ type: 'warning', msg: `Fish pH Out of Range: ${fish.ph}` });

  if (fish && fish.ammonia > 0.04)
    alerts.push({ type: 'warning', msg: `Fish Tank NH₃ High: ${fish.ammonia} mg/L` });

  if (chicken && chicken.layRate < 75)
    alerts.push({ type: 'warning', msg: `Egg Lay Rate Low: ${chicken.layRate}%` });

  if (alerts.length === 0)
    alerts.push({ type: 'ok', msg: 'All Systems Normal ✓' });

  return alerts;
}
