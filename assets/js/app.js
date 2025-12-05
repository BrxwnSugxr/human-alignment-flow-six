/* assets/js/app.js
   - Renders pillars from JSON
   - Handles 2-step diagnostic
   - Shows results and scoring feedback
*/

const PILLARS_URL = "assets/data/pillars.json";

/* small helper to fetch JSON */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch error: " + url);
  return res.json();
}

/* QUIZ sections (only used to render the 4-question quizzes) */
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

/* Modal functions */
function openPillarModal(pillar, score = null) {
  document.getElementById("modalTitle").textContent = pillar.title;
  document.getElementById("modalSummary").textContent = pillar.summary || "";
  document.getElementById("modalEmoji").textContent = pillar.emoji || "";
  document.getElementById("modalSymptoms").innerHTML = (pillar.symptoms || [])
    .map((s) => `<li>${s}</li>`)
    .join("");
  document.getElementById("modalActions").innerHTML = (pillar.actions || [])
    .map((a) => `<li>${a}</li>`)
    .join("");

  const scoreWrap = document.getElementById("modalScoreWrapper");
  const scoreEl = document.getElementById("modalScore");
  const feedbackEl = document.getElementById("modalScoreFeedback");

  // Reset wrapper classes
  scoreWrap.className = "mt-4 p-3 rounded hidden";

  if (typeof score === "number") {
    scoreEl.textContent = score;
    scoreWrap.classList.remove("hidden");

    // Determine status and message
    let statusClass = "bg-amber-100 border-amber-500";
    let message =
      "Your alignment here is moderate. Small consistent steps will help.";

    if (score < 50) {
      statusClass = "bg-red-100 border-red-500";
      message =
        "⚠️ Area of Focus (RED). Immediate micro-actions recommended to stabilise this pillar.";
    } else if (score >= 80) {
      statusClass = "bg-green-100 border-green-500";
      message =
        "✅ Strong Foundation (GREEN). Keep maintaining this area and support your weaker pillars.";
    }

    // apply
    scoreWrap.classList.add(...statusClass.split(" "));
    feedbackEl.textContent = message;
  } else {
    scoreWrap.classList.add("hidden");
    feedbackEl.textContent = "";
    scoreEl.textContent = "--";
  }

  // show modal
  document.getElementById("detailModal").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePillarModal() {
  document.getElementById("detailModal").classList.add("hidden");
  document.body.style.overflow = "auto";
}

/* Render the pillars grid */
function renderPillars(pillars) {
  const container = document.getElementById("pillarsGrid");
  container.innerHTML = "";

  pillars.forEach((p) => {
    const btn = document.createElement("button");
    btn.className = "pillar-card text-left";
    btn.innerHTML = `
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-lg flex items-center justify-center text-xl" style="background:linear-gradient(135deg,#fff9ec,#fbeec1)">${
          p.emoji || ""
        }</div>
        <div class="flex-1">
          <div class="font-semibold">${p.title}</div>
          <div class="text-sm muted mt-1">${p.summary || ""}</div>
          <div class="text-xs text-slate-400 mt-3">Quick: ${(p.actions || [])
            .slice(0, 2)
            .join(" · ")}</div>
        </div>
      </div>`;
    btn.addEventListener("click", () => openPillarModal(p)); // open detail modal
    container.appendChild(btn);
  });
}

/* Render selection screen for diagnostic (step 1) */
function renderSelectionScreen(pillars) {
  const container = document.getElementById("selectionScreen");
  container.innerHTML = "";
  pillars.forEach((p) => {
    const section = QUIZ_SECTIONS.find((q) => q.id === p.id);
    if (!section) return;
    const b = document.createElement("button");
    b.className =
      "w-full flex items-center justify-start p-3 border-b-2 border-gray-100 hover:bg-amber-50 transition text-left rounded";
    b.innerHTML = `<div class="text-2xl mr-3">${p.emoji || ""}</div>
                   <div class="flex-1">
                     <div class="font-bold text-slate-800">${p.title}</div>
                     <div class="text-sm text-slate-600">${
                       p.summary || ""
                     }</div>
                   </div>
                   <div class="text-xl text-amber-500 ml-auto">&rarr;</div>`;
    b.addEventListener("click", () => startElementQuiz(section.id));
    container.appendChild(b);
  });
}

/* Start quiz for one element (step 2) */
function startElementQuiz(elementId) {
  const section = QUIZ_SECTIONS.find((s) => s.id === elementId);
  if (!section) return;

  document.getElementById("selectionScreen").classList.add("hidden");
  document.getElementById("diagForm").classList.remove("hidden");
  document.getElementById("diagSubmitArea").classList.remove("hidden");

  document.getElementById(
    "diagTitle"
  ).textContent = `${section.title} Diagnostic`;
  document.getElementById(
    "diagSubtitle"
  ).innerHTML = `Rate your current state (1 low — 5 high). This short ${section.title} quiz will generate your micro-plan.`;

  const form = document.getElementById("diagForm");
  form.innerHTML = "";
  // hidden input for element id
  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.name = "elementId";
  hidden.value = section.id;
  form.appendChild(hidden);

  section.questions.forEach((q, i) => {
    const row = document.createElement("div");
    row.className =
      "bg-white/80 p-3 rounded flex items-start justify-between gap-3 border-b";
    row.innerHTML = `<div class="text-sm">${q}</div>
      <div class="flex items-center gap-2">
        <select name="q${i}" class="rounded border px-2 py-1 text-sm bg-white">
          <option value="1">1</option><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option>
        </select>
      </div>`;
    form.appendChild(row);
  });
}

/* Submit quiz, compute score and show results */
async function submitDiagnostic() {
  const form = document.getElementById("diagForm");
  // ensure form exists and has hidden elementId
  const elHidden = form.querySelector('input[name="elementId"]');
  if (!elHidden) {
    console.error("No elementId found in the form. Did you start the quiz?");
    return;
  }
  const elementId = elHidden.value;
  const selects = Array.from(form.querySelectorAll("select"));
  if (selects.length === 0) {
    console.error("No answers found. Ensure quiz rendered.");
    return;
  }
  const values = selects.map((s) => Number(s.value));
  const sum = values.reduce((a, b) => a + b, 0);
  const perPillar = values.length;
  const score = Math.round((sum / (perPillar * 5)) * 100);

  try {
    const pillars = await fetchJSON(PILLARS_URL);
    const pillar = pillars.find((p) => p.id === elementId);
    if (!pillar) {
      console.error("Pillar not found for id:", elementId);
      return;
    }
    document.getElementById("diagModal").classList.add("hidden");
    // show detail modal with score
    openPillarModal(pillar, score);

    // reset selection screen state for next time
    // (so closing the modal means user can start again)
    document.getElementById("selectionScreen").classList.remove("hidden");
    document.getElementById("diagForm").classList.add("hidden");
    document.getElementById("diagSubmitArea").classList.add("hidden");
    document.getElementById("diagTitle").textContent =
      "Quick Alignment Diagnostic";
    document.getElementById("diagSubtitle").textContent =
      "First, select the element you want to focus on for your 5-minute quiz.";
  } catch (err) {
    console.error("Error during submitDiagnostic:", err);
  }
}

/* Init and wiring */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const pillars = await fetchJSON(PILLARS_URL);
    renderPillars(pillars);
    renderSelectionScreen(pillars);

    // wire ctas
    const openDiag = () => {
      document.getElementById("diagModal").classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };
    document.getElementById("cta").addEventListener("click", openDiag);
    document.getElementById("startBtn").addEventListener("click", openDiag);
    document.getElementById("startMobile").addEventListener("click", openDiag);

    // close diag
    document.getElementById("closeDiag").addEventListener("click", () => {
      document.getElementById("diagModal").classList.add("hidden");
      document.body.style.overflow = "auto";
      // reset selector state
      document.getElementById("selectionScreen").classList.remove("hidden");
      document.getElementById("diagForm").classList.add("hidden");
      document.getElementById("diagSubmitArea").classList.add("hidden");
      document.getElementById("diagTitle").textContent =
        "Quick Alignment Diagnostic";
      document.getElementById("diagSubtitle").textContent =
        "First, select the element you want to focus on for your 5-minute quiz.";
    });

    // submit
    document.getElementById("submitDiag").addEventListener("click", (e) => {
      e.preventDefault();
      submitDiagnostic();
    });

    // close detail modal
    document
      .getElementById("closeModal")
      .addEventListener("click", closePillarModal);
    document
      .getElementById("detailBackdrop")
      .addEventListener("click", closePillarModal);
  } catch (err) {
    console.error("Init error:", err);
  }
});
