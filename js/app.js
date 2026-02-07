// app.js - Kompatibel med plus.html
// GLOBALE VARIABLER
window.MathApp = {
  userData: null,
  
  // Indlæs data fra localStorage
  loadUserData: function() {
    const saved = localStorage.getItem('mathAppUserData');
    if (saved) {
      this.userData = JSON.parse(saved);
    } else {
      // Initial data
      this.userData = {
        totalPoints: 0,
        totalCorrect: 0,
        totalAttempts: 0,
        topics: {
          plus: {
            streak: 0,
            level: 1,
            correct: 0,
            attempts: 0
          },
          minus: {
            streak: 0,
            level: 1,
            correct: 0,
            attempts: 0
          }
        }
      };
    }
    this.updateStatsDisplay();
    return this.userData;
  },
  
  // Gem data til localStorage
  saveUserData: function() {
    localStorage.setItem('mathAppUserData', JSON.stringify(this.userData));
  },
  
  // Opdater visning af statistik
  updateStatsDisplay: function() {
    const pointsEl = document.getElementById('userPoints');
    const levelEl = document.getElementById('userLevel');
    const streakEl = document.getElementById('streak');
    
    if (pointsEl) pointsEl.textContent = this.userData.totalPoints;
    if (levelEl && this.userData.topics.plus) {
      levelEl.textContent = this.userData.topics.plus.level;
    }
    if (streakEl && this.userData.topics.plus) {
      streakEl.textContent = this.userData.topics.plus.streak;
    }
    
    // Opdater også forsiden hvis vi er der
    const totalPointsEl = document.getElementById('totalPoints');
    const correctAnswersEl = document.getElementById('correctAnswers');
    const currentLevelEl = document.getElementById('currentLevel');
    
    if (totalPointsEl) {
      totalPointsEl.textContent = this.userData.totalPoints;
    }
    if (correctAnswersEl && this.userData.totalAttempts > 0) {
      const percentage = Math.round((this.userData.totalCorrect / this.userData.totalAttempts) * 100);
      correctAnswersEl.textContent = percentage + '%';
    }
    if (currentLevelEl && this.userData.topics.plus) {
      currentLevelEl.textContent = this.userData.topics.plus.level;
    }
  },
  
  // Opdater emne-data (kaldes fra plus.html)
  updateTopicData: function(topic, isCorrect, points) {
    // Sikre at emnet eksisterer
    if (!this.userData.topics[topic]) {
      this.userData.topics[topic] = {
        streak: 0,
        level: 1,
        correct: 0,
        attempts: 0
      };
    }
    
    const topicData = this.userData.topics[topic];
    
    // Opdater forsøg
    this.userData.totalAttempts++;
    topicData.attempts++;
    
    if (isCorrect) {
      // Rigtigt svar
      this.userData.totalCorrect++;
      topicData.correct++;
      
      // Opdater streak
      topicData.streak++;
      
      // Tilføj point
      const pointsToAdd = points || 10;
      this.userData.totalPoints += pointsToAdd;
      
      // Opdater niveau baseret på streak
      if (topicData.streak >= 3 && topicData.level < 5) {
        topicData.level++;
        topicData.streak = 0; // Nulstil streak ved niveauopgradering
      }
    } else {
      // Forkert svar
      topicData.streak = 0;
      
      // Muligvis sænk niveau hvis niveau er højt og for mange fejl
      if (topicData.level > 1 && topicData.correct / topicData.attempts < 0.5) {
        topicData.level = Math.max(1, topicData.level - 0.5);
      }
    }
    
    // Gem data
    this.saveUserData();
    
    // Opdater visning
    this.updateStatsDisplay();
    
    // Returner nyt niveau
    return topicData.level;
  },
  
  // Hent emne-niveau (kaldes fra plus.html)
  getTopicLevel: function(topic) {
    if (this.userData.topics && this.userData.topics[topic]) {
      return this.userData.topics[topic].level;
    }
    return 1;
  },
  
  // Hent emne-streak
  getTopicStreak: function(topic) {
    if (this.userData.topics && this.userData.topics[topic]) {
      return this.userData.topics[topic].streak;
    }
    return 0;
  },
  
  // Generer tal baseret på niveau
  generateNumberForLevel: function(level, operation) {
    let maxNumber = 10;
    
    if (level <= 3) {
      maxNumber = 10 * level;
    } else if (level <= 6) {
      maxNumber = 20 + (level - 3) * 10;
    } else {
      maxNumber = 50 + (level - 6) * 25;
    }
    
    if (operation === 'division') {
      const factor = Math.floor(Math.random() * 10) + 1;
      const result = Math.floor(Math.random() * maxNumber) + 1;
      return [result * factor, factor];
    }
    
    return Math.floor(Math.random() * maxNumber) + 1;
  },
  
  // Vis feedback
  showFeedback: function(message, isCorrect, elementId = 'feedback') {
    const feedbackDiv = document.getElementById(elementId);
    if (!feedbackDiv) return;
    
    feedbackDiv.textContent = message;
    feedbackDiv.className = 'feedback ' + (isCorrect ? 'success' : 'error');
    
    if (!isCorrect) {
      setTimeout(() => {
        if (feedbackDiv.textContent === message) {
          feedbackDiv.textContent = '';
          feedbackDiv.className = 'feedback';
        }
      }, 3000);
    }
  },
  
  // Nulstil alt data
  resetAllData: function() {
    this.userData = {
      totalPoints: 0,
      totalCorrect: 0,
      totalAttempts: 0,
      topics: {
        plus: { streak: 0, level: 1, correct: 0, attempts: 0 },
        minus: { streak: 0, level: 1, correct: 0, attempts: 0 }
      }
    };
    this.saveUserData();
    this.updateStatsDisplay();
    alert('Alle data er nulstillet!');
  },
  
  // Vis debug info
  showDebugInfo: function() {
    console.log('MathApp Debug Info:', this.userData);
    return this.userData;
  }
};

// Automatisk indlæsning når DOM er klar
document.addEventListener('DOMContentLoaded', function() {
  window.MathApp.loadUserData();
  console.log('MathApp initialized');
});

// Behold også disse globale funktioner for bagudkompatibilitet
window.loadUserData = function() {
  return window.MathApp.loadUserData();
};

window.calculateNewLevel = function(isCorrect) {
  // Denne funktion er for bagudkompatibilitet
  const currentLevel = window.MathApp.userData.topics.plus.level;
  
  window.MathApp.userData.totalAttempts++;
  
  if (isCorrect) {
    window.MathApp.userData.totalCorrect++;
    window.MathApp.userData.totalPoints += 10;
    
    // Simpel niveau-logik
    if (window.MathApp.userData.totalCorrect % 5 === 0) {
      window.MathApp.userData.topics.plus.level++;
    }
  }
  
  window.MathApp.saveUserData();
  window.MathApp.updateStatsDisplay();
  return window.MathApp.userData.topics.plus.level;
};

window.updateStatsDisplay = function() {
  window.MathApp.updateStatsDisplay();
};

window.getUserLevelForTopic = function(topic) {
  return window.MathApp.getTopicLevel(topic);
};

window.updateProgress = function(topic, correct) {
  // Simpel implementering for bagudkompatibilitet
  if (!window.MathApp.userData[topic]) {
    window.MathApp.userData[topic] = { attempts: 0, correct: 0, level: 1 };
  }
  
  window.MathApp.userData[topic].attempts++;
  if (correct) window.MathApp.userData[topic].correct++;
  
  window.MathApp.saveUserData();
};