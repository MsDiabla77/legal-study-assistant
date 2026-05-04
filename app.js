document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tool-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const target = tab.getAttribute("data-tab");
      tabs.forEach(t => t.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      tab.classList.add("active");

      const panel = document.getElementById(target);
      if (panel) panel.classList.add("active");
    });
  });

  // TRANSLATOR
  const legalInput = document.getElementById("legalInput");
  const translationOutput = document.getElementById("translationOutput");

  document.getElementById("translateBtn")?.addEventListener("click", function () {
    const text = legalInput.value.trim();

    if (!text) {
      translationOutput.value = "Please paste legal text first.";
      return;
    }

    translationOutput.value =
      "PLAIN EXPLANATION:\nThis is saying: " + text + "\n\n" +
      "WHAT IT REALLY MEANS:\nThis is explaining a legal rule, duty, or responsibility.\n\n" +
      "REAL-LIFE EXAMPLE:\nThis could affect how a real legal situation is handled.\n\n" +
      "WHY IT MATTERS:\nLegal wording can change rights, duties, and outcomes.";
  });

  document.getElementById("copyTranslation")?.addEventListener("click", function () {
    translationOutput.select();
    document.execCommand("copy");
  });

  document.getElementById("clearTranslator")?.addEventListener("click", function () {
    legalInput.value = "";
    translationOutput.value = "";
  });

  // CITATIONS
  function getCitationFields() {
    return {
      author: document.getElementById("citeAuthor")?.value.trim() || "",
      title: document.getElementById("citeTitle")?.value.trim() || "",
      source: document.getElementById("citeSource")?.value.trim() || "",
      year: document.getElementById("citeYear")?.value.trim() || "",
      url: document.getElementById("citeURL")?.value.trim() || ""
    };
  }

  document.getElementById("makeAPA")?.addEventListener("click", function () {
    const c = getCitationFields();
    const author = c.author || "[Author]";
    const year = c.year || "[Year]";
    const title = c.title || "[Title]";
    const source = c.source || "[Source]";
    const url = c.url || "[URL]";
    const lastName = author.includes(",") ? author.split(",")[0] : author;

    document.getElementById("citationOutput").value =
      "APA 7 Reference:\n" +
      author + " (" + year + "). " + title + ". " + source + ". " + url + "\n\n" +
      "APA In-Text Citation:\n" +
      "(" + lastName + ", " + year + ")";
  });

  document.getElementById("makeBluebook")?.addEventListener("click", function () {
    const c = getCitationFields();

    document.getElementById("citationOutput").value =
      "Bluebook-style Citation:\n" +
      (c.author || "[Author]") + ", " +
      (c.title || "[Title]") + ", " +
      (c.source || "[Source]") + " (" +
      (c.year || "[Year]") + "), " +
      (c.url || "[URL]") + ".\n\n" +
      "Text marker idea: [1]";
  });

  document.getElementById("clearCitations")?.addEventListener("click", function () {
    document.getElementById("citeAuthor").value = "";
    document.getElementById("citeTitle").value = "";
    document.getElementById("citeSource").value = "";
    document.getElementById("citeYear").value = "";
    document.getElementById("citeURL").value = "";
    document.getElementById("citationOutput").value = "";
  });

  // APA PAPER
  document.getElementById("formatAPA")?.addEventListener("click", function () {
    const title = document.getElementById("paperTitle")?.value.trim() || "[Paper Title]";
    const name = document.getElementById("studentName")?.value.trim() || "[Your Name]";
    const school = document.getElementById("schoolName")?.value.trim() || "[School Name]";
    const course = document.getElementById("courseName")?.value.trim() || "[Course Name]";
    const instructor = document.getElementById("instructorName")?.value.trim() || "[Instructor Name]";
    const dueDate = document.getElementById("dueDate")?.value.trim() || "[Due Date]";
    const body = document.getElementById("paperBody")?.value.trim() || "[Paper body goes here]";
    const refs = document.getElementById("paperReferences")?.value.trim() || "[References go here]";

    document.getElementById("apaPaperOutput").value =
      title + "\n\n" +
      name + "\n" +
      school + "\n" +
      course + "\n" +
      instructor + "\n" +
      dueDate + "\n\n\n" +
      title + "\n\n" +
      body + "\n\n\n" +
      "References\n\n" +
      refs + "\n\n" +
      "APA 7 REMINDERS:\n" +
      "- Double-space the paper in Word.\n" +
      "- Use 1-inch margins.\n" +
      "- Use a readable APA-approved font.\n" +
      "- Add page numbers in the top right.\n" +
      "- Use hanging indent on references.";
  });

  document.getElementById("copyAPAPaper")?.addEventListener("click", function () {
    const apaOutput = document.getElementById("apaPaperOutput");
    apaOutput.select();
    document.execCommand("copy");
  });

  document.getElementById("clearAPAPaper")?.addEventListener("click", function () {
    document.getElementById("paperTitle").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("schoolName").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("instructorName").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("paperBody").value = "";
    document.getElementById("paperReferences").value = "";
    document.getElementById("apaPaperOutput").value = "";
  });

  // STUDY CARDS
  const addStudyCard = document.getElementById("addStudyCard");
  const clearStudyCardForm = document.getElementById("clearStudyCardForm");
  const clearAllStudyCards = document.getElementById("clearAllStudyCards");
  const studyCardList = document.getElementById("studyCardList");

  function getCards() {
    return JSON.parse(localStorage.getItem("studyCards") || "[]");
  }

  function saveCards(cards) {
    localStorage.setItem("studyCards", JSON.stringify(cards));
  }

  function loadStudyCards() {
    if (!studyCardList) return;
    const cards = getCards();
    studyCardList.innerHTML = "";

    if (cards.length === 0) {
      studyCardList.innerHTML = "<p>No study cards saved yet. Add one above.</p>";
      return;
    }

    cards.forEach(function (card, index) {
      const wrapper = document.createElement("div");
      wrapper.className = "study-card";

      wrapper.innerHTML =
        "<div class='study-card-inner'>" +
          "<div class='study-card-front'>" +
            "<h3>" + (card.term || "Untitled Card") + "</h3>" +
            "<p><strong>Class:</strong> " + (card.className || "Not listed") + "</p>" +
            "<p><strong>Chapter:</strong> " + (card.chapter || "Not listed") + "</p>" +
            "<p><strong>Question:</strong> " + (card.question || "No question added") + "</p>" +
            "<button type='button' class='flipCard'>Flip Card</button>" +
            "<button type='button' class='deleteCard'>Delete</button>" +
          "</div>" +
          "<div class='study-card-back'>" +
            "<h3>Answer / Notes</h3>" +
            "<p><strong>Answer:</strong> " + (card.answer || "No answer added") + "</p>" +
            "<p><strong>Notes:</strong> " + (card.notes || "No notes added") + "</p>" +
            "<p><strong>Example:</strong> " + (card.example || "No example added") + "</p>" +
            "<button type='button' class='flipCard'>Flip Back</button>" +
            "<button type='button' class='deleteCard'>Delete</button>" +
          "</div>" +
        "</div>";

      wrapper.querySelectorAll(".flipCard").forEach(function (button) {
        button.addEventListener("click", function () {
          wrapper.classList.toggle("flipped");
        });
      });

      wrapper.querySelectorAll(".deleteCard").forEach(function (button) {
        button.addEventListener("click", function () {
          const updatedCards = getCards();
          updatedCards.splice(index, 1);
          saveCards(updatedCards);
          loadStudyCards();
        });
      });

      studyCardList.appendChild(wrapper);
    });
  }

  addStudyCard?.addEventListener("click", function () {
    const card = {
      className: document.getElementById("cardClass")?.value.trim() || "",
      chapter: document.getElementById("cardChapter")?.value.trim() || "",
      term: document.getElementById("cardTerm")?.value.trim() || "",
      notes: document.getElementById("cardNotes")?.value.trim() || "",
      example: document.getElementById("cardExample")?.value.trim() || "",
      question: document.getElementById("cardQuestion")?.value.trim() || "",
      answer: document.getElementById("cardAnswer")?.value.trim() || ""
    };

    if (!card.term && !card.notes && !card.question) {
      alert("Add at least a term, note, or question first.");
      return;
    }

    const cards = getCards();
    cards.push(card);
    saveCards(cards);
    loadStudyCards();
  });

  clearStudyCardForm?.addEventListener("click", function () {
    document.getElementById("cardClass").value = "";
    document.getElementById("cardChapter").value = "";
    document.getElementById("cardTerm").value = "";
    document.getElementById("cardNotes").value = "";
    document.getElementById("cardExample").value = "";
    document.getElementById("cardQuestion").value = "";
    document.getElementById("cardAnswer").value = "";
  });

  clearAllStudyCards?.addEventListener("click", function () {
    localStorage.removeItem("studyCards");
    loadStudyCards();
  });

  loadStudyCards();
});
