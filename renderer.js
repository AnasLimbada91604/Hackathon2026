const heartRateEl = document.getElementById("heartRate");
const spo2El = document.getElementById("spo2");
const piEl = document.getElementById("pi");
const motionEl = document.getElementById("motion");
const batteryEl = document.getElementById("battery");
const lastUpdatedEl = document.getElementById("lastUpdated");
const triageEl = document.getElementById("triageStatus");
const alertBannerEl = document.getElementById("alertBanner");
const mainPatientNameEl = document.getElementById("mainPatientName");

const patientButtons = document.querySelectorAll(".patient-item");

const patients = {
  A: { name: "Patient A", battery: 98, mode: "normal" },
  B: { name: "Patient B", battery: 87, mode: "warning" },
  C: { name: "Patient C", battery: 74, mode: "critical" },
  D: { name: "Patient D", battery: 91, mode: "normal" }
};

let selectedPatient = "A";

function formatTime() {
  return new Date().toLocaleTimeString();
}

function getTriage(hr, spo2) {
  if (spo2 < 90 || hr > 130 || hr < 45) return "red";
  if (spo2 < 95 || hr > 110 || hr < 55) return "yellow";
  return "green";
}

function updateMainCard(hr, spo2, pi, motion, batteryLevel) {
  heartRateEl.innerHTML = `${hr} <span>BPM</span>`;
  spo2El.innerHTML = `${spo2} <span>%</span>`;
  piEl.textContent = pi.toFixed(1);
  motionEl.textContent = motion;
  batteryEl.textContent = `${batteryLevel}%`;
  lastUpdatedEl.textContent = formatTime();

  const triage = getTriage(hr, spo2);

  triageEl.className = "triage-badge";
  alertBannerEl.className = "alert-banner";

  if (triage === "red") {
    triageEl.classList.add("triage-red");
    triageEl.textContent = "RED - Immediate";
    alertBannerEl.classList.add("alert-critical");
    alertBannerEl.textContent = "Critical alert: responder attention needed now";
  } else if (triage === "yellow") {
    triageEl.classList.add("triage-yellow");
    triageEl.textContent = "YELLOW - Delayed";
    alertBannerEl.textContent = "Warning: patient vitals need closer monitoring";
  } else {
    triageEl.classList.add("triage-green");
    triageEl.textContent = "GREEN - Minor";
    alertBannerEl.textContent = "No active critical alerts";
  }
}

function generateVitals(mode) {
  let hr, spo2, pi, motion;

  if (mode === "critical") {
    hr = Math.floor(Math.random() * 25) + 120;
    spo2 = Math.floor(Math.random() * 5) + 85;
    pi = Math.random() * 1.2 + 0.6;
    motion = Math.random() > 0.5 ? "Movement detected" : "Unstable";
  } else if (mode === "warning") {
    hr = Math.floor(Math.random() * 20) + 95;
    spo2 = Math.floor(Math.random() * 4) + 91;
    pi = Math.random() * 1.5 + 1.3;
    motion = Math.random() > 0.7 ? "Movement detected" : "Stable";
  } else {
    hr = Math.floor(Math.random() * 25) + 70;
    spo2 = Math.floor(Math.random() * 4) + 96;
    pi = Math.random() * 2 + 2.0;
    motion = Math.random() > 0.82 ? "Movement detected" : "Stable";
  }

  return { hr, spo2, pi, motion };
}

function updateSidebarBadge(button, triage) {
  const badge = button.querySelector(".mini-triage");
  badge.className = "mini-triage";

  if (triage === "red") {
    badge.classList.add("triage-red-lite");
    badge.textContent = "RED";
  } else if (triage === "yellow") {
    badge.classList.add("triage-yellow-lite");
    badge.textContent = "YELLOW";
  } else {
    badge.classList.add("triage-green-lite");
    badge.textContent = "GREEN";
  }
}

function tickAllPatients() {
  patientButtons.forEach((button) => {
    const key = button.dataset.patient;
    const patient = patients[key];

    patient.battery = Math.max(20, patient.battery - 0.05);

    const vitals = generateVitals(patient.mode);
    patient.latest = vitals;

    const triage = getTriage(vitals.hr, vitals.spo2);
    updateSidebarBadge(button, triage);

    if (key === selectedPatient) {
      mainPatientNameEl.textContent = patient.name;
      updateMainCard(
        vitals.hr,
        vitals.spo2,
        vitals.pi,
        vitals.motion,
        Math.floor(patient.battery)
      );
    }
  });
}

patientButtons.forEach((button) => {
  button.addEventListener("click", () => {
    patientButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    selectedPatient = button.dataset.patient;

    const patient = patients[selectedPatient];
    mainPatientNameEl.textContent = patient.name;

    if (patient.latest) {
      updateMainCard(
        patient.latest.hr,
        patient.latest.spo2,
        patient.latest.pi,
        patient.latest.motion,
        Math.floor(patient.battery)
      );
    }
  });
});

tickAllPatients();
setInterval(tickAllPatients, 1000);