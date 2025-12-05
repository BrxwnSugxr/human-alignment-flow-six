// assets/js/methodology.js
// Standalone file: renders frameworks, sidebar, mobile drawer, tab switching.
// Framework dataset embedded for portability.

const FRAMEWORKS = [
  {
    id: "maslow",
    title: "Maslow's Hierarchy of Needs",
    focus: "Motivational Psychology",
    summary:
      "A five-tier model from physiological needs to self-actualization.",
    relevance: ["Spiritual", "Emotional", "Physical"],
    model_status: {
      status: "Revised (Transcendence)",
      class: "status-revised",
    },
    easy_explanation:
      "Think of human needs as levels: lower (safety, physiological) must be stable before higher growth needs (purpose & creativity) function well.",
    process_application:
      "<ol><li>Identify the lowest unmet need.</li><li>Pursue small stabilizing actions (sleep, safety, finances).</li><li>Reassess and progress to higher needs.</li></ol>",
    advanced_concepts:
      "<p>Later revisions include 'transcendence'. Clinically, unmet basic needs predict anxiety and impaired higher-order functioning.</p>",
  },
  {
    id: "ttm",
    title: "Transtheoretical Model (TTM)",
    focus: "Behavioral Change Psychology",
    summary:
      "Stages of change: Precontemplation → Contemplation → Preparation → Action → Maintenance.",
    relevance: ["All Pillars: Readiness"],
    model_status: { status: "Current/Widely Used", class: "status-current" },
    easy_explanation:
      "Change occurs in stages. Interventions should match a person's current readiness.",
    process_application:
      "<ol><li>Assess the stage.</li><li>Tailor steps (awareness, planning, small action).</li><li>Support maintenance with accountability.)</li></ol>",
    advanced_concepts:
      "<p>Includes processes of change (consciousness raising, self re-evaluation) used in therapy and coaching.</p>",
  },
  {
    id: "wheel",
    title: "Wheel of Life",
    focus: "Coaching Framework",
    summary:
      "Visual tool to assess balance across life areas. Inspires our six-element layout.",
    relevance: ["All Pillars"],
    model_status: { status: "Coaching Tool", class: "status-historic" },
    easy_explanation:
      "Rate satisfaction in slices (e.g., Health, Career). Connect the dots to reveal 'wobbly' areas.",
    process_application:
      "<ol><li>Map 6–8 areas and rate 0–10.</li><li>Identify the lowest spokes.</li><li>Select one micro-step to improve that spoke.</li></ol>",
    advanced_concepts:
      "<p>Useful for initial diagnosis and for visually communicating imbalance to clients.</p>",
  },
  {
    id: "com-b",
    title: "COM-B Model",
    focus: "Behavior Change Design",
    summary: "Behavior occurs when Capability, Opportunity & Motivation align.",
    relevance: ["Mental", "Academic", "Financial"],
    model_status: { status: "Current/Gold Standard", class: "status-current" },
    easy_explanation:
      "To change behaviour ask: Do they have the skill (capability), the environment (opportunity), and motivation?",
    process_application:
      "<ol><li>Assess C, O, M for a target behaviour.</li><li>Design interventions to increase missing components (training, prompts, incentives).</li></ol>",
    advanced_concepts:
      "<p>Core to the Behaviour Change Wheel and policy design.</p>",
  },
  {
    id: "fogg",
    title: "Fogg Behavior Model",
    focus: "Habit Design",
    summary:
      "Behaviour = Motivation × Ability × Prompt (when aligned behaviour occurs).",
    relevance: ["Mental", "Academic"],
    model_status: { status: "Design Staple", class: "status-current" },
    easy_explanation:
      "Make actions easy (ability) and time prompts to moments of high motivation.",
    process_application:
      "<ol><li>Make the target tiny (increase ability).</li><li>Attach the prompt to an existing routine.</li><li>Increase motivation via immediate reward/feedback.</li></ol>",
    advanced_concepts:
      "<p>Visualized with the 'action line'. Useful for product/habit design.</p>",
  },
  {
    id: "perma",
    title: "PERMA",
    focus: "Positive Psychology",
    summary:
      "Positive Emotion, Engagement, Relationships, Meaning, Accomplishment.",
    relevance: ["Mental", "Emotional", "Social"],
    model_status: { status: "Current/Widely Used", class: "status-current" },
    easy_explanation:
      "A recipe for wellbeing—balance effort across P, E, R, M, A to avoid burnout.",
    process_application:
      "<ol><li>Measure PERMA elements.</li><li>Pick micro-actions to boost weakest elements (e.g., gratitude for P).</li></ol>",
    advanced_concepts:
      "<p>Often measured via the PERMA profiler; meaning and relationships predict long-term resilience.</p>",
  },
];

// DOM refs
const listContainer = document.getElementById("framework-list");
const mobileListContainer = document.getElementById("mobile-framework-list");
const modelStatusTagContainer = document.getElementById("modelStatusTag");
const tabButtons = document.querySelectorAll(".tab-button");
const detailTitle = document.getElementById("detailTitle");
const detailFocus = document.getElementById("detailFocus");
const relevanceTags = document.getElementById("relevanceTags");

let currentFramework = null;

// Mobile menu controls
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

// Render lists
function renderFrameworkLists(frames) {
  listContainer.innerHTML = "";
  mobileListContainer.innerHTML = "";

  frames.forEach((f, idx) => {
    const html = `
      <button class="framework-button" data-id="${f.id}" aria-controls="framework-detail">
        <div style="width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#fff9ec,#fbeec1);display:flex;align-items:center;justify-content:center">
          <!-- small icon (svg) -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2l6 3-6 3-6-3 6-3z" stroke="#7a5a1e" stroke-width="1" fill="#fff"/>
          </svg>
        </div>
        <div style="margin-left:12px;flex:1">
          <div class="fw-title">${f.title}</div>
          <div class="fw-focus muted">${f.focus}</div>
        </div>
      </button>
    `;
    listContainer.insertAdjacentHTML("beforeend", html);
    mobileListContainer.insertAdjacentHTML("beforeend", html);
  });

  // add listeners
  document.querySelectorAll(".framework-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = btn.dataset.id;
      showFramework(id);
      if (window.innerWidth < 1024) closeMobileMenu();
      // ensure detail area scroll top
      document.getElementById("framework-detail-wrapper").scrollTop = 0;
    });
  });
}

// Show framework in detail panel, center content naturally by layout
function showFramework(id) {
  const f = FRAMEWORKS.find((x) => x.id === id);
  if (!f) return;
  currentFramework = f;

  // populate header text
  detailTitle.textContent = f.title;
  detailFocus.textContent = f.focus;

  // model status tag
  modelStatusTagContainer.innerHTML = `<span class="model-status ${f.model_status.class}">${f.model_status.status}</span>`;

  // relevance tags
  relevanceTags.innerHTML = (f.relevance || [])
    .map((r) => `<span>${r}</span>`)
    .join("");

  // synchronize active class
  document.querySelectorAll(".framework-button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.id === id);
  });

  // default to 'process' view to show useful how-to steps
  switchContent("process", f);
}

// Tab switcher
function switchContent(level, frameworkData) {
  tabButtons.forEach((btn) => btn.classList.remove("active"));
  const selected = document.querySelector(`.tab-button[data-level="${level}"]`);
  if (selected) selected.classList.add("active");

  document.getElementById("contentSimple").classList.add("hidden");
  document.getElementById("contentProcess").classList.add("hidden");
  document.getElementById("contentAdvanced").classList.add("hidden");

  if (level === "simple") {
    document.getElementById(
      "contentSimple"
    ).innerHTML = `<strong class="text-slate-800">Core idea:</strong> <p>${
      frameworkData.easy_explanation || frameworkData.summary
    }</p>`;
    document.getElementById("contentSimple").classList.remove("hidden");
  } else if (level === "process") {
    document.getElementById(
      "contentProcess"
    ).innerHTML = `<strong class="text-slate-800">Process / How-to:</strong> ${
      frameworkData.process_application || "<p>Coming soon.</p>"
    }`;
    document.getElementById("contentProcess").classList.remove("hidden");
  } else {
    document.getElementById(
      "contentAdvanced"
    ).innerHTML = `<strong class="text-slate-800">Advanced & notes:</strong> ${
      frameworkData.advanced_concepts || "<p>Coming soon.</p>"
    }`;
    document.getElementById("contentAdvanced").classList.remove("hidden");
  }
}

// convenience: scroll to first framework and open it
function scrollToFirstFramework() {
  const first = FRAMEWORKS[0];
  if (!first) return;
  // if desktop, ensure visible and active
  showFramework(first.id);
  // on desktop, highlight and small scroll
  const el = document.querySelector(`.framework-button[data-id="${first.id}"]`);
  if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
}

// init
document.addEventListener("DOMContentLoaded", () => {
  renderFrameworkLists(FRAMEWORKS);

  // Attach tab listeners
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (currentFramework) switchContent(btn.dataset.level, currentFramework);
    });
  });

  // mobile backdrop close
  const backdrop = document.getElementById("mobile-menu-backdrop");
  backdrop.addEventListener("click", closeMobileMenu);

  // initial selection
  if (FRAMEWORKS.length) {
    showFramework(FRAMEWORKS[0].id);
  }
});
