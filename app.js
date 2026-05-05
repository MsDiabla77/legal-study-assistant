const STORAGE_KEYS = {
  assignments: "legalHelper_assignments",
  citations: "legalHelper_citations",
  cards: "legalHelper_cards",
  notes: "legalHelper_notes",
  translatorInput: "legalHelper_translatorInput",
  translatorOutput: "legalHelper_translatorOutput",
  professorRules: "legalHelper_professorRules",
  grammarOutput: "legalHelper_grammarOutput",
  discussionOutput: "legalHelper_discussionOutput",
  apaOutput: "legalHelper_apaOutput",
  testQuestion: "legalHelper_testQuestion",
  testAnswerHidden: "legalHelper_testAnswerHidden",
  testAnswerShown: "legalHelper_testAnswerShown"
};

let assignments = loadArray(STORAGE_KEYS.assignments);
let citations = loadArray(STORAGE_KEYS.citations);
let cards = loadArray(STORAGE_KEYS.cards);
let notes = loadArray(STORAGE_KEYS.notes);
let currentTestAnswer = localStorage.getItem(STORAGE_KEYS.testAnswerHidden) || "";

document.addEventListener("DOMContentLoaded", startApp);

function startApp() {
  setupTabs();
  setupDashboardCards();
  setupButtons();

  renderAssignments();
  renderCitations();
  renderCards();
  renderNotes();
  renderProfessorRules();

  restoreSavedOutputs();
}

/* -------------------------
   SETUP
-------------------------- */

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", () => {
      openTab(button.dataset.tab);
    });
  });
}

function setupDashboardCards() {
  document.querySelectorAll("[data-open]").forEach(card => {
    card.addEventListener("click", () => {
      openTab(card.dataset.open);
    });
  });
}

function setupButtons() {
  bind("printPageBtn", () => window.print());
  bind("clearEverythingBtn", clearEverything);

  bind("translateBtn", translateLegalText);
  bind("saveTranslatorToNotesBtn", saveTranslatorToNotes);
  bind("clearTranslatorBtn", clearTranslator);

  bind("generateQuestionBtn", generateTestQuestion);
  bind("showAnswerBtn", showTestAnswer);
  bind("clearTestBtn", clearTestMode);

  bind("saveProfessorBtn", saveProfessorRules);
  bind("clearProfessorBtn", clearProfessorRules);

  bind("checkWritingBtn", checkWriting);
  bind("clearGrammarBtn", clearGrammar);

  bind("addAssignmentBtn", addAssignment);
  bind("clearAssignmentsBtn", () => clearData("assignments"));

  bind("addNoteBtn", addNote);
  bind("clearNotesBtn", () => clearData("notes"));
  bind("noteSearch", renderNotes, "input");

  bind("addCardBtn", addCard);
  bind("clearCardsBtn", () => clearData("cards"));

  bind("generateDiscussionBtn", generateDiscussionIdeas);
  bind("clearDiscussionBtn", clearDiscussion);

  bind("generateApaBtn", generateAPA);
  bind("clearApaBtn", clearAPA);

  bind("addCitationBtn", addCitation);
  bind("clearCitationsBtn", () => clearData("citations"));
}

function bind(id, handler, event = "click") {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener(event, handler);
  }
}

/* -------------------------
   TABS
-------------------------- */

function openTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".tab-btn").forEach(button => {
    button.classList.remove("active");
  });

  const tab = document.getElementById(tabId);
  const button = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);

  if (tab) tab.classList.add("active");
  if (button) button.classList.add("active");
}

/* -------------------------
   TRANSLATOR
-------------------------- */

function translateLegalText() {
  const input = getValue("legalInput").trim();
  const style = getValue("translatorStyle") || "full";
  const output = document.getElementById("translatorOutput");

  if (!output) return;

  if (!input) {
    alert("Please paste legal text first.");
    return;
  }

  const plain = plainEnglish(input);

  const whyItMatters =
`Why It Is Important:
This matters because legal wording can control rights, deadlines, property, money, custody, responsibility, court decisions, and what a person must do next. If someone does not understand the legal language, they may miss a deadline, give up a right, misunderstand a court order, or fail to protect themselves.`;

  const realLife =
`Real-Life Circumstance:
In real life, this kind of wording could show up in a lease, contract, custody case, probate matter, lawsuit, property dispute, workplace issue, or court filing. Plain English makes it easier to see who has a duty, who has a right, what the rule is, and what could happen next.`;

  let result = "";

  if (style === "simple") {
    result =
`Plain-English Version:

${plain}

Basic Meaning:
This is the simpler version of the legal wording. Look for who is involved, what rule applies, what action is required, and what result could happen.`;
  } else if (style === "student") {
    result =
`Law Student Notes:

Original Text:
${input}

Plain-English Breakdown:
${plain}

${whyItMatters}

Study Tip:
Use this to find the issue, rule, facts, application, and likely conclusion.`;
  } else if (style === "discussion") {
    result =
`Discussion Explanation:

The legal wording can be understood this way:

${plain}

${whyItMatters}

${realLife}

Possible Discussion Angle:
A good response could explain how this rule affects real people instead of only defining the legal term.`;
  } else {
    result =
`Plain-English Version:

${plain}

${whyItMatters}

${realLife}

How to Use This in Class:
Use this as a starting point for class notes, discussion boards, or studying. First, explain the legal rule in plain English. Then connect it to a real-life situation, such as a court case, contract, family issue, property dispute, workplace problem, or school-related example. Finally, explain why the rule matters by showing how it could affect a person’s rights, responsibilities, money, property, freedom, or future outcome.

  }

  output.textContent = result;

  localStorage.setItem(STORAGE_KEYS.translatorInput, input);
  localStorage.setItem(STORAGE_KEYS.translatorOutput, result);
}

function plainEnglish(text) {
  let translated = text;

  const replacements = [
    ["pursuant to", "under"],
    ["in accordance with", "under"],
    ["heretofore", "before now"],
    ["hereafter", "from now on"],
    ["thereafter", "after that"],
    ["whereas", "because / considering that"],
    ["notwithstanding", "despite"],
    ["shall", "must"],
    ["may", "is allowed to"],
    ["party", "person or side in the case"],
    ["plaintiff", "person who brings the lawsuit"],
    ["defendant", "person being sued or accused"],
    ["petitioner", "person asking the court to do something"],
    ["respondent", "person responding to the request"],
    ["jurisdiction", "the court’s legal power to hear the case"],
    ["liable", "legally responsible"],
    ["liability", "legal responsibility"],
    ["damages", "money awarded for harm or loss"],
    ["statute", "written law passed by the government"],
    ["precedent", "earlier court decision used as an example"],
    ["motion", "formal request asking the court to do something"],
    ["affidavit", "written statement made under oath"],
    ["cause of action", "legal reason someone can sue"],
    ["burden of proof", "duty to prove something is true"],
    ["prima facie", "enough evidence at first look"],
    ["pro se", "representing yourself without a lawyer"],
    ["discovery", "process where both sides exchange evidence"],
    ["hearsay", "secondhand statement that may not be allowed as evidence"],
    ["contract", "agreement that can be enforced by law"],
    ["consideration", "something of value exchanged in a contract"],
    ["breach", "breaking a legal duty or agreement"],
    ["tort", "civil wrong that causes harm"],
    ["negligence", "failure to use reasonable care"],
    ["reasonable person", "what an ordinary careful person would do"],
    ["summary judgment", "court decision without a full trial when there is no real dispute over important facts"],
    ["complaint", "document that starts a lawsuit"],
    ["answer", "defendant’s formal response to a complaint"],
    ["petition", "formal written request to a court"],
    ["appellant", "person asking a higher court to review a decision"],
    ["appellee", "person defending the lower court’s decision"],
    ["easement", "legal right to use someone else’s property for a specific purpose"],
    ["deed", "legal document used to transfer ownership of real property"],
    ["title", "legal ownership or right to own property"],
    ["probate", "court process for handling someone’s estate after death"],
    ["custody", "legal responsibility and decision-making for a child"]
  ];

  replacements.forEach(([legal, plain]) => {
    const safeTerm = legal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("\\b" + safeTerm + "\\b", "gi");
    translated = translated.replace(regex, plain);
  });

  return translated;
}

function saveTranslatorToNotes() {
  const output = localStorage.getItem(STORAGE_KEYS.translatorOutput) || getText("translatorOutput");

  if (!output || output.includes("Your plain-English explanation")) {
    alert("Translate something first, then save it to notes.");
    return;
  }

  notes.push({
    className: "Legal Study Helper",
    unit: "Translator",
    topic: "Plain-English Legal Translation",
    text: output
  });

  saveAll();
  renderNotes();
  alert("Translation saved to Class Notes.");
}

function clearTranslator() {
  setValue("legalInput", "");
  setText("translatorOutput", "Your plain-English explanation will appear here.");
  localStorage.removeItem(STORAGE_KEYS.translatorInput);
  localStorage.removeItem(STORAGE_KEYS.translatorOutput);
}

/* -------------------------
   TEST MODE
-------------------------- */

function generateTestQuestion() {
  const source = getValue("testSource") || "all";
  const difficulty = getValue("testDifficulty") || "easy";

  const pool = buildQuestionPool(source);

  if (pool.length === 0) {
    setText("testQuestion", "No questions available yet. Add translator text, class notes, or flash cards first.");
    setText("testAnswer", "The answer will appear here after you click Show Answer.");
    currentTestAnswer = "";
    return;
  }

  const item = pool[Math.floor(Math.random() * pool.length)];

  const difficultyNote = {
    easy: "Answer in simple terms.",
    medium: "Answer with a definition and one example.",
    hard: "Answer with the rule, why it matters, and a real-life circumstance."
  };

  const question =
`${item.question}

Difficulty: ${difficulty}
${difficultyNote[difficulty] || difficultyNote.easy}`;

  setText("testQuestion", question);
  setText("testAnswer", "The answer will appear here after you click Show Answer.");

  currentTestAnswer = item.answer;

  localStorage.setItem(STORAGE_KEYS.testQuestion, question);
  localStorage.setItem(STORAGE_KEYS.testAnswerHidden, currentTestAnswer);
  localStorage.setItem(STORAGE_KEYS.testAnswerShown, "");
}

function buildQuestionPool(source) {
  const pool = [];

  const translatorInput = localStorage.getItem(STORAGE_KEYS.translatorInput) || getValue("legalInput");
  const translatorOutput = localStorage.getItem(STORAGE_KEYS.translatorOutput) || "";

  if ((source === "all" || source === "translator") && translatorInput.trim()) {
    pool.push({
      question: `Using the text from the Translator, explain the main legal idea in your own words:\n\n"${shortenText(translatorInput, 400)}"`,
      answer: translatorOutput || "Explain the legal wording in plain English, why it matters, and give one real-life example."
    });
  }

  if (source === "all" || source === "notes") {
    notes.forEach(note => {
      pool.push({
        question: `From your Class Notes, explain this topic:\n\nClass: ${note.className || "N/A"}\nTopic: ${note.topic || "Untitled"}\n\nWhat is the most important point?`,
        answer: note.text || "Review the saved note and explain it in your own words."
      });
    });
  }

  if (source === "all" || source === "flashcards") {
    cards.forEach(card => {
      pool.push({
        question: `Flash Card Question:\n\n${card.front}`,
        answer: card.back
      });
    });
  }

  const builtIn = getBuiltInQuestions();

  if (source === "all" || source === "legal") pool.push(...builtIn.legal);
  if (source === "all" || source === "apa") pool.push(...builtIn.apa);
  if (source === "all" || source === "civil") pool.push(...builtIn.civil);
  if (source === "all" || source === "realestate") pool.push(...builtIn.realestate);

  return pool;
}

function getBuiltInQuestions() {
  return {
    legal: [
      {
        question: "What does jurisdiction mean?",
        answer: "Jurisdiction means the court has legal authority to hear and decide a case."
      },
      {
        question: "What is the difference between a plaintiff and a defendant?",
        answer: "The plaintiff brings the lawsuit. The defendant is the person being sued or accused."
      },
      {
        question: "What does liability mean?",
        answer: "Liability means legal responsibility for an act, harm, debt, or legal duty."
      },
      {
        question: "What is negligence?",
        answer: "Negligence means failing to use reasonable care, which causes harm to someone else."
      }
    ],
    apa: [
      {
        question: "What belongs in a basic APA in-text citation?",
        answer: "A basic APA in-text citation usually includes the author’s last name and year, such as (Smith, 2024)."
      },
      {
        question: "Why is a reference list required in APA?",
        answer: "A reference list gives full source information so the reader can find the sources used."
      },
      {
        question: "Why is one citation at the end of a paragraph sometimes not enough?",
        answer: "Because multiple sentences may contain different source ideas, and the reader needs to know which source supports which sentence."
      }
    ],
    civil: [
      {
        question: "What is discovery in civil litigation?",
        answer: "Discovery is the process where both sides exchange evidence, documents, and information before trial."
      },
      {
        question: "What is a complaint in a civil case?",
        answer: "A complaint is the document that starts a lawsuit and explains the claims against the defendant."
      },
      {
        question: "What is summary judgment?",
        answer: "Summary judgment is when the court decides a case or issue without a full trial because there is no real dispute about important facts."
      }
    ],
    realestate: [
      {
        question: "What is an easement?",
        answer: "An easement is a legal right to use someone else’s property for a specific purpose, such as a driveway or utility line."
      },
      {
        question: "What is a deed?",
        answer: "A deed is a legal document used to transfer ownership of real property."
      },
      {
        question: "What is title in real estate?",
        answer: "Title means legal ownership or the legal right to own and use property."
      }
    ]
  };
}

function showTestAnswer() {
  if (!currentTestAnswer) {
    currentTestAnswer = localStorage.getItem(STORAGE_KEYS.testAnswerHidden) || "";
  }

  if (!currentTestAnswer) {
    alert("Generate a question first.");
    return;
  }

  const answer =
`Answer:

${currentTestAnswer}

Study Tip:
Say the answer out loud in your own words. Then add one real-life example so you know you actually understand it.`;

  setText("testAnswer", answer);
  localStorage.setItem(STORAGE_KEYS.testAnswerShown, answer);
}

function clearTestMode() {
  currentTestAnswer = "";
  setText("testQuestion", "Your test question will appear here.");
  setText("testAnswer", "The answer will appear here after you click Show Answer.");
  localStorage.removeItem(STORAGE_KEYS.testQuestion);
  localStorage.removeItem(STORAGE_KEYS.testAnswerHidden);
  localStorage.removeItem(STORAGE_KEYS.testAnswerShown);
}

/* -------------------------
   PROFESSOR MODE
-------------------------- */

function saveProfessorRules() {
  const rules = {
    className: getValue("professorClass"),
    professorName: getValue("professorName"),
    citationStyle: getValue("citationStyle"),
    initialDue: getValue("initialDue"),
    replyDue: getValue("replyDue"),
    replyRequirement: getValue("replyRequirement"),
    professorRules: getValue("professorRules")
  };

  localStorage.setItem(STORAGE_KEYS.professorRules, JSON.stringify(rules));
  renderProfessorRules();
}

function renderProfessorRules() {
  const output = document.getElementById("professorOutput");
  if (!output) return;

  const saved = safeJSON(localStorage.getItem(STORAGE_KEYS.professorRules), null);

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
  localStorage.removeItem(STORAGE_KEYS.professorRules);

  clearFields([
    "professorClass",
    "professorName",
    "initialDue",
    "replyDue",
    "replyRequirement",
    "professorRules"
  ]);

  renderProfessorRules();
}

/* -------------------------
   GRAMMAR CHECK
-------------------------- */

function checkWriting() {
  const text = getValue("grammarInput").trim();
  const mode = getValue("grammarMode");
  const output = document.getElementById("grammarOutput");

  if (!output) return;

  if (!text) {
    alert("Please paste your writing first.");
    return;
  }

  const issues = [];
  const padded = ` ${text.toLowerCase()} `;

  const commonFixes = [
    [" alot ", "Use “a lot,” not “alot.”"],
    [" gonna ", "Use “going to” for school writing."],
    [" wanna ", "Use “want to” for school writing."],
    [" dont ", "Use “don’t.”"],
    [" doesnt ", "Use “doesn’t.”"],
    [" cant ", "Use “can’t.”"],
    [" wont ", "Use “won’t.”"],
    [" im ", "Use “I’m.”"],
    [" u ", "Use “you.”"],
    [" cuz ", "Use “because.”"],
    [" thru ", "Use “through.”"]
  ];

  commonFixes.forEach(([bad, fix]) => {
    if (padded.includes(bad)) issues.push(fix);
  });

  if (text.length < 150 && mode !== "discussion") {
    issues.push("This may be too short for a full assignment paragraph. Add more explanation, facts, or support.");
  }

  if (!/[.!?]$/.test(text)) {
    issues.push("Your writing may need a clear ending punctuation mark.");
  }

  if (text.split(".").some(sentence => sentence.trim().split(" ").length > 38)) {
    issues.push("At least one sentence may be too long. Consider breaking it into two shorter sentences.");
  }

  if (!text.includes("(") && !text.includes(")") && !text.includes("[") && !text.includes("]")) {
    issues.push("No obvious in-text citation found. If you used a source, add APA or legal citation support.");
  }

  if (mode === "legal") {
    issues.push("Legal writing reminder: identify the issue, rule, application, and conclusion when possible.");
    issues.push("Citation reminder: use Bluebook or the professor-required style for cases, statutes, and regulations.");
  }

  if (mode === "discussion") {
    issues.push("Discussion reminder: include a clear main point, a real-life/practical connection, and a follow-up question if required.");
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
  localStorage.setItem(STORAGE_KEYS.grammarOutput, result);
}

function clearGrammar() {
  setValue("grammarInput", "");
  setText("grammarOutput", "Your grammar, spelling, and citation reminders will appear here.");
  localStorage.removeItem(STORAGE_KEYS.grammarOutput);
}

/* -------------------------
   ASSIGNMENTS
-------------------------- */

function addAssignment() {
  const item = {
    className: getValue("assignmentClass"),
    title: getValue("assignmentTitle"),
    due: getValue("assignmentDue"),
    priority: getValue("assignmentPriority"),
    status: getValue("assignmentStatus"),
    notes: getValue("assignmentNotes")
  };

  if (!item.title.trim()) {
    alert("Please enter an assignment title.");
    return;
  }

  assignments.push(item);
  saveAll();
  renderAssignments();

  clearFields(["assignmentClass", "assignmentTitle", "assignmentDue", "assignmentNotes"]);
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
      <p><b>Priority:</b> ${escapeHTML(a.priority || "N/A")}</p>
      <p><b>Status:</b> ${escapeHTML(a.status || "N/A")}</p>
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

/* -------------------------
   NOTES
-------------------------- */

function addNote() {
  const item = {
    className: getValue("noteClass"),
    unit: getValue("noteUnit"),
    topic: getValue("noteTopic"),
    text: getValue("noteText")
  };

  if (!item.text.trim()) {
    alert("Please enter note text.");
    return;
  }

  notes.push(item);
  saveAll();
  renderNotes();

  clearFields(["noteClass", "noteUnit", "noteTopic", "noteText"]);
}

function renderNotes() {
  const list = document.getElementById("noteList");
  if (!list) return;

  const search = getValue("noteSearch").toLowerCase();

  const filtered = notes.filter(note =>
    (note.className || "").toLowerCase().includes(search) ||
    (note.unit || "").toLowerCase().includes(search) ||
    (note.topic || "").toLowerCase().includes(search) ||
    (note.text || "").toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    list.innerHTML = "<p class='small'>No matching notes saved yet.</p>";
    return;
  }

  list.innerHTML = filtered.map((note, index) => `
    <div class="item">
      <strong>${escapeHTML(note.topic || "Untitled Note")}</strong>
      <p><b>Class:</b> ${escapeHTML(note.className || "N/A")}</p>
      <p><b>Unit:</b> ${escapeHTML(note.unit || "N/A")}</p>
      <p>${escapeHTML(note.text || "")}</p>
      <button class="action danger" type="button" onclick="deleteNote(${index})">Delete</button>
    </div>
  `).join("");
}

function deleteNote(index) {
  notes.splice(index, 1);
  saveAll();
  renderNotes();
}

/* -------------------------
   FLASH CARDS
-------------------------- */

function addCard() {
  const item = {
    topic: getValue("cardTopic"),
    front: getValue("cardFront"),
    back: getValue("cardBack")
  };

  if (!item.front.trim() || !item.back.trim()) {
    alert("Please enter both the front and back of the card.");
    return;
  }

  cards.push(item);
  saveAll();
  renderCards();

  clearFields(["cardTopic", "cardFront", "cardBack"]);
}

function renderCards() {
  const list = document.getElementById("cardList");
  if (!list) return;

  if (cards.length === 0) {
    list.innerHTML = "<p class='small'>No flash cards saved yet.</p>";
    return;
  }

  list.innerHTML = cards.map((card, index) => `
    <div>
      <div class="flip-card" onclick="this.classList.toggle('flipped')">
        <div class="flip-inner">
          <div class="flip-front">
            <div>
              <p class="small">${escapeHTML(card.topic || "Flash Card")}</p>
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

/* -------------------------
   DISCUSSION IDEAS
-------------------------- */

function generateDiscussionIdeas() {
  const className = getValue("discussionClass");
  const prompt = getValue("discussionPrompt");
  const main = getValue("discussionMain");
  const personal = getValue("discussionPersonal");
  const sources = getValue("discussionSources");

  const ideas =
`Discussion Response Ideas

Class:
${className || "[Class name]"}

Prompt / Classmate’s Point:
${prompt || "[Add the prompt or classmate’s point]"}

Possible Response Angles:

1. Plain-English Angle:
Explain the topic in simple terms first. This works well when the prompt uses legal, academic, or confusing wording.

2. Real-Life Angle:
Connect the issue to something a person could actually deal with, such as court, family, property, work, school, contracts, or responsibility.

3. Agree and Add:
Agree with one part of the classmate’s idea, then add another fact, example, risk, or consequence.

4. Respectfully Complicate It:
Point out that the answer could change depending on the facts, the people involved, the law applied, or the evidence available.

5. Source-Based Angle:
Use a textbook, article, law, case, or regulation to support one point instead of making the whole reply opinion-based.

Your Main Thought:
${main || "[Add your main thought]"}

Real-Life Connection You Could Use:
${personal || "[Add a personal or practical connection]"}

Citation / Source Reminder:
${sources || "[Add APA, Bluebook, textbook, article, case, statute, or source notes]"}

Reply Starter Ideas:
- “I see your point, especially because…”
- “One thing I would add is…”
- “This made me think about how the rule would apply if…”
- “I agree with your main idea, but I also think…”
- “A real-life example of this could be…”

Follow-Up Question Ideas:
- “How do you think the outcome would change if one key fact were different?”
- “Would your answer change if this involved a court order or legal deadline?”
- “What would be the fairest result in a real-life situation like this?”`;

  setText("discussionOutput", ideas);
  localStorage.setItem(STORAGE_KEYS.discussionOutput, ideas);
}

function clearDiscussion() {
  setText("discussionOutput", "Your discussion response ideas will appear here.");
  localStorage.removeItem(STORAGE_KEYS.discussionOutput);
}

/* -------------------------
   APA PAPER
-------------------------- */

function generateAPA() {
  const title = getValue("apaTitle");
  const thesis = getValue("apaThesis");
  const intro = getValue("apaIntro");
  const body1 = getValue("apaBody1");
  const body2 = getValue("apaBody2");
  const body3 = getValue("apaBody3");
  const conclusion = getValue("apaConclusion");
  const references = getValue("apaReferences");

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
- Cite source ideas where they appear.
- Do not rely on one bulk citation at the end of a paragraph if several source ideas are used.

References:
${references || "[Add APA references here]"}`;

  setText("apaOutput", outline);
  localStorage.setItem(STORAGE_KEYS.apaOutput, outline);
}

function clearAPA() {
  setText("apaOutput", "Your APA outline will appear here.");
  localStorage.removeItem(STORAGE_KEYS.apaOutput);
}

/* -------------------------
   CITATIONS
-------------------------- */

function addCitation() {
  const item = {
    type: getValue("citationType"),
    author: getValue("citationAuthor"),
    year: getValue("citationYear"),
    title: getValue("citationTitle"),
    source: getValue("citationSource"),
    url: getValue("citationURL")
  };

  if (!item.author.trim() && !item.title.trim()) {
    alert("Please enter at least an author, case name, title, or source.");
    return;
  }

  citations.push(item);
  saveAll();
  renderCitations();

  clearFields([
    "citationAuthor",
    "citationYear",
    "citationTitle",
    "citationSource",
    "citationURL"
  ]);
}

function renderCitations() {
  const list = document.getElementById("citationList");
  if (!list) return;

  if (citations.length === 0) {
    list.innerHTML = "<p class='small'>No citations saved yet.</p>";
    return;
  }

  list.innerHTML = citations.map((citation, index) => `
    <div class="item">
      <strong>${escapeHTML(citation.type || "Citation")}</strong>
      <p>${escapeHTML(citation.author || "Unknown author")} (${escapeHTML(citation.year || "n.d.")}). <i>${escapeHTML(citation.title || "Untitled")}</i>. ${escapeHTML(citation.source || "")}</p>
      <p class="small">${escapeHTML(citation.url || "")}</p>
      <button class="action danger" type="button" onclick="deleteCitation(${index})">Delete</button>
    </div>
  `).join("");
}

function deleteCitation(index) {
  citations.splice(index, 1);
  saveAll();
  renderCitations();
}

/* -------------------------
   CLEARING
-------------------------- */

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

function clearEverything() {
  if (!confirm("This will clear all saved app data. Are you sure?")) return;

  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));

  assignments = [];
  citations = [];
  cards = [];
  notes = [];
  currentTestAnswer = "";

  renderAssignments();
  renderCitations();
  renderCards();
  renderNotes();
  renderProfessorRules();

  setText("translatorOutput", "Your plain-English explanation will appear here.");
  setText("testQuestion", "Your test question will appear here.");
  setText("testAnswer", "The answer will appear here after you click Show Answer.");
  setText("grammarOutput", "Your grammar, spelling, and citation reminders will appear here.");
  setText("discussionOutput", "Your discussion response ideas will appear here.");
  setText("apaOutput", "Your APA outline will appear here.");
}

/* -------------------------
   SAVING / RESTORING
-------------------------- */

function saveAll() {
  localStorage.setItem(STORAGE_KEYS.assignments, JSON.stringify(assignments));
  localStorage.setItem(STORAGE_KEYS.citations, JSON.stringify(citations));
  localStorage.setItem(STORAGE_KEYS.cards, JSON.stringify(cards));
  localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
}

function restoreSavedOutputs() {
  const translatorInput = localStorage.getItem(STORAGE_KEYS.translatorInput);
  const translatorOutput = localStorage.getItem(STORAGE_KEYS.translatorOutput);
  const grammarOutput = localStorage.getItem(STORAGE_KEYS.grammarOutput);
  const discussionOutput = localStorage.getItem(STORAGE_KEYS.discussionOutput);
  const apaOutput = localStorage.getItem(STORAGE_KEYS.apaOutput);
  const testQuestion = localStorage.getItem(STORAGE_KEYS.testQuestion);
  const testAnswerShown = localStorage.getItem(STORAGE_KEYS.testAnswerShown);

  if (translatorInput) setValue("legalInput", translatorInput);
  if (translatorOutput) setText("translatorOutput", translatorOutput);
  if (grammarOutput) setText("grammarOutput", grammarOutput);
  if (discussionOutput) setText("discussionOutput", discussionOutput);
  if (apaOutput) setText("apaOutput", apaOutput);
  if (testQuestion) setText("testQuestion", testQuestion);
  if (testAnswerShown) setText("testAnswer", testAnswerShown);
}

/* -------------------------
   HELPERS
-------------------------- */

function loadArray(key) {
  const parsed = safeJSON(localStorage.getItem(key), []);
  return Array.isArray(parsed) ? parsed : [];
}

function safeJSON(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getValue(id) {
  const element = document.getElementById(id);
  return element ? element.value : "";
}

function setValue(id, value) {
  const element = document.getElementById(id);
  if (element) element.value = value;
}

function getText(id) {
  const element = document.getElementById(id);
  return element ? element.textContent : "";
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function clearFields(ids) {
  ids.forEach(id => setValue(id, ""));
}

function shortenText(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* -------------------------
   WINDOW FUNCTIONS FOR DELETE BUTTONS
-------------------------- */

window.markAssignmentDone = markAssignmentDone;
window.deleteAssignment = deleteAssignment;
window.deleteNote = deleteNote;
window.deleteCard = deleteCard;
window.deleteCitation = deleteCitation;
