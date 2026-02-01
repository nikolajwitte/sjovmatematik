// GLOBALE VARIABLER (gemmer i localStorage)
let userData = {
  totalPoints: 0,
  totalCorrect: 0,
  totalAttempts: 0,
  currentLevel: 1,
  lastTopics: {}
};

// HENT DATA FRA LOCALSTORAGE
function loadUserData() {
  const saved = localStorage.getItem('matematikUserData');
  if (saved) {
    userData = JSON.parse(saved);
    updateStatsDisplay();
  }
}

// GEM DATA TIL LOCALSTORAGE
function saveUserData() {
  localStorage.setItem('matematikUserData', JSON.stringify(userData));
}

// OPDATER STATISTIK PÅ FORSIDE
function updateStatsDisplay() {
  if (document.getElementById('totalPoints')) {
    document.getElementById('totalPoints').textContent = userData.totalPoints;
    
    const correctPercentage = userData.totalAttempts > 0 
      ? Math.round((userData.totalCorrect / userData.totalAttempts) * 100)
      : 0;
    document.getElementById('correctAnswers').textContent = correctPercentage + '%';
    
    document.getElementById('currentLevel').textContent = userData.currentLevel;
  }
}

// REGN NYT NIVEAU UD
function calculateNewLevel(isCorrect) {
  userData.totalAttempts++;
  
  if (isCorrect) {
    userData.totalCorrect++;
    userData.totalPoints += 10;
    
    // Hvis de har svaret rigtigt på 5 i træk, stig i niveau
    if (userData.totalCorrect % 5 === 0) {
      userData.currentLevel++;
    }
  } else {
    // Hvis de har svaret forkert på 3 i træk, falder niveau
    const lastFive = userData.totalAttempts % 5;
    if (lastFive === 0 && userData.currentLevel > 1) {
      userData.currentLevel--;
    }
  }
  
  saveUserData();
  return userData.currentLevel;
}

// GENERER TAL BASERET PÅ NIVEAU
function generateNumberForLevel(level, operation) {
  let maxNumber = 10;
  
  if (level <= 3) {
    maxNumber = 10 * level;
  } else if (level <= 6) {
    maxNumber = 20 + (level - 3) * 10;
  } else {
    maxNumber = 50 + (level - 6) * 25;
  }
  
  if (operation === 'division') {
    // For division, sørg for pæne tal
    const factor = Math.floor(Math.random() * 10) + 1;
    const result = Math.floor(Math.random() * maxNumber) + 1;
    return [result * factor, factor]; // resultat, divisor
  }
  
  return Math.floor(Math.random() * maxNumber) + 1;
}

// FEEDBACK FUNKTIONER
function showFeedback(message, isCorrect) {
  const feedbackDiv = document.getElementById('feedback');
  if (!feedbackDiv) return;
  
  feedbackDiv.textContent = message;
  feedbackDiv.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
  
  // Fjern feedback efter 3 sekunder
  setTimeout(() => {
    if (feedbackDiv.textContent === message) {
      feedbackDiv.textContent = '';
      feedbackDiv.className = 'feedback';
    }
  }, 3000);
}

// VIS HJÆLP
function showHelp(operation, tal1, tal2) {
  let helpText = '';
  
  switch(operation) {
    case 'plus':
      helpText = `Prøv at tælle fra ${tal1}. Læg ${tal2} til: ${tal1} + ${tal2} = ${tal1 + tal2}`;
      break;
    case 'minus':
      helpText = `Start med ${tal1}. Træk ${tal2} fra: ${tal1} - ${tal2} = ${tal1 - tal2}`;
      break;
    case 'gange':
      helpText = `${tal1} ganget med ${tal2} er det samme som ${tal1} lagt sammen ${tal2} gange`;
      break;
    case 'division':
      helpText = `Hvor mange gange kan ${tal2} gå op i ${tal1}? Prøv at dele ${tal1} i ${tal2} lige store dele`;
      break;
  }
  
  const feedbackDiv = document.getElementById('feedback');
  feedbackDiv.textContent = helpText;
  feedbackDiv.className = 'feedback hjelp';
}

// KØR NÅR SIDEN INDLÆSES
document.addEventListener('DOMContentLoaded', function() {
  loadUserData();
  
  // Tilføj event listeners til alle hjælpeknapper
  const helpButtons = document.querySelectorAll('.help-btn');
  helpButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const operation = this.dataset.operation;
      const tal1 = parseInt(this.dataset.tal1);
      const tal2 = parseInt(this.dataset.tal2);
      showHelp(operation, tal1, tal2);
    });
  });
});