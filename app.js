let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let citations = JSON.parse(localStorage.getItem("citations")) || [];
let cards = JSON.parse(localStorage.getItem("cards")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentTestAnswer = localStorage.getItem("testAnswerHidden") || "";

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
  if (selectedTab) selectedTab.classList.add("active");
  if (button) button.classList.add("active");
}

function openTabById(tabId) {
  const tabNames = {
    dashboard: "Dashboard",
    translator: "Translator",
    testmode: "Test Me",
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
  if (selectedTab) selectedTab.classList.add("active");

  document.querySelectorAll(".tab-btn").forEach(btn => {
    if (btn.textContent.trim() === tabNames[tabId]) {
      btn.classList.add("active");
    }
  });
}

/* ---------------------------
   TRANSLATOR
---------------------------- */

function translateLegalText() {
  const inputBox = document.getElementById("legalInput");
  const levelBox = document.getElementById("translatorLevel");
  const output = document.getElementById("translatorOutput");

  if (!inputBox || !output) {
    alert("Translator section is missing the correct IDs.");
    return;
  }

  const input = inputBox.value.trim();
  const level = levelBox ? levelBox.value : "full";

  if (!input) {
    alert("Please paste legal text first.");
    return;
  }

  let translated = input;

  const replacements = [
    ["pursuant to", "under"],
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
    ["summary judgment", "court decision without a full trial when there is no real dispute over the important facts"],
    ["complaint", "document that starts a lawsuit"],
    ["answer", "defendant’s formal response to a complaint"],
    ["petition", "formal written request to a court"],
    ["respondent", "person responding to a petition"],
    ["appellant", "person asking a higher court to review a decision"],
    ["appellee", "person defending the lower court’s decision"],
    ["easement", "legal right to use someone else’s property for a specific purpose"],
    ["deed", "legal document used to transfer ownership of real property"],
    ["title", "legal ownership or right to own property"],
    ["probate", "court process for handling someone’s estate after death"],
    ["custody", "legal responsibility and decision-making for a child"]
  ];

  replacements.forEach(([legalWord, plainWord]) => {
    const regex = new RegExp("\\b" + legalWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
    translated = translated.replace(regex, plainWord);
  });

  const whyImportant =
`Why It Is Important:
This matters because legal wording controls rights, duties, deadlines, money, property, custody, court decisions, and personal responsibility. When the language is confusing, a person may not understand what they are required to do or what protection they may have.`;

  const realLife =
`Real-Life Circumstance:
In real life, this could come up in a lawsuit, lease, contract, custody case, probate matter, property dispute, workplace issue, or court filing. A person may read the legal wording and feel lost, but once it is put into plain English, it becomes easier to see who has a duty, who has a right, and what may happen next.`;

  let finalText = "";

  if (level === "simple") {
    finalText =
`Plain-English Version:

${translated}

Basic Meaning:
This is the simpler version of the legal wording. Look for who is involved, what rule applies, what action is required, and what result could happen.`;
  } else if (level === "student") {
    finalText =
`Law Student Notes:

Original Legal Text:
${input}

Plain-English Breakdown:
${translated}

${whyImportant}

Study Tip:
Use this to find the issue, rule, facts, application, and likely conclusion.`;
  } else if (level === "discussion") {
    finalText =
`Discussion Explanation:

The legal wording can be understood this way:

${translated}

${whyImportant}

${realLife}

Possible Discussion Angle:
A good response could explain how this rule affects real people instead of only defining the legal term.`;
  } else {
    finalText =
`Plain-English Version:

${translated}

${whyImportant}

${realLife}

How to Use This in Class:
Explain what the rule means, connect it to a real situation, and then explain why the outcome matters.`;
  }

  output.textContent = finalText;

  localStorage.setItem("translatorInput", input);
  localStorage.setItem("translatorOutput", finalText);
}

function clearTranslator() {
  const input = document.getElementById("legalInput");
  const output = document.getElementById("translatorOutput");

  if (input) input.value = "";
  if (output) output.textContent = "Your plain-English explanation will appear here.";

  localStorage.removeItem("translatorInput");
  localStorage.removeItem("translatorOutput");
}

/* ---------------------------
   TEST ME — LINKED TO TRANSLATOR, NOTES, FLASHCARDS
---------------------------- */

function generateTestQuestion() {
  const topicBox = document.getElementById("testTopic");
  const difficultyBox = document.getElementById("testDifficulty");
  const questionBox = document.getElementById("testQuestion");
  const answerBox = document.getElementById("testAnswer");

  if (!questionBox || !answerBox) {
    alert("Test Mode section is missing the correct IDs.");
    return;
  }

  const topic = topicBox ? topicBox.value : "legalTerms";
  const difficulty = difficultyBox ? difficultyBox.value : "easy";

  const linkedQuestions = [];

  const translatorText =
    (document.getElementById("legalInput") && document.getElementById("legalInput").value.trim()) ||
    localStorage.getItem("translatorInput") ||
    "";

  if (translatorText) {
    linkedQuestions.push({
      q: `Using the text from the Translator, explain the main legal idea in your own words:\n\n"${shortenText(translatorText, 350)}"`,
      a: "Your answer should identify the main legal rule or issue, explain it in plain English, and give one real-life example."
    });
  }

  notes.forEach(note => {
    linkedQuestions.push({
      q: `From your Class Notes, explain this topic:\n\nClass: ${note.className || "N/A"}\nTopic: ${note.topic || "Untitled"}\n\nWhat is the most important point?`,
      a: note.text || "Review your saved note and explain the main point in your own words."
    });
  });

  cards.forEach(card => {
    linkedQuestions.push({
      q: `Flash Card Question:\n\n${card.front}`,
      a: card.back
    });
  });

  const builtIn = {
    legalTerms: [
      {
        q: "What does jurisdiction mean?",
        a: "Jurisdiction means the court has legal authority to hear and decide a case."
      },
      {
        q: "What is the difference between a plaintiff and a defendant?",
        a: "The plaintiff brings the lawsuit. The defendant is the person being sued or accused."
      },
      {
        q: "What does liability mean?",
        a: "Liability means legal responsibility for an act, harm, debt, or duty."
      }
    ],
    apa: [
      {
        q: "What belongs in an APA in-text citation?",
        a: "Usually the author’s last name and year, such as (Smith, 2024)."
      },
      {
        q: "Why does APA require a reference list?",
        a: "The reference list gives full source information so readers can find the sources."
      }
    ],
    citations: [
      {
        q: "When should APA be used instead of Bluebook?",
        a: "APA is usually used for scholarly articles, textbooks, websites, and general academic sources. Bluebook is used for legal authority like cases and statutes when required."
      },
      {
        q: "Why is one citation at the end of a paragraph sometimes not enough?",
        a: "Because several sentences may contain different source ideas, and the reader needs to know which source supports which sentence."
      }
    ],
    civil: [
      {
        q: "What is discovery in civil litigation?",
        a: "Discovery is the process where both sides exchange evidence, documents, and information before trial."
      },
      {
        q: "What is a complaint in a civil case?",
        a: "A complaint starts the lawsuit and states the claims against the defendant."
      }
    ],
    realestate: [
      {
        q: "What is an easement?",
        a: "An easement is a legal right to use someone else’s property for a specific purpose."
      },
      {
        q: "What is a deed?",
        a: "A deed is a legal document used to transfer ownership of real property."
      }
    ]
  };

  let questionPool = [];

  if (topic === "legalTerms") questionPool = builtIn.legalTerms;
  if (topic === "apa") questionPool = builtIn.apa;
  if (topic === "citations") questionPool = builtIn.citations;
  if (topic === "civil") questionPool = builtIn.civil;
  if (topic === "realestate") questionPool = builtIn.realestate;

  questionPool = questionPool.concat(linkedQuestions);

  if (questionPool.length === 0) {
    questionBox.textContent = "No questions available yet. Add class notes, flash cards, or translator text first.";
    answerBox.textContent = "The answer will appear here after you click Show Answer.";
    currentTestAnswer = "";
    return;
  }

  const randomItem = questionPool[Math.floor(Math.random() * questionPool.length)];

  let difficultyNote = "";
  if (difficulty === "easy") {
    difficultyNote = "Answer in simple terms.";
  }
  if (difficulty === "medium") {
    difficultyNote = "Answer with the definition and one example.";
  }
  if (difficulty === "hard") {
    difficultyNote = "Answer with the rule, why it matters, and a real-life circumstance.";
  }

  questionBox.textContent =
`${randomItem.q}

Difficulty: ${difficulty}
${difficultyNote}`;

  answerBox.textContent = "Click Show Answer when you are ready.";
  currentTestAnswer = randomItem.a;

  localStorage.setItem("testQuestion", questionBox.textContent);
  localStorage.setItem("testAnswerHidden", currentTestAnswer);
  localStorage.setItem("testAnswerShown", "");
}

function showTestAnswer() {
  const answerBox = document.getElementById("testAnswer");

  if (!answerBox) return;

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
Say the answer out loud in your own words. Then add one real-life example so you know you actually understand it.`;

  localStorage.setItem("testAnswerShown", answerBox.textContent);
}

function clearTestMode() {
  currentTestAnswer = "";

  const questionBox = document.getElementById("testQuestion");
  const answerBox = document.getElementById("testAnswer");

  if (questionBox) questionBox.textContent = "Your test question will appear here.";
  if (answerBox) answerBox.textContent = "The answer will appear here after you click Show Answer.";

  localStorage.removeItem("testQuestion");
  localStorage.removeItem("testAnswerHidden");
  localStorage.removeItem("testAnswerShown");
}

/* ---------------------------
   PROFESSOR MODE
---------------------------- */

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

  ["professorClass", "professorName", "initialDue", "replyDue", "replyRequirement", "professorRules"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  renderProfessorRules();
}

/* ---------------------------
   GRAMMAR CHECK
---------------------------- */

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
    issues.push("At least one sentence may be too long. Consider breaking it into two sentences.");
  }

  if (!text.includes("(") && !text.includes(")") && !text.includes("[") && !text.includes("]")) {
    issues.push("No obvious in-text citation found. If you used a source, add APA or legal citation support.");
  }

  if (mode === "legal") {
    issues.push("Legal writing reminder: identify the issue, rule, application, and conclusion when possible.");
  }

  if (mode === "discussion") {
    issues.push("Discussion reminder: include a clear main point, personal/practical connection, and an open-ended question if required.");
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
  const input = document.getElementById("grammarInput");
  const output = document.getElementById("grammarOutput");

  if (input) input.value = "";
  if (output) output.textContent = "Your grammar, spelling, and citation reminders will appear here.";

  localStorage.removeItem("grammarOutput");
}

/* ---------------------------
   ASSIGNMENTS
---------------------------- */

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

/* ---------------------------
   NOTES
---------------------------- */

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
  const search = getValue("noteSearch").toLowerCase();

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

/* ---------------------------
   APA
---------------------------- */

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
- Cite specific source ideas where they appear.

References:
${references || "[Add APA references here]"}`;

  const output = document.getElementById("apaOutput");
  if (output) output.textContent = outline;

  localStorage.setItem("apaOutput", outline);
}

/* ---------------------------
   DISCUSSION — IDEA GENERATOR, NOT FULL POST
---------------------------- */

function generateDiscussion() {
  const className = getValue("discussionClass");
  const prompt = getValue("discussionPrompt");
  const main = getValue("discussionMain");
  const personal = getValue("discussionPersonal");
  const sources = getValue("discussionSources");

  const ideas =
`Discussion Response Ideas

Class:
${className || "[Class name]"}

Prompt / Topic:
${prompt || "[Add the discussion prompt]"}

Possible Angles You Could Respond With:

1. Explain the rule or concept in plain English.
Use this when the prompt has legal, social, or academic wording that classmates may interpret differently.

2. Connect the topic to a real-life situation.
You could connect this to a court case, family issue, workplace issue, property issue, school situation, or everyday responsibility.

3. Agree, but add another point.
A good reply could say the classmate made a strong point, then add another fact, example, or consequence they did not mention.

4. Respectfully disagree or complicate the issue.
You could explain that the answer may change depending on the facts, the people involved, or the rule being applied.

5. Ask a thoughtful follow-up question.
Example: “How do you think the outcome would change if one important fact were different?”

Your Main Thought:
${main || "[Add your main idea here]"}

Personal / Real-Life Connection You Could Use:
${personal || "[Add a personal or practical connection here]"}

Source or Citation Reminder:
${sources || "[Add APA or Bluebook citation notes here if required]"}

Reply Starter Ideas:
- “I see your point, especially because…”
- “One thing I would add is…”
- “This made me think about how the rule would apply if…”
- “I agree with your main idea, but I also think…”
- “A real-life example of this could be…”`;

  const output = document.getElementById("discussionOutput");
  if (output) output.textContent = ideas;

  localStorage.setItem("discussionOutput", ideas);
}

/* ---------------------------
   CITATIONS
---------------------------- */

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

  clearFields(["citationAuthor", "citationYear", "citationTitle", "citationSource", "citationURL"]);
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

/* ---------------------------
   STUDY CARDS
---------------------------- */

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

/* ---------------------------
   CLEARING
---------------------------- */

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
    if (id === "discussionOutput") output.textContent = "Your discussion ideas will appear here.";
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
  currentTestAnswer = "";

  renderAssignments();
  renderCitations();
  renderCards();
  renderNotes();
  renderProfessorRules();

  setText("translatorOutput", "Your plain-English explanation will appear here.");
  setText("grammarOutput", "Your grammar, spelling, and citation reminders will appear here.");
  setText("apaOutput", "Your APA outline will appear here.");
  setText("discussionOutput", "Your discussion ideas will appear here.");
  setText("testQuestion", "Your test question will appear here.");
  setText("testAnswer", "The answer will appear here after you click Show Answer.");
}

/* ---------------------------
   HELPERS
---------------------------- */

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function clearFields(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
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

/* ---------------------------
   START APP
---------------------------- */

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
  const savedTestQuestion = localStorage.getItem("testQuestion");
  const savedTestAnswerShown = localStorage.getItem("testAnswerShown");
  const savedTestAnswerHidden = localStorage.getItem("testAnswerHidden");

  if (savedAPA) setText("apaOutput", savedAPA);
  if (savedDiscussion) setText("discussionOutput", savedDiscussion);
  if (savedTranslator) setText("translatorOutput", savedTranslator);
  if (savedGrammar) setText("grammarOutput", savedGrammar);
  if (savedTestQuestion) setText("testQuestion", savedTestQuestion);
  if (savedTestAnswerShown) setText("testAnswer", savedTestAnswerShown);
  if (savedTestAnswerHidden) currentTestAnswer = savedTestAnswerHidden;
}

/* Make functions available to HTML buttons */
window.openTab = openTab;
window.openTabById = openTabById;

window.translateLegalText = translateLegalText;
window.clearTranslator = clearTranslator;

window.generateTestQuestion = generateTestQuestion;
window.showTestAnswer = showTestAnswer;
window.clearTestMode = clearTestMode;

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
