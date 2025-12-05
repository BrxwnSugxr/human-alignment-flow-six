/* assets/js/app.js
   - loads pillars data (programs/carousel functionality removed)
   - renders pillars grid and handles modals
   - implements the new 2-step targeted diagnostic flow
*/

const PILLARS_URL = "assets/data/pillars.json";

// ----- CORE UTILITIES -----
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch error: " + url);
  return res.json();
}

// -------------------------------------------------------------------
// ----- DATA: QUIZ SECTIONS (6 separate quizzes) -----
// -------------------------------------------------------------------

const QUIZ_SECTIONS = [
  {
    id: "academic",
    title: "Academic Flow",
    emoji: "🎓",
    questions: [
      "I set clear weekly learning goals.",
      "I follow through on small learning tasks.",
      "I practice new skills regularly.",
      "I can explain what I learn to someone else.",
    ],
  },
  {
    id: "spiritual",
    title: "Spiritual Core",
    emoji: "✨",
    questions: [
      "I feel connection to something meaningful.",
      "I take time for quiet reflection weekly.",
      "My decisions align with my values.",
      "I feel purpose in day-to-day tasks.",
    ],
  },
  {
    id: "physical",
    title: "Physical Energy",
    emoji: "💪",
    questions: [
      "I consistently eat nutritious meals.",
      "I feel rested after a full night's sleep.",
      "I perform physical activity at least 3 times a week.",
      "I manage my stress without neglecting my body.",
    ],
  },
  {
    id: "mental",
    title: "Mental Clarity",
    emoji: "🧠",
    questions: [
      "I can focus for long stretches when needed.",
      "I sleep reliably most nights.",
      "I recover after stressful days within a day or two.",
      "I limit phone interruptions during work.",
    ],
  },
  {
    id: "emotional",
    title: "Emotional Resilience",
    emoji: "❤️",
    questions: [
      "I can name my feelings when they appear.",
      "I have simple tools to calm myself.",
      "I talk to at least one trusted person about hard feelings.",
      "I practice gratitude or reflection regularly.",
    ],
  },
  {
    id: "social",
    title: "Social Connection",
    emoji: "👥",
    questions: [
      "I have at least one person I can be honest with.",
      "I schedule meaningful conversations regularly.",
      "I feel a sense of belonging in a group.",
      "I ask for help when I need it.",
    ],
  },
];

// -------------------------------------------------------------------
// ----- MODAL FUNCTIONS -----
// -------------------------------------------------------------------

function openPillarModal(pillar, score = null) {
  document.getElementById("modalTitle").textContent = pillar.title;
  document.getElementById("modalSummary").textContent = pillar.summary;
  document.getElementById("modalEmoji").textContent = pillar.emoji || "";
  document.getElementById("modalSymptoms").innerHTML = (pillar.symptoms || [])
    .map((s) => `<li>${s}</li>`)
    .join("");
  document.getElementById("modalActions").innerHTML = (pillar.actions || [])
    .map((a) => `<li>${a}</li>`)
    .join("");

  const scoreWrap = document.getElementById("modalScoreWrapper");
  if (score !== null) {
    document.getElementById("modalScore").textContent = score;
    scoreWrap.classList.remove("hidden");
  } else {
    scoreWrap.classList.add("hidden");
  }

  document.getElementById("detailModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePillarModal() {
  document.getElementById("detailModal").classList.add("hidden");
  document.body.style.overflow = "auto";
}

// -------------------------------------------------------------------
// ----- HOME PAGE RENDERING -----
// -------------------------------------------------------------------

function renderPillars(pillars) {
  const container = document.getElementById("pillarsGrid");
  container.innerHTML = "";

  pillars.forEach((p) => {
    const el = document.createElement("button");
    el.className = "pillar-card text-left pillar-card";
    el.innerHTML = `
    <div class="flex items-start gap-4">
<div class="w-12 h-12 rounded-lg flex items-center justify-center text-xl" style="background:linear-gradient(135deg,#fff9ec,#fbeec1)">${
      p.emoji
    }</div>
<div class="flex-1">
<div class="font-semibold">${p.title}</div>
<div class="text-sm muted mt-1">${p.summary}</div>
<div class="text-xs text-slate-400 mt-3">Quick: ${p.actions
      .slice(0, 2)
      .join(" · ")}</div>
</div>
   </div>`;

    el.addEventListener("click", () => openPillarModal(p));
    container.appendChild(el);
  });
}

// -------------------------------------------------------------------
// ----- DIAGNOSTIC FLOW LOGIC -----
// -------------------------------------------------------------------

function renderSelectionScreen(pillars) {
  const container = document.getElementById("selectionScreen");
  container.innerHTML = "";

  pillars.forEach((p) => {
    const section = QUIZ_SECTIONS.find((q) => q.id === p.id);
    if (!section) return;

    const button = document.createElement("button");
    button.className =
      "p-4 rounded-xl text-left shadow hover:shadow-lg transition bg-white";
    button.innerHTML = `
            <div class="text-xl mr-3">${p.emoji}</div>
            <div class="flex-1">
                <div class="font-bold text-slate-800">${p.title}</div>
                <div class="text-sm text-slate-600">${
                  p.diag_prompt || p.summary
                }</div> 
            </div>
            <div class="text-xl text-amber-500 ml-auto"></div>
        `;

    button.addEventListener("click", () => startElementQuiz(section.id));
    container.appendChild(button);
  });
}

function startElementQuiz(elementId) {
  const section = QUIZ_SECTIONS.find((q) => q.id === elementId);
  if (!section) return;

  // 1. Hide selection screen, show quiz form
  document.getElementById("selectionScreen").classList.add("hidden");
  document.getElementById("diagForm").classList.remove("hidden");
  document.getElementById("diagSubmitArea").classList.remove("hidden");

  // 2. Update modal header
  document.getElementById(
    "diagTitle"
  ).textContent = `${section.title} Diagnostic`;
  document.getElementById(
    "diagSubtitle"
  ).innerHTML = `Rate your current state (1-low to 5-high). We will generate your micro-plan based on this **${section.title}** quiz.`;

  // 3. Render only the questions for the selected element
  const form = document.getElementById("diagForm");
  form.innerHTML = ""; // Clear previous content

  section.questions.forEach((q, i) => {
    const row = document.createElement("div");
    row.className =
      "bg-white/80 p-3 rounded flex items-start justify-between gap-3 border-b";
    row.innerHTML = `
            <div class="text-sm">${q}</div>
            <div class="flex items-center gap-2">
                <input type="hidden" name="elementId" value="${section.id}">
                <select name="q${i}" class="rounded border px-2 py-1 text-sm bg-white">
                    <option value="1">1</option><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option>
                </select>
            </div>
        `;
    form.appendChild(row);
  });
}

function submitDiagnostic() {
  const form = document.getElementById("diagForm");

  // Get the ID of the element being quizzed
  const elementId = form.querySelector('input[name="elementId"]').value;

  // Get scores only from the select inputs present (4 questions)
  const values = Array.from(form.querySelectorAll("select")).map((s) =>
    Number(s.value)
  );

  const perPillar = values.length;

  const sum = values.reduce((a, b) => a + b, 0);
  const score = Math.round((sum / (perPillar * 5)) * 100);

  // Find the full pillar data based on the ID
  fetchJSON(PILLARS_URL).then((pillars) => {
    const weakest = pillars.find((p) => p.id === elementId);

    if (weakest) {
      document.getElementById("diagModal").classList.add("hidden");
      // Open the result modal showing the selected pillar's details and its calculated score
      openPillarModal(weakest, score);
    }
  });
}

// -------------------------------------------------------------------
// ----- INITIALIZATIONS AND EVENT WIRING -----
// -------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [pillars] = await Promise.all([fetchJSON(PILLARS_URL)]);

    // Render the elements grid on the homepage
    renderPillars(pillars);

    // RENDER: Quiz Selection Screen
    renderSelectionScreen(pillars);

    // WIRE: Diagnostic Modal Open (CTA buttons)
    const openDiag = () => {
      document.getElementById("diagModal").classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };
    document.getElementById("cta").addEventListener("click", openDiag);
    document.getElementById("startBtn").addEventListener("click", openDiag);
    document.getElementById("startMobile").addEventListener("click", openDiag);

    // WIRE: Diagnostic Modal Close/Submit
    document.getElementById("closeDiag").addEventListener("click", () => {
      document.getElementById("diagModal").classList.add("hidden");
      document.body.style.overflow = "auto";

      // RESET: Important for new flow - reset to selection screen on close
      document.getElementById("selectionScreen").classList.remove("hidden");
      document.getElementById("diagForm").classList.add("hidden");
      document.getElementById("diagSubmitArea").classList.add("hidden");
      document.getElementById("diagTitle").textContent =
        "Quick Alignment Diagnostic";
      document.getElementById("diagSubtitle").textContent =
        "First, select the element you want to focus on for your 5-minute quiz.";
    });
    document.getElementById("submitDiag").addEventListener("click", (e) => {
      e.preventDefault();
      submitDiagnostic();
    });

    // WIRE: Pillar Detail Modal Close
    document
      .getElementById("closeModal")
      .addEventListener("click", closePillarModal);
    document
      .getElementById("detailBackdrop")
      .addEventListener("click", closePillarModal);
  } catch (err) {
    console.error("Initialization Error:", err);
  }
});
