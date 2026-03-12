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

function getTriage(hr, spo2, pi) {
  if (spo2 <= 90 || hr >= 160 || hr <= 30 || pi < 1) return "red";
  if (spo2 <= 94 || hr >= 130 || hr <= 50 || pi <= 7) return "yellow";
  return "green";
}

function updateMainCard(hr, spo2, pi, motion, batteryLevel) {
  heartRateEl.innerHTML = `${hr} <span>BPM</span>`;
  spo2El.innerHTML = `${spo2} <span>%</span>`;
  piEl.innerHTML = `${pi} <span>%</span>`;
  motionEl.textContent = motion;
  batteryEl.textContent = `${batteryLevel}%`;
  lastUpdatedEl.textContent = formatTime();

  const triage = getTriage(hr, spo2, pi);

  triageEl.className = "triage-badge";
  alertBannerEl.className = "alert-banner";

  if (triage === "red") {
    triageEl.classList.add("triage-red");
    triageEl.textContent = "RED - IMMEDIATE";
    alertBannerEl.classList.add("alert-critical");
    alertBannerEl.textContent = "Critical alert: Responder attention needed NOW!";
  } else if (triage === "yellow") {
    triageEl.classList.add("triage-yellow");
    triageEl.textContent = "YELLOW - MODERATE";
    alertBannerEl.classList.add("alert-moderate");
    alertBannerEl.textContent = "Warning: Patient vitals need closer monitoring.";
  } else {
    triageEl.classList.add("triage-green");
    triageEl.textContent = "GREEN - MINOR";
    alertBannerEl.classList.add("alert-good")
    alertBannerEl.textContent = "No active critical alerts.";
  }
}

function generateVitals(mode) {
  let hr, spo2, pi, motion;

   hr = Math.floor(Math.random() * (180 - 25) + 25);
   spo2 = Math.floor(Math.random() * (100 - 85) + 85);
   pi = Math.floor(Math.random() * (10 - 3) + 3);

   /*hr = 120
   spo2 = 95
   pi = 10*/


  if((hr >= 160 || hr <= 30) || (spo2 <= 90) || (pi < 1)) {
    mode = "critical";
  } else if((hr >= 130 || hr <= 50) || ( spo2 <= 94) || (pi <= 7)) {
    mode = "warning";
  } else {
    mode = "normal";
  }
  if (mode === "critical") {
    motion = Math.random() > 0.5 ? "Movement detected" : "Unstable";
  } else if (mode === "warning") {
    /* hr = Math.floor(Math.random() * 20) + 95;
    spo2 = Math.floor(Math.random() * 4) + 91;
    pi = Math.random() * 1.5 + 1.3; */
    motion = Math.random() > 0.7 ? "Movement detected" : "Stable";
  } else {
   /* hr = Math.floor(Math.random() * 25) + 70;
    spo2 = Math.floor(Math.random() * 4) + 96;
    pi = Math.random() * 2 + 2.0;*/
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

    const triage = getTriage(vitals.hr, vitals.spo2, vitals.pi);
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