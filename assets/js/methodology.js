const FRAMEWORKS_URL = "assets/data/frameworks.json";

let allFrameworks = [];
let currentFramework = null;

// Utility to fetch JSON
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Error fetching JSON: " + url);
  return res.json();
}

// Load frameworks and render UI
async function fetchFrameworks() {
  allFrameworks = await fetchJSON(FRAMEWORKS_URL);
  renderFrameworkLists(allFrameworks);

  // Auto-load the first model
  if (allFrameworks.length > 0) {
    showFramework(allFrameworks[0].id);
  }
}

// Sidebar button click
function handleFrameworkClick(id) {
  showFramework(id);

  // auto close drawer for mobile
  if (window.innerWidth < 1024) closeMobileMenu();
}

// Render desktop + mobile sidebar lists
function renderFrameworkLists(frameworks) {
  const desktopList = document.getElementById("framework-list");
  const mobileList = document.getElementById("mobile-framework-list");

  desktopList.innerHTML = "";
  mobileList.innerHTML = "";

  frameworks.forEach((f) => {
    const html = `
      <button class="framework-button" data-id="${f.id}">
        <div class="font-semibold">${f.title}</div>
        <div class="muted text-xs">${f.focus}</div>
      </button>
    `;
    desktopList.insertAdjacentHTML("beforeend", html);
    mobileList.insertAdjacentHTML("beforeend", html);
  });

  document.querySelectorAll(".framework-button").forEach((btn) => {
    btn.addEventListener("click", () => handleFrameworkClick(btn.dataset.id));
  });
}

// Show framework details
function showFramework(id) {
  const f = allFrameworks.find((fr) => fr.id === id);
  if (!f) return;

  currentFramework = f;

  document.getElementById("detailTitle").textContent = f.title;
  document.getElementById("detailFocus").textContent = f.focus;

  // Status Tag
  const tag = `<span class="model-status ${f.model_status.class}">${f.model_status.status}</span>`;
  document.getElementById("modelStatusTag").innerHTML = tag;

  // Relevance
  document.getElementById("relevanceTags").innerHTML = f.relevance
    .map(
      (r) =>
        `<span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">${r}</span>`
    )
    .join("");

  // Active highlight
  document.querySelectorAll(".framework-button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.id === id);
  });

  // Default tab on load
  switchContent("process", f);
}

// Switch tabs
function switchContent(level, f) {
  document
    .querySelectorAll(".tab-button")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`.tab-button[data-level="${level}"]`)
    .classList.add("active");

  document.getElementById("contentSimple").classList.add("hidden");
  document.getElementById("contentProcess").classList.add("hidden");
  document.getElementById("contentAdvanced").classList.add("hidden");

  if (level === "simple") {
    document.getElementById(
      "contentSimple"
    ).innerHTML = `<strong>The Core Idea:</strong><p>${
      f.easy_explanation || f.summary
    }</p>`;
    document.getElementById("contentSimple").classList.remove("hidden");
  }
  if (level === "process") {
    document.getElementById(
      "contentProcess"
    ).innerHTML = `<strong>The Process:</strong>${f.process_application}`;
    document.getElementById("contentProcess").classList.remove("hidden");
  }
  if (level === "advanced") {
    document.getElementById(
      "contentAdvanced"
    ).innerHTML = `<strong>Advanced Concepts:</strong>${f.advanced_concepts}`;
    document.getElementById("contentAdvanced").classList.remove("hidden");
  }
}

/* MOBILE MENU */
function openMobileMenu() {
  document.getElementById("mobile-menu-drawer").classList.add("open");
  document.getElementById("mobile-menu-backdrop").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  document.getElementById("mobile-menu-drawer").classList.remove("open");
  document.getElementById("mobile-menu-backdrop").classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  fetchFrameworks();

  document.querySelectorAll(".tab-button").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      if (currentFramework)
        switchContent(e.target.dataset.level, currentFramework);
    })
  );
});
