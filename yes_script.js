const scoreBar = document.getElementById("scoreBar");
const questionText = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const photoWrap = document.getElementById("photoWrap");

const quizCard = document.getElementById("quizCard");
const cardInner = document.getElementById("cardInner");

const endCard = document.getElementById("endCard");
const endTitle = document.getElementById("endTitle");
const endMsg = document.getElementById("endMsg");
const restartBtn = document.getElementById("restartBtn");

const reactionEmojiWrap = document.getElementById("reactionEmojiWrap");
const reactionEmoji = document.getElementById("reactionEmoji");
const reactionTextWrap = document.getElementById("reactionTextWrap");
const reactionText = document.getElementById("reactionText");

// Your questions with better-fitting emojis
const quiz = [
  {
    q: "When did we first meet?",
    choices: ["Jan 2015", "June 2015", "Jan 2016"],
    correctIndex: 1,
    correctEmoji: "🗓️💜",
    correctText: "Correct!",
    showPhoto: false
  },
  {
    q: "What was my first valentines gift to you?",
    choices: ["Flowers", "Apple Watch", "Chocolates"],
    correctIndex: 1,
    correctEmoji: "⌚️💝",
    correctText: "Correct!",
    showPhoto: false
  },
  {
    q: "Where did we click this photo?",
    choices: ["Palm Springs", "Jim Thorpe", "Florida"],
    correctIndex: 2,
    correctEmoji: "🌴☀️💜",
    correctText: "Correct!",
    showPhoto: true
  },
  {
    q: "Tell me where do you want to travel next?",
    choices: ["Greece", "Switzerland", "Japan"],
    correctIndex: -1, // any answer correct
    correctEmoji: "🇮🇳✨",
    correctText: "India, Noted!!",
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

function hideReactions(){
  reactionEmojiWrap.classList.remove("show");
  reactionTextWrap.classList.remove("show");
  reactionEmojiWrap.hidden = true;
  reactionTextWrap.hidden = true;
  reactionEmojiWrap.setAttribute("aria-hidden", "true");
  reactionTextWrap.setAttribute("aria-hidden", "true");
}

function showReactions(emoji, text){
  // start hidden
  hideReactions();

  reactionEmoji.textContent = emoji;
  reactionText.textContent = text;

  reactionEmojiWrap.hidden = false;
  reactionTextWrap.hidden = false;
  reactionEmojiWrap.setAttribute("aria-hidden", "false");
  reactionTextWrap.setAttribute("aria-hidden", "false");

  // trigger transitions
  requestAnimationFrame(() => {
    reactionEmojiWrap.classList.add("show");
    reactionTextWrap.classList.add("show");
  });

  // auto-hide after a beat (so next question is clean)
  setTimeout(() => hideReactions(), 1500);
}

function transitionToNext(renderFn){
  cardInner.classList.add("fadeOut");
  setTimeout(() => {
    renderFn();
    cardInner.classList.remove("fadeOut");
    cardInner.classList.add("fadeIn");
    requestAnimationFrame(() => cardInner.classList.remove("fadeIn"));
  }, 420);
}

function renderQuestion(){
  locked = false;
  hideReactions();

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
}

function onChoice(choiceIndex){
  if (locked) return;
  locked = true;
  disableChoices();

  const item = quiz[idx];

  const isQ4 = (idx === 3);
  const isCorrect = isQ4 || (choiceIndex === item.correctIndex);

  if (isCorrect) score += 1;
  updateScoreUI();

  const emoji = isCorrect ? item.correctEmoji : getWrongEmoji();
  const text =
    isQ4 ? "India, Noted!!" :
    isCorrect ? item.correctText :
    "Wrong 😈";

  // show emoji + text (above and below card)
  showReactions(emoji, text);

  setTimeout(() => {
    idx += 1;
    if (idx >= quiz.length) finish();
    else transitionToNext(renderQuestion);
  }, 1700);
}



function showFinalEmoji(emoji){
  // Show emoji only, and DO NOT auto-hide
  hideReactions();

  reactionEmoji.textContent = emoji;
  reactionText.textContent = ""; // no text below card for final

  reactionEmojiWrap.hidden = false;
  reactionTextWrap.hidden = true; // keep final clean
  reactionEmojiWrap.setAttribute("aria-hidden", "false");
  reactionTextWrap.setAttribute("aria-hidden", "true");

  requestAnimationFrame(() => {
    reactionEmojiWrap.classList.add("show");
  });
}



function finish(){
  hideReactions();

  // Hide quiz card, show end card
  quizCard.hidden = true;
  endCard.hidden = false;

  if (score >= 3) {
    // ✅ Success
    showFinalEmoji("😍");

    endTitle.textContent = "Congrats!";
    endMsg.textContent = "Thank you for playing and being my valentine!";
    restartBtn.hidden = true; // ✅ no play again button
  } else {
    // ❌ Try again
    showFinalEmoji("😞");

    endTitle.textContent = "Try again";
    endMsg.textContent = "You got this. Click Try Again to restart from question 1.";
    restartBtn.textContent = "Try Again";
    restartBtn.hidden = false; // ✅ show button
  }
}




// function restartGame(){
//   idx = 0;
//   score = 0;
//   updateScoreUI();

//   endCard.hidden = true;
//   quizCard.hidden = false;

//   transitionToNext(renderQuestion);
// }

function restartGame(){
  idx = 0;
  score = 0;
  updateScoreUI();

  endCard.hidden = true;
  quizCard.hidden = false;

  restartBtn.hidden = false; // ✅ reset for future runs
  transitionToNext(renderQuestion);
}


restartBtn.addEventListener("click", restartGame);

// Start clean
endCard.hidden = true;
quizCard.hidden = false;
hideReactions();
renderQuestion();
