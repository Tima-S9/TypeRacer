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

// Function to update the textarea with a random text
function updateTypingText() {
  const level = difficultySelect.value;
  const randomText = getRandomText(level);
  instructionTextarea.value = randomText || "Click the input tab to begin the test";
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
}

// Event listener for difficulty change
difficultySelect.addEventListener('change', updateTypingText);

// Add event listeners for start and stop buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateTypingText();
  if (startButton) startButton.disabled = false;
  if (stopButton) stopButton.disabled = true;
  if (startButton) startButton.addEventListener('click', startTest);
  if (stopButton) stopButton.addEventListener('click', stopTest);
});

