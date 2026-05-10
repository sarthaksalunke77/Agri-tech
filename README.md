# AQUAINTAL – Smart Water Management System
**Integrated Renewable Energy & Smart Water Management**  
*Team AQUAINTAL – SOET (MGM University)*

---

## 🛑 Problem Statement: Energy Crisis on Indian Farms
What every Maharashtra farmer faces today:
- **Power cuts:** 8-14 hrs/day
- **Crop loss:** Crops die during critical stages
- **High expenses:** Rs. 1,03,000/yr on inputs (energy, fertilizer, pesticides)
- **Waste & Pollution:** 27M tonnes of crop residue burned; pollution + loss of Rs. 1,350/month revenue
- **Feed costs:** Rs. 2,500/mo commercial fish feed; Rs. 2,000/mo fodder purchased
- **Water waste:** 75% water wasted via unscientific flood irrigation
- **Resource gap:** Chicken waste falls unused beside the fish tank; upper floors are empty and idle.

**The Waste Crisis – A Buried Goldmine:**
- **350 MT** annual animal waste generated across India (< 30% processed into biogas/compost).
- **45 MT** crop residue generated in Maharashtra/year.
- *The Irony:* Farmers spend Rs. 1,03,000/year on inputs that their own farm waste could provide for FREE. AquaIntel EnergyCore closes this gap completely.

---

## 💡 Proposed Solution: The Five-Layer System Architecture

1. **CAPTURE (L1):** Solar Panels + Wind Tree (VAWT) + Hydro Micro-Turbine + Biogas Plant → 24/7 clean electricity & cooking gas.
2. **STORE (L2):** LFP Battery Bank (24V 50Ah) + Flexible gas storage bladder → Zero downtime energy buffer.
3. **CONVERT (L3):** Co-Digester (cow+chicken 3:1) + Biochar Drum Kiln + Vermicompost bed → Fertiliser, biochar, biogas from waste.
4. **DISTRIBUTE (L4):** Smart Energy Router (ESP32) + IoT valve controllers → Right energy to right load, millisecond auto-optimised.
5. **MONITOR (L5):** IoT sensors + Edge AI (Raspberry Pi 4) + React Dashboard + GSM SIM800L → Real-time alerts, analytics, control.

---

## ⚙️ Key Innovations

### 1. Wind Tree (VAWT) - 24/7 Power Guarantee
- **Min wind speed:** ≈ 9–11 km/h (vs Traditional 12–15 km/h)
- **Works at night:** Yes — more consistent
- **Land footprint:** 2.5 ~ 3 sq ft only
- **Noise level:** < 30-45 dB (vs Traditional 70–80 dB)
- **Farm install cost:** Rs. 60K ~ 1.2L (vs Traditional Rs. 5–10 Lakh)
- *Triple Hybrid Energy:* Day (Solar + Wind), Night (Wind + Hydro), Rain (Wind + Hydro Max).

### 2. Co-Digestion Biogas (3:1)
Combining cow dung and chicken waste (3:1 ratio) increases biogas yield from 48 L/day to 72 L/day (+40%). Enhances slurry NPK value significantly.

### 3. Biochar Kiln & Gomutra Auto-Spray
- **Biochar Kiln:** Pyrolysis of crop residue at 300–600°C. Stores carbon 1,000+ years. Increases soil water retention (+20–30%) and microbial activity. Sequesters ~2kg CO₂/10kg straw. Generates Rs. 1,350/month revenue.
- **Gomutra Auto-Spray System:** V-channel floor → 100L HDPE gravity tank. 3-stage filter. 30-day ferment. Auto 1:10 dilution before spray triggered by IoT pest sensor. Replaces Rs. 2,000/month pesticides.

### 4. Smart Energy Router (ESP32 / IoT)
Millisecond load balancing across four energy sources:
- *Solar peak + battery full* → Divert to kiln / heater
- *Night, low wind, 40% battery* → Activate biogas genset
- *Rainy day* → Prioritise hydro, solar standby
- *Battery < 20%* → Shed LEDs, protect fish pump
- *Biogas overpressure* → Auto relief valve + alert

---

## 💻 Technology Stack
- **Firmware:** ESP32-S3 x 3 (Sensor Reading, Relay control, gas safety monitoring) via C++/Arduino.
- **Edge AI:** Raspberry Pi 4 (Fish Behavior AI + Energy optimization decision model) via Python + TensorFlow Lite.
- **Energy Router:** Custom C state machine on ESP32 for millisecond load balancing.
- **Data Pipeline:** Node.js backend.
- **Dashboard:** React.js for visual monitoring.
- **Mobile Alerts:** GSM SIM800L + AT commands + Twilio fallback (works without internet).
- **External Integrations:** MQTT Breaker, OpenWeatherMap API (Forecast driven scheduling).

---

## 💰 Financial Impact
**Rs. 45,000/month benefit | 2-month payback | 10-year gain: 53 Lakh**

| Monthly Savings (Costs Eliminated) | Monthly New Revenue Streams |
| :--- | :--- |
| Grid electricity (pumps): Rs. 2,000 | Fish sales: Rs. 5,000 |
| LPG / firewood: Rs. 1,100 | Eggs: Rs. 1,200 |
| Diesel generator: Rs. 2,500 | Milk (1 cow): Rs. 15,000 |
| Chemical fertiliser: Rs. 3,200 | Soil crops: Rs. 4,000 |
| Chemical pesticides: Rs. 2,000 | Biochar sales: Rs. 1,350 |
| Commercial fish feed: Rs. 2,500 | Slurry sales: Rs. 1,600 |
| Fodder purchase: Rs. 2,000 | Carbon credits: Rs. 900 |
| Waste disposal: Rs. 700 | Vermicompost: Rs. 800 |
| **Total Savings: Rs. 16,000/mo** | **Total Revenue: Rs. 29,850/mo** |

*Implementation Cost:* A 5-acre setup ranges from ₹1.68L – ₹1.96L, reducing to ₹84,000 – ₹98,200 (50% post-subsidy via PM-KUSUM, NBMMP, and RKVY schemes).

---

## 📚 Literature Review & Scientific Validation
- **Fish Behavior AI:** [AI-Driven Monitoring for Welfare](https://pmc.ncbi.nlm.nih.gov/articles/PMC12527044/)
- **Poultry-Fish Loop:** [Waste as Potential Fish Feed](https://ijirt.org/publishedpaper/IJIRT162128_PAPER.pdf)
- **Biogas Yield:** [Enhancing Production via Co-digestion](https://www.scirp.org/journal/paperinformation?paperid=86893)
- **Hydroponic Fodder:** [Growth Performance of Maize Fodder](https://researcherslinks.com/nexus_uploads/files/JAHP_6_2_73-76.pdf)
- **Biochar Stability:** [Durability & 1000-Year Sequestration](https://carbonherald.com/research-shows-biochar-may-be-durable-for-more-than-1000-years/)
