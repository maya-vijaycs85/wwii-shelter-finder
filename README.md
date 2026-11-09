# 🇬🇧 WWII London Blitz Air Raid Shelter Finder (1940)

**A Year 6 History & Computing Pair-Programming Project**

> *"What if smartphone technology and GPS existed during World War 2?"*

This interactive web app models how modern mapping, real-time algorithms, and smart audio alerts could have saved civilian lives during the **London Blitz (1940–1941)**.

---

## 🚀 How to Run the App
You can open this project immediately on any computer:
1. Open the folder `wwii-shelter-finder`.
2. Double-click **`index.html`** to open it in Google Chrome, Safari, Firefox, or Edge.
3. No installations or internet connection required—everything runs offline!

---

## 🎯 Key Features Included

### 1. Interactive 1940s London Blitz Map
- Features historical landmarks (St Paul’s Cathedral, Big Ben, Tower Bridge, Camden, East End Docks) and the River Thames.
- Click anywhere on the map to move your **"Citizen Pin"**.
- A live **Walking Route Line** dynamically attaches from your position to the closest air raid shelter.

### 2. "Find Nearest Shelter Now" Distance Calculator
- Uses **Pythagoras' Theorem** ($\text{distance} = \sqrt{\Delta x^2 + \Delta y^2}$) to calculate the exact distance in meters and yards to all 8 wartime shelters.
- Measures realistic brisk walking evacuation times at $75\text{ m/min}$.
- Automatically flags shelters with available capacities.

### 3. "Blackout Mode" (Dim Screen Toggle)
- In WWII Britain, the government enforced a strict **Blackout**: street lights were extinguished, car headlights were masked, and windows had heavy blackout curtains so German Luftwaffe bombers couldn't spot towns from above.
- The **Blackout Mode** button dims the screen and switches to night-vision radar tones, preventing light spill while navigating in the dark.

### 4. Authentic Web Audio Air Raid Siren & Searchlights
- Built using the browser's native **Web Audio API** synthesizer (no audio files needed!).
- **Red Alert Siren:** Generates the rising and falling $320\text{ Hz} \leftrightarrow 640\text{ Hz}$ wavering air raid horn and activates animated searchlight beams across the sky.
- **All Clear:** Sounds the steady $440\text{ Hz}$ continuous tone signaling that bombers have left.

### 5. 1940s Evacuation Checklist (Interactive)
- Every British citizen was issued a cardboard gas mask box and identity card.
- An interactive packing checklist tracks your readiness (Gas mask, National ID card, Ration book, Blackout torch, Wool blanket, ARP whistle).

### 6. Historical Shelter Dossiers
Click on any shelter on the map or in the directory to inspect its historical specifications:
- **London Underground Stations (Tube):** Deep-level platforms like *Aldwych* and *Bethnal Green* that protected thousands of families overnight.
- **Anderson Shelters:** Curved corrugated galvanized iron sheets half-buried in garden soil.
- **Morrison Shelters:** Heavy steel cage table shelters inside homes without gardens.
- **Public Trench Shelters:** Slit trenches dug in public parks like Hyde Park and Lincoln's Inn Fields.

---

## 📚 Explaining Your Project to Your Teacher & Class

### The History Connection (WWII Blitz):
- Between September 1940 and May 1941, London was bombed for **57 consecutive nights**.
- People often got caught out in the dark during the Blackout and didn't know which shelters had room or where the closest deep shelter was.
- Having this technology on hand would have prevented stampedes, reduced casualties, and kept families together.

### The Computing Connection (Algorithms & Coding):
1. **Coordinates:** The map is an 800 × 500 coordinate grid, just like a mathematical cartesian plane.
2. **Algorithms:** When you click the map, JavaScript runs through a loop of all shelters, calculates the straight-line hypotenuse distance, and sorts them from smallest to largest (`array.sort()`).
3. **Sound Synthesis:** Instead of downloading huge audio files, code generates mathematical sound waves directly using frequency oscillators.
