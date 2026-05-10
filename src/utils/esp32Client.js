// ─────────────────────────────────────────────
//  esp32Client.js – Fetch real sensor data
// ─────────────────────────────────────────────

// Default ESP32 IP – change via Settings panel
let ESP32_IP = localStorage.getItem('esp32_ip') || '192.168.1.100';

export const setESP32IP = (ip) => {
  ESP32_IP = ip;
  localStorage.setItem('esp32_ip', ip);
};

export const getESP32IP = () => ESP32_IP;

/**
 * Fetch sensor data from ESP32.
 * Returns: { moisture, pumpStatus, timestamp } or null on error.
 */
export async function fetchESP32Data() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`http://${ESP32_IP}/data`, {
      signal: controller.signal,
      cache:  'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    return {
      moisture:    Number(data.moisture)   || 0,
      pumpStatus:  Boolean(data.pumpStatus),
      timestamp:   data.timestamp          || Date.now(),
      connected:   true,
    };
  } catch {
    return null; // caller falls back to simulated data
  }
}

/**
 * Send pump override command to ESP32.
 */
export async function sendPumpCommand(state) {
  try {
    const res = await fetch(`http://${ESP32_IP}/pump`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ pump: state }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
