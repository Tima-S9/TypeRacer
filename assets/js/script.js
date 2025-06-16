// Typing test sample texts by difficulty
const typingTexts = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Typing is fun and helps you learn fast.",
    "Cats sleep on soft beds every afternoon."
  ],
  medium: [
    "Learning to type quickly improves your productivity and accuracy.",
    "Practice makes perfect, so keep typing every single day.",
    "The curious child asked many questions about the world around him."
  ],
  hard: [
    "She realized that the intricacies of quantum mechanics required intense concentration and dedication.",
    "Despite the inclement weather, the determined marathon runners persevered through the challenging course.",
    "The philosophical debate regarding free will versus determinism has persisted for centuries among scholars."
  ]
};

// Get DOM elements
const difficultySelect = document.querySelector('select[aria-label="Difficulty select"]');
const instructionTextarea = document.querySelector('textarea[readonly]');
// Get DOM elements for timer and buttons
const startButton = document.querySelector('button.btn-outline-warning.bg-white.text-black:nth-child(1)');
const stopButton = document.querySelector('button.btn-outline-warning.bg-white.text-black:nth-child(2)');
const resultTime = document.getElementById('result-time');
const typingInput = document.querySelector('input[aria-label="Typing input"]');
const resultWpm = document.getElementById('result-wpm');
const resultLevel = document.getElementById('result-level');

let startTime = null;
let endTime = null;
let timerRunning = false;

// Function to get random text from selected difficulty
function getRandomText(level) {
  const texts = typingTexts[level];
  if (!texts) return "";
  const idx = Math.floor(Math.random() * texts.length);
  return texts[idx];
}

// Add a div to display the sample text with color feedback
let feedbackDiv = document.getElementById('typing-feedback');
if (!feedbackDiv) {
  feedbackDiv = document.createElement('div');
  feedbackDiv.id = 'typing-feedback';
  feedbackDiv.style.maxWidth = '600px';
  feedbackDiv.style.margin = '16px auto';
  feedbackDiv.style.fontSize = '1.2rem';
  feedbackDiv.style.minHeight = '48px';
  feedbackDiv.style.wordBreak = 'break-word';
  instructionTextarea.parentNode.insertBefore(feedbackDiv, instructionTextarea);
}

// Function to update live feedback colors
function updateTypingFeedback() {
  const sampleText = instructionTextarea.value;
  const userInput = typingInput.value;

  const sampleWords = sampleText.trim().split(/\s+/);
  const userWords = userInput.trim().split(/\s+/);

  let feedbackHTML = '';
  for (let i = 0; i < sampleWords.length; i++) {
    let color = '';
    if (userWords[i] !== undefined) {
      color = userWords[i] === sampleWords[i] ? 'blue' : 'red';
    }
    feedbackHTML += `<span style="color:${color};">${sampleWords[i]}</span> `;
  }
  feedbackDiv.innerHTML = feedbackHTML.trim();
}

// Function to update the textarea with a random text
function updateTypingText() {
  const level = difficultySelect.value;
  const randomText = getRandomText(level);
  instructionTextarea.value = randomText || "Click the input tab to begin the test";
  typingInput.value = "";
  updateTypingFeedback();
}

// Function to start the typing test
function startTest() {
  startButton.disabled = true;
  stopButton.disabled = false;
  startTime = performance.now();
  timerRunning = true;
  if (resultTime) resultTime.textContent = "Time: 0s";
}

// Function to stop the typing test and display elapsed time
function stopTest() {
  if (!timerRunning) return;
  endTime = performance.now();
  timerRunning = false;
  startButton.disabled = false;
  stopButton.disabled = true;
  const elapsed = ((endTime - startTime) / 1000).toFixed(2);
  if (resultTime) resultTime.textContent = `Time: ${elapsed}s`;
  displayResults(Number(elapsed));
}

// Function to count correctly typed words
function countCorrectWords(userInput, sampleText) {
  const userWords = userInput.trim().split(/\s+/);
  const sampleWords = sampleText.trim().split(/\s+/);
  let correct = 0;
  for (let i = 0; i < userWords.length && i < sampleWords.length; i++) {
    if (userWords[i] === sampleWords[i]) correct++;
  }
  return correct;
}

// Function to display WPM and difficulty level
function displayResults(timeSeconds) {
  const userInput = typingInput.value;
  const sampleText = instructionTextarea.value;
  const correctWords = countCorrectWords(userInput, sampleText);
  const wpm = timeSeconds > 0 ? Math.round((correctWords / timeSeconds) * 60) : 0;
  if (resultWpm) resultWpm.textContent = `WPM: ${wpm}`;
  if (resultLevel) resultLevel.textContent = `Level: ${difficultySelect.value.charAt(0).toUpperCase() + difficultySelect.value.slice(1)}`;
}

// Event listener for difficulty change
difficultySelect.addEventListener('change', updateTypingText);

// Update feedback when user types
typingInput.addEventListener('input', updateTypingFeedback);

// Add event listeners for start and stop buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateTypingText();
  if (startButton) startButton.disabled = false;
  if (stopButton) stopButton.disabled = true;
  if (startButton) startButton.addEventListener('click', startTest);
  if (stopButton) stopButton.addEventListener('click', stopTest);
});

