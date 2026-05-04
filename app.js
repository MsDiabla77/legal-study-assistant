document.addEventListener("DOMContentLoaded", function () {

  // TAB SWITCHING
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tool-panel");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const target = tab.getAttribute("data-tab");

      tabs.forEach(function (t) {
        t.classList.remove("active");
      });

      panels.forEach(function (p) {
        p.classList.remove("active");
      });

      tab.classList.add("active");

      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add("active");
      }
    });
  });

  // TRANSLATOR
  const legalInput = document.getElementById("legalInput");
  const translationOutput = document.getElementById("translationOutput");

  const translateBtn = document.getElementById("translateBtn");
  if (translateBtn) {
    translateBtn.addEventListener("click", function () {
      const text = legalInput.value.trim();

      if (!text) {
        translationOutput.value = "Please paste legal text first.";
        return;
      }

      translationOutput.value =
        "PLAIN EXPLANATION:\n" +
        "This is saying: " + text + "\n\n" +

        "WHAT IT REALLY MEANS:\n" +
        "This is explaining a legal rule, duty, or responsibility.\n\n" +

        "REAL-LIFE EXAMPLE:\n" +
        "This could affect how a real legal situation is handled.\n\n" +

        "WHY IT MATTERS:\n" +
        "Legal wording can change rights, duties, and outcomes.";
    });
  }

  const copyTranslation = document.getElementById("copyTranslation");
  if (copyTranslation) {
    copyTranslation.addEventListener("click", function () {
      translationOutput.select();
      document.execCommand("copy");
    });
  }

  const clearTranslator = document.getElementById("clearTranslator");
  if (clearTranslator) {
    clearTranslator.addEventListener("click", function () {
      legalInput.value = "";
      translationOutput.value = "";
    });
  }

});