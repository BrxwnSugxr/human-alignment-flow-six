// assets/js/methodology.js
/*
   - Fetches frameworks.json
   - Renders sidebar navigation and mobile drawer list
   - Handles tab switching (Simple/Process/Advanced)
   - Manages mobile sidebar drawer functionality
*/

const FRAMEWORKS_URL = "assets/data/frameworks.json";

// --- Global Elements ---
const listContainer = document.getElementById("framework-list");
const mobileListContainer = document.getElementById("mobile-framework-list");
const detailWrapper = document.getElementById("framework-detail-wrapper");
const modelStatusTagContainer = document.getElementById("modelStatusTag");
const tabButtons = document.querySelectorAll(".tab-button");

let currentFramework = null;
let allFrameworks = [];

// --- Utility: Fetch Data ---
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch error: " + url);
  return res.json();
}

async function fetchFrameworks() {
  try {
    allFrameworks = await fetchJSON(FRAMEWORKS_URL);
    renderFrameworkLists(allFrameworks);
    // Set initial view on load
    if (allFrameworks.length > 0) {
      showFramework(allFrameworks[0].id);
    }
  } catch (error) {
    console.error("Initialization Error:", error);
  }
}

// --- Mobile Menu Functions ---
function openMobileMenu() {
  document.getElementById("mobile-menu-drawer").classList.add("open");
  document.getElementById("mobile-menu-backdrop").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  document.getElementById("mobile-menu-drawer").classList.remove("open");
  document.getElementById("mobile-menu-backdrop").style.display = "none";
  document.body.style.overflow = "auto";
}

function handleFrameworkClick(id) {
  showFramework(id);
  if (window.innerWidth < 1024) {
    closeMobileMenu();
  }
  detailWrapper.scrollTop = 0;
}

// --- Content Rendering ---

function switchContent(level, frameworkData) {
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`.tab-button[data-level="${level}"]`)
    .classList.add("active");

  // Hide all content containers
  document.getElementById("contentSimple").classList.add("hidden");
  document.getElementById("contentProcess").classList.add("hidden");
  document.getElementById("contentAdvanced").classList.add("hidden");

  // Show the selected content
  if (level === "simple") {
    document.getElementById(
      "contentSimple"
    ).innerHTML = `<strong class="text-slate-800">The Core Idea (Beginner Focus):</strong> <p>${
      frameworkData.easy_explanation || frameworkData.summary
    }</p>`;
    document.getElementById("contentSimple").classList.remove("hidden");
  } else if (level === "process") {
    document.getElementById(
      "contentProcess"
    ).innerHTML = `<strong class="text-slate-800">Process Breakdown (The How-To):</strong> ${
      frameworkData.process_application || "Process details coming soon."
    }`;
    document.getElementById("contentProcess").classList.remove("hidden");
  } else if (level === "advanced") {
    document.getElementById(
      "contentAdvanced"
    ).innerHTML = `<strong class="text-slate-800">Academic Deep Dive (Context & Critique):</strong> ${
      frameworkData.advanced_concepts ||
      "Advanced concepts coming soon for this framework."
    }`;
    document.getElementById("contentAdvanced").classList.remove("hidden");
  }
}

function showFramework(id) {
  const framework = allFrameworks.find((f) => f.id === id);
  if (!framework) return;
  currentFramework = framework;

  document.getElementById("detailTitle").textContent = framework.title;
  document.getElementById("detailFocus").textContent = framework.focus;

  // Update Model Status Tag
  modelStatusTagContainer.innerHTML = `<span class="model-status ${framework.model_status.class}">${framework.model_status.status}</span>`;

  // Update Relevance Tags
  document.getElementById("relevanceTags").innerHTML = framework.relevance
    .map(
      (pillar) => `
                <span class="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">${pillar}</span>
            `
    )
    .join("");

  // Synchronize Active Class on ALL Buttons
  document.querySelectorAll(".framework-button").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.id === id) {
      btn.classList.add("active");
    }
  });

  // Default to Process tab on framework selection
  switchContent("process", framework);
}

function renderFrameworkLists(frameworks) {
  listContainer.innerHTML = "";
  mobileListContainer.innerHTML = "";

  frameworks.forEach((f) => {
    const buttonHTML = `<button class='framework-button bg-white text-sm' data-id='${f.id}'>
            <div class='font-semibold'>${f.title}</div>
            <div class='muted text-xs'>${f.focus}</div>
        </button>`;

    listContainer.insertAdjacentHTML("beforeend", buttonHTML);
    mobileListContainer.insertAdjacentHTML("beforeend", buttonHTML);
  });

  // Attach event listeners to all buttons (Desktop and Mobile)
  document.querySelectorAll(".framework-button").forEach((btn) => {
    btn.addEventListener("click", () => handleFrameworkClick(btn.dataset.id));
  });
}

// --- Initialization ---

document.addEventListener("DOMContentLoaded", () => {
  fetchFrameworks();

  // Attach listeners to the internal level tabs
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (currentFramework) {
        switchContent(e.target.dataset.level, currentFramework);
      }
    });
  });

  // Wire mobile menu close (backdrop)
  document
    .getElementById("mobile-menu-backdrop")
    .addEventListener("click", closeMobileMenu);
});
