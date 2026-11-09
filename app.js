/**
 * 1940s London Blitz Air Raid Shelter Finder
 * Year 6 History & Computing Project
 *
 * Implements:
 * 1. 1940s London Shelter Directory & Realistic Coordinates
 * 2. Euclidean Distance & Sorting Algorithm (Pythagoras' Theorem)
 * 3. Interactive SVG Sector Map with Dynamic Route Line
 * 4. Web Audio API Air Raid Siren & All-Clear Sound Generator
 * 5. Evacuation Walk Timer & Blackout Mode Toggle
 * 6. Historical Shelter Dossiers & Wartime Kit Checklist
 */

// 1. WWII London Shelter Database
const SHELTERS = [
  {
    id: "aldwych",
    name: "Aldwych Underground Station",
    type: "Tube Station",
    typeClass: "type-tube",
    x: 370,
    y: 275,
    capacityTotal: 1500,
    capacityOccupied: 1120,
    depth: "40 feet (12 meters) underground",
    protection: "Maximum (Deep subterranean bomb-proof bedrock)",
    history: "During the Blitz, the Piccadilly line branch between Holborn and Aldwych was closed to trains and transformed into one of London's safest air raid shelters. It even had its own library, first aid post, and sheltered Elgin Marbles from the British Museum!"
  },
  {
    id: "bethnal-green",
    name: "Bethnal Green Underground Shelter",
    type: "Tube Station",
    typeClass: "type-tube",
    x: 680,
    y: 165,
    capacityTotal: 7000,
    capacityOccupied: 5850,
    depth: "35 feet (11 meters) underground",
    protection: "Maximum (Deep Central Line platform)",
    history: "The unfinished Central Line extension at Bethnal Green became a subterranean village during the Blitz. Up to 7,000 East Londoners slept here every night with bunk beds, hot cocoa canteens, and a 200-bed hospital."
  },
  {
    id: "chancery-lane",
    name: "Chancery Lane Deep Level Shelter",
    type: "Tube Station",
    typeClass: "type-tube",
    x: 440,
    y: 195,
    capacityTotal: 4000,
    capacityOccupied: 2900,
    depth: "100 feet (30 meters) deep",
    protection: "Maximum (Heavy subterranean bomb protection)",
    history: "Constructed deep under Chancery Lane as one of eight purpose-built deep-level shelters. Later in the war, it served as an underground fortress and communication hub for General Eisenhower."
  },
  {
    id: "lincolns-inn",
    name: "Lincoln's Inn Fields Public Trench Shelter",
    type: "Public Trench & Street",
    typeClass: "type-public",
    x: 385,
    y: 215,
    capacityTotal: 450,
    capacityOccupied: 390,
    depth: "8 feet (2.5 meters) below ground",
    protection: "Medium (Brick & reinforced concrete trench with turf roof)",
    history: "Dug into London's largest public square in 1939. Provides quick cover for workers caught on the streets when the daylight sirens wail. Guards against blast and flying shrapnel, but vulnerable to a direct bomb strike."
  },
  {
    id: "hyde-park",
    name: "Hyde Park Trench Shelters (Sector West)",
    type: "Public Trench & Street",
    typeClass: "type-public",
    x: 120,
    y: 245,
    capacityTotal: 1200,
    capacityOccupied: 650,
    depth: "7 feet (2 meters) below grass level",
    protection: "Medium (Corrugated steel & earthen mound)",
    history: "Zig-zag slit trenches dug into the royal park lawns to stop bomb shockwaves from traveling down the tunnels. Stationed near the anti-aircraft gun batteries defending central London."
  },
  {
    id: "stepney-anderson",
    name: "Stepney Green Back-Garden Anderson Shelter",
    type: "Anderson Shelter",
    typeClass: "type-anderson",
    x: 640,
    y: 250,
    capacityTotal: 6,
    capacityOccupied: 4,
    depth: "3 feet into earth + 1.5 ft soil cover",
    protection: "High Blast Protection (Curved corrugated iron)",
    history: "Designed by Sir John Anderson in 1938. Over 1.5 million were issued free to poor British families. Built in back gardens and covered with 18 inches of earth, many families planted vegetables like carrots on top to 'Dig for Victory'!"
  },
  {
    id: "camden-anderson",
    name: "Camden Mews Community Anderson Post",
    type: "Anderson Shelter",
    typeClass: "type-anderson",
    x: 270,
    y: 95,
    capacityTotal: 8,
    capacityOccupied: 5,
    depth: "3.5 feet excavated earth",
    protection: "High Blast Protection",
    history: "Shared by two neighbouring railway families in Camden. Inside were wooden bunk beds, paraffin lamps, and a heavy wooden door baffle to protect from high-explosive flying glass."
  },
  {
    id: "city-road-morrison",
    name: "City Road Tenement Morrison Cage Shelter",
    type: "Morrison Shelter",
    typeClass: "type-morrison",
    x: 520,
    y: 110,
    capacityTotal: 4,
    capacityOccupied: 2,
    depth: "Indoor ground floor",
    protection: "Debris & House Collapse Protection (Heavy steel plate table)",
    history: "Named after Minister of Home Security Herbert Morrison. Issued for homes without gardens. Built like a strong steel table with wire mesh sides—if the house collapsed from a bomb blast, people inside the table remained uncrushed!"
  }
];

// Landmark reference coordinates for quick-jumping
const LANDMARKS = {
  "st-pauls": { x: 475, y: 232, name: "St Paul’s Cathedral" },
  "westminster": { x: 262, y: 342, name: "Big Ben & Westminster" },
  "trafalgar": { x: 310, y: 260, name: "Trafalgar Square" },
  "east-end": { x: 675, y: 190, name: "Bethnal Green & East End" },
  "camden": { x: 255, y: 80, name: "Camden Town" },
  "southbank": { x: 380, y: 340, name: "Waterloo & South Bank" }
};

// 2. Application State
const state = {
  citizen: { x: 475, y: 232 }, // Default: St Paul's Cathedral
  activeFilter: "all",
  sortedShelters: [],
  nearestShelter: null,
  timerSeconds: 0,
  timerInterval: null,
  isTimerRunning: false,
  isSirenAlertActive: false,
  audioCtx: null
};

// Scale factor: 1 SVG map unit = ~4 meters in real London
const METERS_PER_MAP_UNIT = 4;
// Average brisk wartime walking speed in meters per minute (approx 75m/min)
const METERS_PER_MINUTE = 75;

// 3. Mathematical Distance Function (Pythagoras' Theorem)
function calculateDistanceMeters(p1, p2) {
  const dx = (p2.x - p1.x) * METERS_PER_MAP_UNIT;
  const dy = (p2.y - p1.y) * METERS_PER_MAP_UNIT;
  return Math.round(Math.hypot(dx, dy));
}

// 4. Update and Sort Shelters by Distance
function updateShelterDistances() {
  state.sortedShelters = SHELTERS.map(shelter => {
    const distanceMeters = calculateDistanceMeters(state.citizen, shelter);
    const yards = Math.round(distanceMeters * 1.09361);
    const walkingMinutes = distanceMeters / METERS_PER_MINUTE;
    const totalSeconds = Math.round(walkingMinutes * 60);

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const timeFormatted = mins > 0 ? `${mins} min${mins > 1 ? 's' : ''} ${secs} sec${secs !== 1 ? 's' : ''}` : `${secs} secs`;

    const spacesLeft = shelter.capacityTotal - shelter.capacityOccupied;

    return {
      ...shelter,
      distanceMeters,
      yards,
      totalSeconds,
      timeFormatted,
      spacesLeft
    };
  });

  // Sort closest first
  state.sortedShelters.sort((a, b) => a.distanceMeters - b.distanceMeters);

  // Identify nearest available
  state.nearestShelter = state.sortedShelters[0];
}

// 5. Render & Update SVG Markers on Map (Persistent DOM to prevent hover glitches)
function renderMapMarkers() {
  const container = document.getElementById("shelter-markers-layer");
  if (!container) return;

  // Initialize once if empty so DOM nodes are not destroyed on every refresh
  if (container.children.length === 0) {
    SHELTERS.forEach(shelter => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", `shelter-marker-group ${shelter.typeClass}`);
      g.setAttribute("id", `marker-${shelter.id}`);
      g.setAttribute("transform", `translate(${shelter.x}, ${shelter.y})`);
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");

      // Outer circle
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("r", "8");
      circle.setAttribute("class", "shelter-circle");

      // Center icon dot
      const innerDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      innerDot.setAttribute("r", "2.5");
      innerDot.setAttribute("fill", "#ffffff");

      // Text label
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "12");
      text.setAttribute("y", "4");
      text.setAttribute("class", "shelter-marker-label");
      text.textContent = shelter.name;

      g.appendChild(circle);
      g.appendChild(innerDot);
      g.appendChild(text);

      // Click handler to open dossier
      const openDossier = (e) => {
        e.stopPropagation();
        showShelterModal(shelter.id);
      };
      g.addEventListener("click", openDossier);
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDossier(e);
        }
      });

      container.appendChild(g);
    });
  }

  // Update dynamic nearest classes and accessibility attributes without destroying nodes
  state.sortedShelters.forEach(shelter => {
    const g = document.getElementById(`marker-${shelter.id}`);
    if (g) {
      const isNearest = state.nearestShelter && shelter.id === state.nearestShelter.id;
      g.classList.toggle("is-nearest", isNearest);
      g.setAttribute("aria-label", `${shelter.name}: ${shelter.distanceMeters} meters away${isNearest ? ' (Nearest shelter)' : ''}`);
      const circle = g.querySelector(".shelter-circle");
      if (circle) {
        circle.setAttribute("r", isNearest ? "11" : "8");
      }
    }
  });
}

// 6. Draw Route Line from Citizen to Nearest Shelter
function updateRouteLine() {
  const line = document.getElementById("route-line");
  const lineShadow = document.getElementById("route-line-shadow");
  if (!line || !state.nearestShelter) return;

  const target = state.nearestShelter;

  line.setAttribute("x1", state.citizen.x);
  line.setAttribute("y1", state.citizen.y);
  line.setAttribute("x2", target.x);
  line.setAttribute("y2", target.y);

  if (lineShadow) {
    lineShadow.setAttribute("x1", state.citizen.x);
    lineShadow.setAttribute("y1", state.citizen.y);
    lineShadow.setAttribute("x2", target.x);
    lineShadow.setAttribute("y2", target.y);
  }
}

// 7. Update Citizen Pin Position
function updateCitizenMarker() {
  const marker = document.getElementById("citizen-marker");
  if (marker) {
    marker.setAttribute("transform", `translate(${state.citizen.x}, ${state.citizen.y})`);
  }
}

// 8. Update Dashboard and Evacuation Timer
function updateDashboard() {
  const nearest = state.nearestShelter;
  if (!nearest) return;

  const heading = document.getElementById("route-dashboard-heading");
  const desc = document.getElementById("route-shelter-desc");
  const metricDist = document.getElementById("metric-distance");
  const metricTime = document.getElementById("metric-time");
  const metricCap = document.getElementById("metric-capacity");

  if (heading) heading.textContent = nearest.name;
  if (desc) desc.textContent = `${nearest.type} • ${nearest.depth}`;
  if (metricDist) metricDist.textContent = `${nearest.distanceMeters} m (${nearest.yards} yds)`;
  if (metricTime) metricTime.textContent = nearest.timeFormatted;
  if (metricCap) metricCap.textContent = `${nearest.spacesLeft.toLocaleString()} / ${nearest.capacityTotal.toLocaleString()} spaces left`;

  // Update timer target seconds
  if (!state.isTimerRunning) {
    state.timerSeconds = nearest.totalSeconds;
    renderCountdownDisplay();
  }
}

// 9. Render Shelter Directory List
function renderShelterList() {
  const list = document.getElementById("shelter-list");
  if (!list) return;

  list.innerHTML = "";

  const filtered = state.sortedShelters.filter(s => {
    if (state.activeFilter === "all") return true;
    return s.type === state.activeFilter;
  });

  filtered.forEach((shelter, idx) => {
    const isClosest = idx === 0;

    const li = document.createElement("li");
    li.className = `shelter-item ${isClosest ? "is-closest" : ""}`;
    li.setAttribute("tabindex", "0");
    li.setAttribute("role", "button");
    li.setAttribute("aria-label", `${shelter.name}, ${shelter.distanceMeters} meters away. Press to view dossier.`);

    li.innerHTML = `
      <div class="shelter-item-top">
        <h3 class="shelter-item-title">${isClosest ? '★ ' : ''}${shelter.name}</h3>
        <span class="shelter-distance-tag">${shelter.distanceMeters} m</span>
      </div>
      <div class="shelter-item-sub">
        <span class="shelter-type-pill">${shelter.type}</span>
        <span>${shelter.spacesLeft} spaces • ~${shelter.timeFormatted}</span>
      </div>
      <button type="button" class="shelter-dossier-btn" data-id="${shelter.id}">Inspect Shelter Dossier &rarr;</button>
    `;

    const openDetails = () => showShelterModal(shelter.id);
    li.addEventListener("click", openDetails);
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetails();
      }
    });

    list.appendChild(li);
  });
}

// 10. Recalculate Entire App State
function refreshAll() {
  updateShelterDistances();
  updateCitizenMarker();
  updateRouteLine();
  renderMapMarkers();
  updateDashboard();
  renderShelterList();
}

// 11. Evacuation Timer Controller
function renderCountdownDisplay() {
  const display = document.getElementById("countdown-display");
  if (!display) return;
  const m = Math.floor(state.timerSeconds / 60);
  const s = state.timerSeconds % 60;
  display.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function startTimer() {
  if (state.isTimerRunning) return;
  if (state.timerSeconds <= 0) {
    state.timerSeconds = state.nearestShelter ? state.nearestShelter.totalSeconds : 180;
  }

  state.isTimerRunning = true;
  const btn = document.getElementById("start-timer-btn");
  if (btn) btn.textContent = "Pause Walk Timer";

  state.timerInterval = setInterval(() => {
    if (state.timerSeconds > 0) {
      state.timerSeconds--;
      renderCountdownDisplay();
    } else {
      clearInterval(state.timerInterval);
      state.isTimerRunning = false;
      if (btn) btn.textContent = "You Have Reached Shelter!";
      const caption = document.getElementById("timer-caption");
      if (caption) caption.textContent = "Safe inside the shelter! Keep your gas mask close.";
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(state.timerInterval);
  state.isTimerRunning = false;
  state.timerSeconds = state.nearestShelter ? state.nearestShelter.totalSeconds : 180;
  renderCountdownDisplay();
  const btn = document.getElementById("start-timer-btn");
  if (btn) btn.textContent = "Start Walk Timer";
  const caption = document.getElementById("timer-caption");
  if (caption) caption.textContent = "Walk briskly — do not run in the Blackout!";
}

// 12. Web Audio API Wartime Air Raid Siren Synthesizer
function getAudioContext() {
  if (!state.audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      state.audioCtx = new AudioContextClass();
    }
  }
  if (state.audioCtx && state.audioCtx.state === "suspended") {
    state.audioCtx.resume();
  }
  return state.audioCtx;
}

let sirenOscillator = null;
let sirenGain = null;

function toggleAirRaidSiren() {
  const ctx = getAudioContext();
  const btn = document.getElementById("siren-toggle-btn");
  const btnText = document.getElementById("siren-btn-text");
  const banner = document.getElementById("raid-status-banner");
  const badge = document.getElementById("status-badge");
  const message = document.getElementById("status-message");
  const searchlights = document.getElementById("searchlights-layer");

  if (!state.isSirenAlertActive) {
    // Turn Siren ON (Alert mode)
    state.isSirenAlertActive = true;
    btn.setAttribute("aria-pressed", "true");
    btnText.textContent = "Sound 'All Clear' Siren";

    banner.classList.add("alert-active");
    badge.textContent = "RED ALERT: AIR RAID WARNING";
    message.innerHTML = `<strong>HEAVY BOMBERS DETECTED OVER LONDON!</strong> Proceed immediately to <strong>${state.nearestShelter.name}</strong> (${state.nearestShelter.timeFormatted} walk).`;

    if (searchlights) searchlights.classList.add("active");

    // Audio: Realistic 1940s rising/falling air raid wail
    if (ctx) {
      sirenOscillator = ctx.createOscillator();
      sirenGain = ctx.createGain();

      sirenOscillator.type = "sawtooth";
      sirenGain.gain.setValueAtTime(0.12, ctx.currentTime);

      // Low-pass filter to give authentic vintage horn quality
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(950, ctx.currentTime);

      sirenOscillator.connect(filter);
      filter.connect(sirenGain);
      sirenGain.connect(ctx.destination);

      // Pitch undulating every 4 seconds between 320 Hz and 640 Hz
      const now = ctx.currentTime;
      for (let i = 0; i < 20; i++) {
        const t = now + (i * 4);
        sirenOscillator.frequency.setValueAtTime(320, t);
        sirenOscillator.frequency.exponentialRampToValueAtTime(640, t + 2);
        sirenOscillator.frequency.exponentialRampToValueAtTime(320, t + 4);
      }
      sirenOscillator.start(now);
    }

    // Auto-start evacuation walk timer
    startTimer();
  } else {
    // Sound "All Clear" steady continuous tone
    state.isSirenAlertActive = false;
    btn.setAttribute("aria-pressed", "false");
    btnText.textContent = "Sound Air Raid Siren";

    banner.classList.remove("alert-active");
    badge.textContent = "ALL CLEAR";
    message.textContent = "The raid has passed. Air Raid Wardens signal it is safe to emerge from your shelters.";

    if (searchlights) searchlights.classList.remove("active");

    // Stop alert oscillator
    if (sirenOscillator) {
      try {
        sirenOscillator.stop();
        sirenOscillator.disconnect();
      } catch (e) {}
    }

    // Play steady 440Hz "All Clear" tone for 4 seconds
    if (ctx) {
      const allClearOsc = ctx.createOscillator();
      const allClearGain = ctx.createGain();
      allClearOsc.type = "sawtooth";
      allClearOsc.frequency.setValueAtTime(440, ctx.currentTime); // Steady pitch
      allClearGain.gain.setValueAtTime(0.09, ctx.currentTime);
      allClearGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

      allClearOsc.connect(allClearGain);
      allClearGain.connect(ctx.destination);
      allClearOsc.start();
      allClearOsc.stop(ctx.currentTime + 4);
    }
  }
}

// 13. Blackout Mode Toggle (Respecting modern-web-guidance dark-mode-toggle)
function toggleBlackoutMode() {
  const meta = document.querySelector('meta[name="color-scheme"]');
  const currentScheme = meta ? meta.content : "light dark";

  // Check resolved color scheme
  const isDark = currentScheme === "dark" || (currentScheme === "light dark" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const nextTarget = isDark ? "light" : "dark";

  if (meta) {
    meta.content = nextTarget;
  }
  try {
    localStorage.setItem("color-scheme", nextTarget);
  } catch (e) {}
}

// 14. Shelter Modal Dossier
function showShelterModal(shelterId) {
  const shelter = SHELTERS.find(s => s.id === shelterId);
  const modal = document.getElementById("shelter-modal");
  if (!shelter || !modal) return;

  document.getElementById("modal-shelter-title").textContent = shelter.name;
  document.getElementById("modal-shelter-type").textContent = `SHELTER DOSSIER • ${shelter.type.toUpperCase()}`;
  document.getElementById("modal-shelter-history").textContent = shelter.history;
  document.getElementById("modal-shelter-protection").textContent = shelter.protection;
  document.getElementById("modal-shelter-depth").textContent = shelter.depth;
  document.getElementById("modal-shelter-fact").textContent = `Capacity: ${shelter.capacityTotal.toLocaleString()} people (${shelter.capacityTotal - shelter.capacityOccupied} currently unoccupied).`;

  modal.showModal();
}

// 15. Wartime Checklist Counter
function updateKitProgress() {
  const checkboxes = document.querySelectorAll(".kit-checkbox");
  const progress = document.getElementById("kit-progress");
  const label = document.getElementById("kit-progress-label");
  if (!progress || !label) return;

  let checkedCount = 0;
  checkboxes.forEach(cb => {
    if (cb.checked) checkedCount++;
  });

  progress.value = checkedCount;
  label.textContent = `Kit Readiness: ${checkedCount} of ${checkboxes.length} packed`;

  if (checkedCount === checkboxes.length) {
    label.innerHTML = `<strong>All 6 Items Packed!</strong> Ready to take cover.`;
  }
}

// 16. Initialize Application and Event Handlers
document.addEventListener("DOMContentLoaded", () => {
  // SVG Map Click Interaction: Move Citizen & Recalculate
  const mapSvg = document.getElementById("london-map");
  if (mapSvg) {
    mapSvg.addEventListener("click", (e) => {
      // If clicking directly on a shelter marker group, do not move the citizen pin
      if (e.target.closest(".shelter-marker-group")) {
        return;
      }
      const rect = mapSvg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Convert screen pixels to SVG viewBox (800x500)
      const svgX = Math.round((clickX / rect.width) * 800);
      const svgY = Math.round((clickY / rect.height) * 500);

      // Clamp inside map boundaries
      state.citizen.x = Math.max(20, Math.min(780, svgX));
      state.citizen.y = Math.max(20, Math.min(480, svgY));

      refreshAll();
    });
  }

  // Find Nearest Button
  const findNearestBtn = document.getElementById("find-nearest-btn");
  if (findNearestBtn) {
    findNearestBtn.addEventListener("click", () => {
      refreshAll();
      const banner = document.getElementById("raid-status-banner");
      if (banner && !state.isSirenAlertActive) {
        banner.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Siren Alert Toggle Button
  const sirenBtn = document.getElementById("siren-toggle-btn");
  if (sirenBtn) {
    sirenBtn.addEventListener("click", toggleAirRaidSiren);
  }

  // Blackout Mode Toggle Button
  const blackoutBtn = document.getElementById("blackout-toggle-btn");
  if (blackoutBtn) {
    blackoutBtn.addEventListener("click", toggleBlackoutMode);
  }

  // Map Zoom Toggle Button
  const zoomBtn = document.getElementById("map-zoom-toggle");
  const mapFrame = document.querySelector(".map-frame");
  const zoomLabel = document.getElementById("zoom-btn-label");
  if (zoomBtn && mapFrame) {
    zoomBtn.addEventListener("click", () => {
      const isZoomed = mapFrame.classList.toggle("is-zoomed");
      zoomBtn.setAttribute("aria-pressed", isZoomed ? "true" : "false");
      if (zoomLabel) {
        zoomLabel.textContent = isZoomed ? "Fit to Screen" : "Zoom In & Pan";
      }
      if (isZoomed) {
        // Center the view on citizen position
        mapFrame.scrollLeft = Math.max(0, state.citizen.x - 180);
      }
    });
  }

  // Landmark Jump Dropdown
  const landmarkSelect = document.getElementById("landmark-select");
  if (landmarkSelect) {
    landmarkSelect.addEventListener("change", (e) => {
      const loc = LANDMARKS[e.target.value];
      if (loc) {
        state.citizen.x = loc.x;
        state.citizen.y = loc.y;
        refreshAll();
      }
    });
  }

  // Shelter Type Filter
  const filterSelect = document.getElementById("shelter-type-filter");
  if (filterSelect) {
    filterSelect.addEventListener("change", (e) => {
      state.activeFilter = e.target.value;
      renderShelterList();
    });
  }

  // Timer Buttons
  const startTimerBtn = document.getElementById("start-timer-btn");
  if (startTimerBtn) {
    startTimerBtn.addEventListener("click", () => {
      if (state.isTimerRunning) {
        clearInterval(state.timerInterval);
        state.isTimerRunning = false;
        startTimerBtn.textContent = "Resume Walk Timer";
      } else {
        startTimer();
      }
    });
  }

  const resetTimerBtn = document.getElementById("reset-timer-btn");
  if (resetTimerBtn) {
    resetTimerBtn.addEventListener("click", resetTimer);
  }

  // Project Guide Modal Button
  const guideBtn = document.getElementById("project-guide-btn");
  const guideModal = document.getElementById("project-guide-modal");
  if (guideBtn && guideModal) {
    guideBtn.addEventListener("click", () => guideModal.showModal());
  }

  // Checklist Checkboxes
  const checkboxes = document.querySelectorAll(".kit-checkbox");
  checkboxes.forEach(cb => cb.addEventListener("change", updateKitProgress));
  updateKitProgress();

  // Initial Calculation and Render
  refreshAll();
});
