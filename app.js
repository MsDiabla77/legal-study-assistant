let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let citations = JSON.parse(localStorage.getItem("citations")) || [];
let cards = JSON.parse(localStorage.getItem("cards")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveAll() {
  localStorage.setItem("assignments", JSON.stringify(assignments));
  localStorage.setItem("citations", JSON.stringify(citations));
  localStorage.setItem("cards", JSON.stringify(cards));
  localStorage.setItem("notes", JSON.stringify(notes));
}

function openTab(tabId, button) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  const selectedTab = document.getElementById(tabId);

  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  if (button) {
    button.classList.add("active");
  }
}

function openTabById(tabId) {
  const tabNames = {
    dashboard: "Dashboard",
    translator: "Translator",
    professor: "Professor Mode",
    grammar: "Grammar Check",
    assignments: "Assignments",
    notes: "Class Notes",
    apa: "APA Paper",
    discussion: "Discussion",
    citations: "Citations",
    cards: "Study Cards"
  };

  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  const selectedTab = document.getElementById(tabId);

  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  document.querySelectorAll(".tab-btn").forEach(btn => {
    if (btn.textContent.trim() === tabNames[tabId]) {
      btn.classList.add("active");
    }
  });
}

/* TRANSLATOR */
let currentTestAnswer = "";

function generateTestQuestion() {
  const topic = document.getElementById("testTopic").value;
  const difficulty = document.getElementById("testDifficulty").value;
  const questionBox = document.getElementById("testQuestion");
  const answerBox = document.getElementById("testAnswer");

  const questions = {
    legalTerms: [
      {
        q: "What does jurisdiction mean?",
        a: "Jurisdiction means the court has legal authority to hear and decide a case."
      },
      {
        q: "What is the difference between a plaintiff and a defendant?",
        a: "The plaintiff is the person who brings the lawsuit. The defendant is the person being sued or accused."
      },
      {
        q: "What does liability mean?",
        a: "Liability means legal responsibility for an act, harm, debt, or legal duty."
      }
    ],
    apa: [
      {
        q: "What belongs in an APA in-text citation?",
        a: "An APA in-text citation usually includes the author’s last name and year, such as (Smith, 2024)."
      },
      {
        q: "What is the purpose of an APA reference list?",
        a: "The reference list gives full source information so the reader can locate the sources used in the paper."
      },
      {
        q: "Why should source ideas be cited where they appear?",
        a: "Citing where the source idea appears helps avoid plagiarism and shows exactly which idea came from which source."
      }
    ],
    citations: [
      {
        q: "When should you use APA citation style?",
        a: "Use APA for scholarly articles, textbooks, websites, and most general academic sources unless the professor says otherwise."
      },
      {
        q: "When should you use Bluebook style?",
        a: "Use Bluebook for legal authorities such as cases, statutes, regulations, and court materials when required by the professor."
      },
      {
        q: "Why is one citation at the end of a paragraph sometimes not enough?",
        a: "Because if several sentences contain source ideas, the reader may not know which source supports which sentence."
      }
    ],
    civil: [
      {
        q: "What is discovery in civil litigation?",
        a: "Discovery is the process where both sides exchange information, documents, evidence, and answers before trial."
      },
      {
        q: "What is a complaint in a civil case?",
        a: "A complaint is the document that starts a lawsuit and explains the claims against the defendant."
      },
      {
        q: "What is summary judgment?",
        a: "Summary judgment is when the court decides a case or issue without a trial because there is no real dispute about the important facts."
      }
    ],
    realestate: [
      {
        q: "What is an easement?",
        a: "An easement is a legal right to use someone else’s property for a specific purpose, such as a driveway or utility line."
      },
      {
        q: "What is a deed?",
        a: "A deed is a legal document used to transfer ownership of real property."
      },
      {
        q: "What is title in real estate?",
        a: "Title means legal ownership or the legal right to own and use property."
      }
    ]
  };

  const list = questions[topic];
  const randomItem = list[Math.floor(Math.random() * list.length)];

  let difficultyNote = "";

  if (difficulty === "easy") {
    difficultyNote = "Answer in simple terms.";
  }

  if (difficulty === "medium") {
    difficultyNote = "Answer with the definition and one example.";
  }

  if (difficulty === "hard") {
    difficultyNote = "Answer with the rule, why it matters, and a real-life example.";
  }

  questionBox.textContent = `${randomItem.q}\n\nDifficulty: ${difficulty}\n${difficultyNote}`;
  answerBox.textContent = "Click Show Answer when you are ready.";
  currentTestAnswer = randomItem.a;

  localStorage.setItem("testQuestion", questionBox.textContent);
  localStorage.setItem("testAnswerHidden", currentTestAnswer);
  localStorage.setItem("testAnswerShown", "");
}

function showTestAnswer() {
  const answerBox = document.getElementById("testAnswer");

  if (!currentTestAnswer) {
    currentTestAnswer = localStorage.getItem("testAnswerHidden") || "";
  }

  if (!currentTestAnswer) {
    alert("Generate a question first.");
    return;
  }

  answerBox.textContent =
`Answer:

${currentTestAnswer}

Study Tip:
Try saying the answer out loud in your own words. Then add one real-life example so you know you actually understand it.`;

  localStorage.setItem("testAnswerShown", answerBox.textContent);
}

function clearTestMode() {
  currentTestAnswer = "";
  document.getElementById("testQuestion").textContent = "Your test question will appear here.";
  document.getElementById("testAnswer").textContent = "The answer will appear here after you click Show Answer.";

  localStorage.removeItem("testQuestion");
  localStorage.removeItem("testAnswerHidden");
  localStorage.removeItem("testAnswerShown");
}

/* PROFESSOR MODE */
function saveProfessorRules() {
  const rules = {
    className: document.getElementById("professorClass").value,
    professorName: document.getElementById("professorName").value,
    citationStyle: document.getElementById("citationStyle").value,
    initialDue: document.getElementById("initialDue").value,
    replyDue: document.getElementById("replyDue").value,
    replyRequirement: document.getElementById("replyRequirement").value,
    professorRules: document.getElementById("professorRules").value
  };

  localStorage.setItem("professorRules", JSON.stringify(rules));
  renderProfessorRules();
}

function renderProfessorRules() {
  const output = document.getElementById("professorOutput");
  const saved = JSON.parse(localStorage.getItem("professorRules"));

  if (!output) return;

  if (!saved) {
    output.textContent = "Your saved professor rules will appear here.";
    return;
  }

  output.textContent =
`Class: ${saved.className || "N/A"}
Professor: ${saved.professorName || "N/A"}
Citation Style: ${saved.citationStyle || "N/A"}
Initial Post / Assignment Due: ${saved.initialDue || "N/A"}
Replies Due: ${saved.replyDue || "N/A"}
Reply Requirement: ${saved.replyRequirement || "N/A"}

Professor Rules / Reminders:
${saved.professorRules || "No extra rules entered."}`;
}

function clearProfessorRules() {
  localStorage.removeItem("professorRules");

  document.getElementById("professorClass").value = "";
  document.getElementById("professorName").value = "";
  document.getElementById("initialDue").value = "";
  document.getElementById("replyDue").value = "";
  document.getElementById("replyRequirement").value = "";
  document.getElementById("professorRules").value = "";

  renderProfessorRules();
}

/* GRAMMAR CHECK */
function checkWriting() {
  const text = document.getElementById("grammarInput").value.trim();
  const mode = document.getElementById("grammarMode").value;
  const output = document.getElementById("grammarOutput");

  if (!text) {
    alert("Please paste your writing first.");
    return;
  }

  const issues = [];

  const lower = text.toLowerCase();

  const commonFixes = [
    [" alot ", "Use “a lot,” not “alot.”"],
    [" gonna ", "Use “going to” for school writing."],
    [" wanna ", "Use “want to” for school writing."],
    [" dont ", "Use “don’t.”"],
    [" doesnt ", "Use “doesn’t.”"],
    [" cant ", "Use “can’t.”"],
    [" wont ", "Use “won’t.”"],
    [" im ", "Use “I’m.”"],
    [" i ", "Capitalize “I.”"],
    [" u ", "Use “you.”"],
    [" cuz ", "Use “because.”"],
    [" thru ", "Use “through.”"]
  ];

  commonFixes.forEach(item => {
    if (lower.includes(item[0])) {
      issues.push(item[1]);
    }
  });

  if (text.length < 150 && mode !== "discussion") {
    issues.push("This may be too short for a full assignment paragraph. Add more explanation, facts, or support.");
  }

  if (!/[.!?]$/.test(text)) {
    issues.push("Your writing may need a clear ending punctuation mark.");
  }

  if (text.split(".").some(sentence => sentence.trim().split(" ").length > 38)) {
    issues.push("At least one sentence may be too long. Consider breaking it into two sentences.");
  }

  if (!text.includes("(") && !text.includes(")") && !text.includes("[") && !text.includes("]")) {
    issues.push("No obvious in-text citation found. If you used a source, add APA in-text citation or legal citation support.");
  }

  if (mode === "legal") {
    issues.push("Legal writing reminder: identify the issue, rule, application, and conclusion when possible.");
    issues.push("Legal citation reminder: use Bluebook or professor-required citation format for cases, statutes, and regulations.");
  }

  if (mode === "discussion") {
    issues.push("Discussion reminder: include a clear main point, personal or practical connection, and an open-ended question if required.");
  }

  if (mode === "school") {
    issues.push("APA reminder: use APA 7 formatting, in-text citations, and a reference list when sources are used.");
  }

  const result =
`Writing Check Results:

${issues.length ? issues.map((issue, index) => `${index + 1}. ${issue}`).join("\n") : "No major rule-based issues found."}

Professional Writing Reminder:
Read it out loud once. Make sure it sounds like you, but still uses complete sentences, proper citations, and a clear academic tone.`;

  output.textContent = result;
  localStorage.setItem("grammarOutput", result);
}

function clearGrammar() {
  document.getElementById("grammarInput").value = "";
  document.getElementById("grammarOutput").textContent = "Your grammar, spelling, and citation reminders will appear here.";
  localStorage.removeItem("grammarOutput");
}

/* ASSIGNMENTS */
function addAssignment() {
  const item = {
    className: document.getElementById("assignmentClass").value,
    title: document.getElementById("assignmentTitle").value,
    due: document.getElementById("assignmentDue").value,
    priority: document.getElementById("assignmentPriority").value,
    status: document.getElementById("assignmentStatus").value,
    notes: document.getElementById("assignmentNotes").value
  };

  if (!item.title.trim()) {
    alert("Please enter an assignment title.");
    return;
  }

  assignments.push(item);
  saveAll();
  renderAssignments();

  document.getElementById("assignmentClass").value = "";
  document.getElementById("assignmentTitle").value = "";
  document.getElementById("assignmentDue").value = "";
  document.getElementById("assignmentNotes").value = "";
}

function renderAssignments() {
  const list = document.getElementById("assignmentList");

  if (!list) return;

  if (assignments.length === 0) {
    list.innerHTML = "<p class='small'>No assignments saved yet.</p>";
    return;
  }

  list.innerHTML = assignments.map((a, index) => `
    <div class="item">
      <strong>${escapeHTML(a.title)}</strong>
      <p><b>Class:</b> ${escapeHTML(a.className || "N/A")}</p>
      <p><b>Due:</b> ${escapeHTML(a.due || "No date entered")}</p>
      <p><b>Priority:</b> ${escapeHTML(a.priority)}</p>
      <p><b>Status:</b> ${escapeHTML(a.status)}</p>
      <p><b>Notes:</b> ${escapeHTML(a.notes || "None")}</p>
      <button class="action green" type="button" onclick="markAssignmentDone(${index})">Mark Completed</button>
      <button class="action danger" type="button" onclick="deleteAssignment(${index})">Delete</button>
    </div>
  `).join("");
}

function markAssignmentDone(index) {
  assignments[index].status = "Completed";
  saveAll();
  renderAssignments();
}

function deleteAssignment(index) {
  assignments.splice(index, 1);
  saveAll();
  renderAssignments();
}

/* NOTES */
function addNote() {
  const item = {
    className: document.getElementById("noteClass").value,
    unit: document.getElementById("noteUnit").value,
    topic: document.getElementById("noteTopic").value,
    text: document.getElementById("noteText").value
  };

  if (!item.text.trim()) {
    alert("Please enter note text.");
    return;
  }

  notes.push(item);
  saveAll();
  renderNotes();

  document.getElementById("noteClass").value = "";
  document.getElementById("noteUnit").value = "";
  document.getElementById("noteTopic").value = "";
  document.getElementById("noteText").value = "";
}

function renderNotes() {
  const list = document.getElementById("noteList");
  const searchInput = document.getElementById("noteSearch");
  const search = searchInput ? searchInput.value.toLowerCase() : "";

  if (!list) return;

  const filtered = notes.filter(n =>
    (n.className || "").toLowerCase().includes(search) ||
    (n.unit || "").toLowerCase().includes(search) ||
    (n.topic || "").toLowerCase().includes(search) ||
    (n.text || "").toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    list.innerHTML = "<p class='small'>No matching notes saved yet.</p>";
    return;
  }

  list.innerHTML = filtered.map((n, index) => `
    <div class="item">
      <strong>${escapeHTML(n.topic || "Untitled Note")}</strong>
      <p><b>Class:</b> ${escapeHTML(n.className || "N/A")}</p>
      <p><b>Unit:</b> ${escapeHTML(n.unit || "N/A")}</p>
      <p>${escapeHTML(n.text)}</p>
      <button class="action danger" type="button" onclick="deleteNote(${index})">Delete</button>
    </div>
  `).join("");
}

function deleteNote(index) {
  notes.splice(index, 1);
  saveAll();
  renderNotes();
}

/* APA */
function generateAPA() {
  const title = document.getElementById("apaTitle").value;
  const thesis = document.getElementById("apaThesis").value;
  const intro = document.getElementById("apaIntro").value;
  const body1 = document.getElementById("apaBody1").value;
  const body2 = document.getElementById("apaBody2").value;
  const body3 = document.getElementById("apaBody3").value;
  const conclusion = document.getElementById("apaConclusion").value;
  const references = document.getElementById("apaReferences").value;

  const outline =
`APA 7 Paper Outline

Title:
${title || "[Enter your title]"}

Thesis Statement:
${thesis || "[Add your thesis statement]"}

Introduction:
${intro || "[Add background information and opening ideas]"}

Body Paragraph 1:
${body1 || "[Add your first major point with citation support]"}

Body Paragraph 2:
${body2 || "[Add your second major point with citation support]"}

Body Paragraph 3:
${body3 || "[Add your third major point with citation support]"}

Conclusion:
${conclusion || "[Restate your thesis and explain why the issue matters]"}

APA Reminders:
- Use double spacing.
- Use 1-inch margins.
- Include APA in-text citations when using source ideas.
- Include a reference list.
- Cite specific source ideas where they appear.
- Do not rely on one bulk citation at the end of a paragraph if several source ideas are used.

References:
${references || "[Add APA references here]"}`;

  document.getElementById("apaOutput").textContent = outline;
  localStorage.setItem("apaOutput", outline);
}

/* DISCUSSION */
function generateDiscussion() {
  const className = document.getElementById("discussionClass").value;
  const prompt = document.getElementById("discussionPrompt").value;
  const main = document.getElementById("discussionMain").value;
  const personal = document.getElementById("discussionPersonal").value;
  const sources = document.getElementById("discussionSources").value;

  const draft =
`Class:
${className || "[Class name]"}

Discussion Draft:

The main issue in this discussion is ${prompt || "[state the issue from the prompt]"}. My view is that ${main || "[state your main point clearly]"}.

One reason this matters is that legal and social issues usually affect real people, not just rules on paper. ${personal || "[add your personal connection or example here]"}

Based on the course material and outside research, this topic connects to the larger point that students need to explain not only what the rule or concept says, but also why it matters in practice.

Source / Citation Notes:
${sources || "[Add APA citations, Bluebook notes, or source notes here]"}

Reply Question:
How do you think this issue would change if the facts were slightly different?`;

  document.getElementById("discussionOutput").textContent = draft;
  localStorage.setItem("discussionOutput", draft);
}

/* CITATIONS */
function addCitation() {
  const item = {
    type: document.getElementById("citationType").value,
    author: document.getElementById("citationAuthor").value,
    year: document.getElementById("citationYear").value,
    title: document.getElementById("citationTitle").value,
    source: document.getElementById("citationSource").value,
    url: document.getElementById("citationURL").value
  };

  if (!item.author.trim() && !item.title.trim()) {
    alert("Please enter at least an author, case name, title, or source.");
    return;
  }

  citations.push(item);
  saveAll();
  renderCitations();

  document.getElementById("citationAuthor").value = "";
  document.getElementById("citationYear").value = "";
  document.getElementById("citationTitle").value = "";
  document.getElementById("citationSource").value = "";
  document.getElementById("citationURL").value = "";
}

function renderCitations() {
  const list = document.getElementById("citationList");

  if (!list) return;

  if (citations.length === 0) {
    list.innerHTML = "<p class='small'>No citations saved yet.</p>";
    return;
  }

  list.innerHTML = citations.map((c, index) => `
    <div class="item">
      <strong>${escapeHTML(c.type)}</strong>
      <p>${escapeHTML(c.author || "Unknown author")} (${escapeHTML(c.year || "n.d.")}). <i>${escapeHTML(c.title || "Untitled")}</i>. ${escapeHTML(c.source || "")}</p>
      <p class="small">${escapeHTML(c.url || "")}</p>
      <button class="action danger" type="button" onclick="deleteCitation(${index})">Delete</button>
    </div>
  `).join("");
}

function deleteCitation(index) {
  citations.splice(index, 1);
  saveAll();
  renderCitations();
}

/* STUDY CARDS */
function addCard() {
  const item = {
    topic: document.getElementById("cardTopic").value,
    front: document.getElementById("cardFront").value,
    back: document.getElementById("cardBack").value
  };

  if (!item.front.trim() || !item.back.trim()) {
    alert("Please enter both the front and back of the card.");
    return;
  }

  cards.push(item);
  saveAll();
  renderCards();

  document.getElementById("cardTopic").value = "";
  document.getElementById("cardFront").value = "";
  document.getElementById("cardBack").value = "";
}

function renderCards() {
  const list = document.getElementById("cardList");

  if (!list) return;

  if (cards.length === 0) {
    list.innerHTML = "<p class='small'>No study cards saved yet.</p>";
    return;
  }

  list.innerHTML = cards.map((card, index) => `
    <div>
      <div class="flip-card" onclick="this.classList.toggle('flipped')">
        <div class="flip-inner">
          <div class="flip-front">
            <div>
              <p class="small">${escapeHTML(card.topic || "Study Card")}</p>
              <p>${escapeHTML(card.front)}</p>
            </div>
          </div>
          <div class="flip-back">
            <p>${escapeHTML(card.back)}</p>
          </div>
        </div>
      </div>
      <button class="action danger" type="button" onclick="deleteCard(event, ${index})">Delete</button>
    </div>
  `).join("");
}

function deleteCard(event, index) {
  event.stopPropagation();
  cards.splice(index, 1);
  saveAll();
  renderCards();
}

/* CLEARING */
function clearData(type) {
  if (!confirm("Are you sure you want to clear this section?")) return;

  if (type === "assignments") assignments = [];
  if (type === "citations") citations = [];
  if (type === "cards") cards = [];
  if (type === "notes") notes = [];

  saveAll();

  renderAssignments();
  renderCitations();
  renderCards();
  renderNotes();
}

function clearOutput(id) {
  const output = document.getElementById(id);

  if (output) {
    if (id === "apaOutput") output.textContent = "Your APA outline will appear here.";
    if (id === "discussionOutput") output.textContent = "Your discussion post will appear here.";
  }

  if (id === "apaOutput") localStorage.removeItem("apaOutput");
  if (id === "discussionOutput") localStorage.removeItem("discussionOutput");
}

function clearEverything() {
  if (!confirm("This will clear all saved app data. Are you sure?")) return;

  localStorage.clear();

  assignments = [];
  citations = [];
  cards = [];
  notes = [];

  renderAssignments();
  renderCitations();
  renderCards();
  renderNotes();
  renderProfessorRules();

  const translatorOutput = document.getElementById("translatorOutput");
  const grammarOutput = document.getElementById("grammarOutput");
  const apaOutput = document.getElementById("apaOutput");
  const discussionOutput = document.getElementById("discussionOutput");

  if (translatorOutput) translatorOutput.textContent = "Your plain-English explanation will appear here.";
  if (grammarOutput) grammarOutput.textContent = "Your grammar, spelling, and citation reminders will appear here.";
  if (apaOutput) apaOutput.textContent = "Your APA outline will appear here.";
  if (discussionOutput) discussionOutput.textContent = "Your discussion post will appear here.";
}

/* HELPER */
function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* START APP */
function startApp() {
  renderAssignments();
  renderCitations();
  renderCards();
  renderNotes();
  renderProfessorRules();

  const savedAPA = localStorage.getItem("apaOutput");
  const savedDiscussion = localStorage.getItem("discussionOutput");
  const savedTranslator = localStorage.getItem("translatorOutput");
  const savedGrammar = localStorage.getItem("grammarOutput");

  if (savedAPA && document.getElementById("apaOutput")) {
    document.getElementById("apaOutput").textContent = savedAPA;
  }

  if (savedDiscussion && document.getElementById("discussionOutput")) {
    document.getElementById("discussionOutput").textContent = savedDiscussion;
  }

  if (savedTranslator && document.getElementById("translatorOutput")) {
    document.getElementById("translatorOutput").textContent = savedTranslator;
  }

  if (savedGrammar && document.getElementById("grammarOutput")) {
    document.getElementById("grammarOutput").textContent = savedGrammar;
  }

/* Make functions available to HTML buttons */
window.openTab = openTab;
window.openTabById = openTabById;

window.translateLegalText = translateLegalText;
window.clearTranslator = clearTranslator;

window.saveProfessorRules = saveProfessorRules;
window.clearProfessorRules = clearProfessorRules;

window.checkWriting = checkWriting;
window.clearGrammar = clearGrammar;

window.addAssignment = addAssignment;
window.markAssignmentDone = markAssignmentDone;
window.deleteAssignment = deleteAssignment;

window.addNote = addNote;
window.deleteNote = deleteNote;
window.renderNotes = renderNotes;

window.generateAPA = generateAPA;
window.generateDiscussion = generateDiscussion;

window.addCitation = addCitation;
window.deleteCitation = deleteCitation;

window.addCard = addCard;
window.deleteCard = deleteCard;

window.clearData = clearData;
window.clearOutput = clearOutput;
window.clearEverything = clearEverything;

document.addEventListener("DOMContentLoaded", startApp);

window.generateTestQuestion = generateTestQuestion;
window.showTestAnswer = showTestAnswer;
window.clearTestMode = clearTestMode;

}
