const scoreBar = document.getElementById("scoreBar");
const questionText = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const photoWrap = document.getElementById("photoWrap");

const endCard = document.getElementById("endCard");
const endTitle = document.getElementById("endTitle");
const endMsg = document.getElementById("endMsg");
const restartBtn = document.getElementById("restartBtn");

const reaction = document.getElementById("reaction");
const reactionEmoji = document.getElementById("reactionEmoji");
const reactionText = document.getElementById("reactionText");

const cardInner = document.getElementById("cardInner");

const quiz = [
  {
    q: "When did we first meet?",
    choices: ["Jan 2015", "June 2015", "Jan 2016"],
    correctIndex: 1,
    correctEmoji: "💖",
    correctText: "Correct!",
    showPhoto: false
  },
  {
    q: "What was my first valentines gift to you?",
    choices: ["Flowers", "Apple Watch", "Chocolates"],
    correctIndex: 1,
    correctEmoji: "⌚️💘",
    correctText: "Correct!",
    showPhoto: false
  },
  {
    q: "Where did we click this photo?",
    choices: ["Palm Springs", "Jim Thorpe", "Florida"],
    correctIndex: 2,
    correctEmoji: "🌴💖",
    correctText: "Correct!",
    showPhoto: true
  },
  {
    q: "Tell me where do you want to travel next?",
    choices: ["Greece", "Switzerland", "Japan"],
    correctIndex: -1,                 // special
    correctEmoji: "✨✈️",
    correctText: "India, Noted!!",    // always show this
    showPhoto: false
  }
];

let idx = 0;
let score = 0;
let locked = false;

function updateScoreUI(){
  scoreBar.textContent = `Score: ${score}/4`;
}

function disableChoices(){
  document.querySelectorAll(".choiceBtn").forEach(b => b.disabled = true);
}

function getWrongEmoji(){
  return Math.random() < 0.5 ? "🔥" : "😡";
}

/** Ensure reaction never appears on load */
function hideReaction(){
  reaction.classList.remove("show");
  reaction.hidden = true;
  reaction.setAttribute("aria-hidden", "true");
}

/** Pop reaction smoothly on demand */
function showReaction(emoji, text){
  // Guarantee hidden on start
  hideReaction();

  // Set content
  reactionEmoji.textContent = emoji;
  reactionText.textContent = text;

  // Restart pop animations reliably
  reactionEmoji.style.animation = "none";
  reactionText.style.animation = "none";
  // force reflow
  void reactionEmoji.offsetWidth;

  // Restore animations (match your existing keyframes names)
  reactionEmoji.style.animation = "pop 520ms ease forwards";
  reactionText.style.animation = "fadeUp 520ms ease forwards";

  reaction.hidden = false;
  reaction.setAttribute("aria-hidden", "false");
  // small tick to allow transition
  requestAnimationFrame(() => reaction.classList.add("show"));

  // auto hide after a beat
  setTimeout(() => hideReaction(), 750);
}

/** Smoothly swap question content */
function transitionToNext(renderFn){
  // fade out current
  cardInner.classList.add("fadeOut");
  // after fade out, change content, then fade in
  setTimeout(() => {
    renderFn();

    cardInner.classList.remove("fadeOut");
    cardInner.classList.add("fadeIn");

    requestAnimationFrame(() => {
      // fade to normal
      cardInner.classList.remove("fadeIn");
    });
  }, 280);
}

function renderQuestion(){
  locked = false;

  const item = quiz[idx];
  questionText.textContent = item.q;
  photoWrap.style.display = item.showPhoto ? "block" : "none";

  choicesEl.innerHTML = "";
  item.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.type = "button";
    btn.textContent = choice;
    btn.addEventListener("click", () => onChoice(i));
    choicesEl.appendChild(btn);
  });

  updateScoreUI();
  hideReaction(); // ✅ critical: never show on page load or between transitions
}

function onChoice(choiceIndex){
  if (locked) return;
  locked = true;
  disableChoices();

  const item = quiz[idx];

  // Determine correctness
  const isAlwaysCorrect = (idx === 3); // Q4
  const isCorrect = isAlwaysCorrect || (choiceIndex === item.correctIndex);

  if (isCorrect) score += 1;
  updateScoreUI();

  // Emoji rules
  const emoji = isCorrect ? item.correctEmoji : getWrongEmoji();

  // Text rules
  const text =
    (idx === 3) ? "India, Noted!!" :
    (isCorrect ? item.correctText : "Wrong 😈");

  // Show reaction first
  showReaction(emoji, text);

  // Move to next question after the reaction begins
  setTimeout(() => {
    idx += 1;
    if (idx >= quiz.length) finish();
    else transitionToNext(renderQuestion);
  }, 820);
}

function finish(){
  hideReaction();

  // Show end card with rule: >=3 passes
  endCard.hidden = false;

  if (score >= 3) {
    endTitle.textContent = "🎉 Congrats!";
    endMsg.textContent = "Thank you for being my valentine";
    restartBtn.textContent = "Play Again";
  } else {
    endTitle.textContent = "Try again 😅";
    endMsg.textContent = "Going back to question 1…";
    restartBtn.textContent = "Try Again";
    // Auto return to Q1 after a second
    setTimeout(() => restartGame(), 1100);
  }
}

function restartGame(){
  idx = 0;
  score = 0;
  updateScoreUI();
  endCard.hidden = true;

  // Smoothly bring back Q1
  transitionToNext(renderQuestion);
}

restartBtn.addEventListener("click", restartGame);

// Start clean
endCard.hidden = true;
hideReaction();
renderQuestion();
