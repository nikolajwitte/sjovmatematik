// app.js - FIXET VERSION - SIKKER POINTSYSTEM
// GLOBALE VARIABLER - INITIALISERET MED DEFAULTS
window.MathApp = {
  userData: null,  // Starter som null, loades straks
  
  // Indlæs data fra localStorage - KALDES STRAKS!
  loadUserData: function() {
    console.log("🔍 MathApp.loadUserData() called");
    const saved = localStorage.getItem('mathAppUserData');
    
    if (saved) {
      try {
        this.userData = JSON.parse(saved);
        console.log("📂 Data loaded:", this.userData.totalPoints + " points");
      } catch (e) {
        console.error("❌ Error loading:", e);
        this.createDefaultData();
      }
    } else {
      this.createDefaultData();
    }
    
    this.updateStatsDisplay();
    return this.userData;
  },
  
  // Opret standard data
  createDefaultData: function() {
    console.log("📝 Creating default data");
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
  },
  
  // Gem data til localStorage
  saveUserData: function() {
    localStorage.setItem('mathAppUserData', JSON.stringify(this.userData));
    console.log("💾 Data saved:", this.userData.totalPoints + " points");
  },
  
  // Opdater visning af statistik - FIXET!
  updateStatsDisplay: function() {
    console.log("🔄 updateStatsDisplay() called");
    
    const pointsEl = document.getElementById('userPoints');
    const levelEl = document.getElementById('userLevel');
    const streakEl = document.getElementById('streak');
    
    if (pointsEl) {
      pointsEl.textContent = this.userData.totalPoints;
      console.log("✅ Points updated to:", this.userData.totalPoints);
    }
    
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
  
  // Opdater emne-data - DETTE KALDES FRA PLUS.HTML
  updateTopicData: function(topic, isCorrect, points) {
    console.log("🎯 updateTopicData called:", {topic, isCorrect, points});
    console.log("📊 Before - Total points:", this.userData.totalPoints);
    
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
      console.log("💰 Added", pointsToAdd, "points. New total:", this.userData.totalPoints);
      
      // Opdater niveau baseret på streak
      if (topicData.streak >= 3 && topicData.level < 5) {
        topicData.level++;
        topicData.streak = 0;
        console.log("📈 Level up to:", topicData.level);
      }
    } else {
      // Forkert svar
      topicData.streak = 0;
      console.log("❌ Wrong answer, streak reset");
      
      // Muligvis sænk niveau
      if (topicData.level > 1 && topicData.correct / topicData.attempts < 0.5) {
        topicData.level = Math.max(1, topicData.level - 0.5);
        console.log("📉 Level down to:", topicData.level);
      }
    }
    
    // Gem data
    this.saveUserData();
    
    // Opdater visning MED DET SAMME
    this.updateStatsDisplay();
    
    console.log("📊 After - Total points:", this.userData.totalPoints);
    console.log("📊 Returning level:", topicData.level);
    
    // Returner nyt niveau
    return topicData.level;
  },
  
  // Hent emne-niveau
  getTopicLevel: function(topic) {
    if (this.userData && this.userData.topics && this.userData.topics[topic]) {
      return this.userData.topics[topic].level;
    }
    return 1;
  },
  
  // Hent emne-streak
  getTopicStreak: function(topic) {
    if (this.userData && this.userData.topics && this.userData.topics[topic]) {
      return this.userData.topics[topic].streak;
    }
    return 0;
  },
  
  // Nulstil alt data
  resetAllData: function() {
    console.log("🔄 Resetting all data");
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
    return true;
  },
  
  // Vis debug info
  showDebugInfo: function() {
    console.log("=== MATHAPP DEBUG INFO ===");
    console.log("UserData:", this.userData);
    console.log("Points:", this.userData.totalPoints);
    console.log("Plus topic:", this.userData.topics.plus);
    console.log("LocalStorage:", localStorage.getItem('mathAppUserData'));
    console.log("=========================");
    return this.userData;
  }
};

// 🔥 VIKTIGT: Indlæs data MED DET SAMME - ikke vent på DOMContentLoaded!
console.log("🚀 MathApp initializing IMMEDIATELY");
window.MathApp.loadUserData();

// Global funktion for plus.html at kalde
window.loadUserData = function() {
  return window.MathApp.loadUserData();
};

// Hjælpefunktioner for bagudkompatibilitet
window.calculateNewLevel = function(isCorrect) {
  return window.MathApp.updateTopicData('plus', isCorrect, isCorrect ? 10 : 0);
};

window.updateStatsDisplay = function() {
  window.MathApp.updateStatsDisplay();
};

window.getUserLevelForTopic = function(topic) {
  return window.MathApp.getTopicLevel(topic);
};

console.log("✅ MathApp READY! Points:", window.MathApp.userData.totalPoints);