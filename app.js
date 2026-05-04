let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let citations = JSON.parse(localStorage.getItem("citations")) || [];
let cards = JSON.parse(localStorage.getItem("cards")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function openTab(tabId, button) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  button.classList.add("active");
}

function openTabById(tabId) {
  const buttonMap = {
    dashboard: 0,
    assignments: 1,
    apa: 2,
    discussion: 3,
    citations: 4,
    cards: 5,
    notes: 6
  };

  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  document.querySelectorAll(".tab-btn")[buttonMap[tabId]].classList.add("active");
}

function saveAll() {
  localStorage.setItem("assignments", JSON.stringify(assignments));
  localStorage.setItem("citations", JSON.stringify(citations));
  localStorage.setItem("cards", JSON.stringify(cards));
  localStorage.setItem("notes", JSON.stringify(notes));
}

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

  if (assignments.length === 0) {
    list.innerHTML = "<p class='small'>No assignments saved yet.</p>";
    return;
  }

  list.innerHTML = assignments.map((a, index) => `
    <div class="item">
      <strong>${a.title}</strong>
      <p><b>Class:</b> ${a.className || "N/A"}</p>
      <p><b>Due:</b> ${a.due || "No date entered"}</p>
      <p><b>Priority:</b> ${a.priority}</p>
      <p><b>Status:</b> ${a.status}</p>
      <p><b>Notes:</b> ${a.notes || "None"}</p>

      <button class="action green" onclick="markAssignmentDone(${index})">Mark Completed</button>
      <button class="action danger" onclick="deleteAssignment(${index})">Delete</button>
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

function generateAPA() {
  const title = document.getElementById("apaTitle").value;
  const thesis = document.getElementById("apaThesis").value;
  const intro = document.getElementById("apaIntro").value;
  const body1 = document.getElementById("apaBody1").value;
  const body2 = document.getElementById("apaBody2").value;
  const body3 = document.getElementById("apaBody3").value;
  const conclusion = document.getElementById("apaConclusion").value;
  const references = document.getElementById("apaReferences").value;

  const outline = `
APA 7 Paper Outline

Title:
${title || "[Enter your title]"}

Thesis Statement:
${thesis || "[Add your thesis statement]"}

Introduction:
${intro || "[Add background information and introduce the main issue]"}

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
- Include in-text citations when using source ideas.
- Include a reference list.
- Do not leave citations until the end of a paragraph if multiple source ideas are used.

References:
${references || "[Add APA references here]"}
`;

  document.getElementById("apaOutput").textContent = outline;
  localStorage.setItem("apaOutput", outline);
}

function generateDiscussion() {
  const className = document.getElementById("discussionClass").value;
  const prompt = document.getElementById("discussionPrompt").value;
  const main = document.getElementById("discussionMain").value;
  const personal = document.getElementById("discussionPersonal").value;
  const sources = document.getElementById("discussionSources").value;

  const draft = `
Class:
${className || "[Class name]"}

Discussion Draft:

The main issue in this discussion is ${prompt || "[state the issue from the prompt]"}. My view is that ${main || "[state your main point clearly]"}.

One reason this matters is that legal and social issues usually affect real people, not just rules on paper. ${personal || "[add your personal connection or example here]"}

Based on the course material and outside research, this topic connects to the larger point that students need to explain not only what the rule or concept says, but also why it matters in practice.

Source / Citation Notes:
${sources || "[Add APA citations or source notes here]"}

Reply Question:
How do you think this issue would change if the facts were slightly different?
`;

  document.getElementById("discussionOutput").textContent = draft;
  localStorage.setItem("discussionOutput", draft);
}

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

  if (citations.length === 0) {
    list.innerHTML = "<p class='small'>No citations saved yet.</p>";
    return;
  }

  list.innerHTML = citations.map((c, index) => `
    <div class="item">
      <strong>${c.type}</strong>
      <p>${c.author || "Unknown author"} (${c.year || "n.d."}). <i>${c.title || "Untitled"}</i>. ${c.source || ""}</p>
      <p class="small">${c.url || ""}</p>

      <button class="action danger" onclick="deleteCitation(${index})">Delete</button>
    </div>
  `).join("");
}

function deleteCitation(index) {
  citations.splice(index, 1);
  saveAll();
  renderCitations();
}

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
              <p class="small">${card.topic || "Study Card"}</p>
              <p>${card.front}</p>
            </div>
          </div>

          <div class="flip-back">
            <p>${card.back}</p>
          </div>
        </div>
      </div>

      <button class="action danger" onclick="deleteCard(event, ${index})">Delete</button>
    </div>
  `).join("");
}

function deleteCard(event, index) {
  event.stopPropagation();
  cards.splice(index, 1);
  saveAll();
  renderCards();
}

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
      <strong>${n.topic || "Untitled Note"}</strong>
      <p><b>Class:</b> ${n.className || "N/A"}</p>
      <p><b>Unit:</b> ${n.unit || "N/A"}</p>
      <p>${n.text}</p>

      <button class="action danger" onclick="deleteNote(${index})">Delete</button>
    </div>
  `).join("");
}

function deleteNote(index) {
  notes.splice(index, 1);
  saveAll();
  renderNotes();
}

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
  document.getElementById(id).textContent = "";

  if (id === "apaOutput") {
    localStorage.removeItem("apaOutput");
  }

  if (id === "discussionOutput") {
    localStorage.removeItem("discussionOutput");
  }
}

window.onload = function () {
  renderAssignments();
  renderCitations();
  renderCards();
  renderNotes();

  const savedAPA = localStorage.getItem("apaOutput");
  const savedDiscussion = localStorage.getItem("discussionOutput");

  if (savedAPA) {
    document.getElementById("apaOutput").textContent = savedAPA;
  }

  if (savedDiscussion) {
    document.getElementById("discussionOutput").textContent = savedDiscussion;
  }
};
