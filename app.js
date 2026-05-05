function translateLegalText() {
  const input = document.getElementById("legalInput").value.trim();
  const level = document.getElementById("translatorLevel").value;
  const output = document.getElementById("translatorOutput");

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
    ["summary judgment", "court decision without a full trial when there is no real dispute over the facts"],
    ["complaint", "document that starts a lawsuit"],
    ["answer", "defendant’s formal response to a complaint"],
    ["petition", "formal written request to a court"],
    ["respondent", "person responding to a petition"],
    ["appellant", "person asking a higher court to review a decision"],
    ["appellee", "person defending the lower court’s decision"]
  ];

  replacements.forEach(pair => {
    const legalWord = pair[0];
    const plainWord = pair[1];
    const regex = new RegExp("\\b" + legalWord + "\\b", "gi");
    translated = translated.replace(regex, plainWord);
  });

  let realLifeExample =
`Real-Life Example:
This matters in real life because legal wording often controls what someone is allowed to do, required to do, or responsible for. For example, in a court case, lease, contract, custody matter, property dispute, or lawsuit, one word can change whether a person has rights, owes money, must respond, or can defend themselves.`;

  let whyImportant =
`Why It Is Important:
This is important because legal language can make a simple issue sound more complicated than it really is. Breaking it into plain English helps you understand the rule, apply it to real facts, and explain it clearly in class or in a legal assignment.`;

  let finalText = "";

  if (level === "full") {
    finalText =
`Plain-English Version:

${translated}

${whyImportant}

${realLifeExample}

How to Use This in Class:
For a discussion post or assignment, explain what the rule means, connect it to the facts, and then explain why the outcome matters to real people.`;
  }

  if (level === "simple") {
    finalText =
`Plain-English Version:

${translated}

Basic Meaning:
This is the simpler version of the legal wording. Look for who is involved, what rule applies, what action is required, and what could happen next.`;
  }

  if (level === "student") {
    finalText =
`Law Student Notes:

Original Legal Text:
${input}

Plain-English Breakdown:
${translated}

Why It Matters:
This helps you identify the legal issue, the rule, the facts, and the possible result. That is the basic structure needed for legal analysis.

Real-Life Circumstance:
In real life, this could affect a person dealing with a lawsuit, contract, property issue, family court matter, criminal case, workplace issue, or landlord-tenant problem.`;
  }

  if (level === "discussion") {
    finalText =
`Discussion Post Explanation:

The legal wording can be understood this way:

${translated}

Why It Matters:
This matters because legal rules are not just words on paper. They affect what people can do, what courts can order, and what responsibilities people may have.

Real-Life Example:
A person dealing with this issue may not understand the legal terms at first. Once the language is put into plain English, it becomes easier to see what rights, duties, or consequences are involved.

Possible Reply Question:
How would the outcome change if one key fact were different?`;
  }

  output.textContent = finalText;
  localStorage.setItem("translatorOutput", finalText);
}
