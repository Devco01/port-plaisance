<template>
  <div class="home">
    <nav class="home-nav">
      <div class="nav-content">
        <div class="logo">Port de Russell</div>
      </div>
    </nav>

    <main class="main-content">
      <div class="hero">
        <div class="hero-content">
          <h1>Bienvenue au Port de Russell</h1>
          <p class="subtitle">Gestion des réservations de catways en ligne</p>
          <div class="cta-buttons">
            <router-link to="/login" class="cta-button login" v-if="!isLoggedIn">
              <i class="fas fa-sign-in-alt"></i>
              Se connecter
            </router-link>
            <router-link to="/dashboard" class="cta-button dashboard" v-else>
              <i class="fas fa-tachometer-alt"></i>
              Tableau de bord
            </router-link>
            <a 
              href="https://port-plaisance-api-production-73a9.up.railway.app/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              class="cta-button docs"
            >
              <i class="fas fa-book"></i>
              Documentation API
            </a>
          </div>
        </div>
      </div>

      <div class="features">
        <div class="feature-card">
          <i class="fas fa-ship"></i>
          <h3>Gestion des Catways</h3>
          <p>Gérez facilement vos emplacements de bateaux avec notre système intuitif.</p>
        </div>

        <div class="feature-card">
          <i class="fas fa-calendar-alt"></i>
          <h3>Réservations Simplifiées</h3>
          <p>Système de réservation en temps réel pour une gestion optimale des places.</p>
        </div>

        <div class="feature-card">
          <i class="fas fa-chart-line"></i>
          <h3>Tableau de Bord</h3>
          <p>Visualisez toutes vos données importantes en un coup d'œil.</p>
        </div>
      </div>
    </main>

    <footer class="home-footer">
      <div class="footer-content">
        <p>&copy; 2024 Port de Russell - Tous droits réservés</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isLoggedIn = computed(() => {
  return !!localStorage.getItem('token')
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #42b983 0%, #2c3e50 100%);
}

.home-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 64px; /* Hauteur de la navbar */
}

.hero {
  padding: 4rem 2rem;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 3rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.cta-button.login {
  background-color: #42b983;
  color: white;
}

.cta-button.dashboard {
  background-color: #3498db;
  color: white;
}

.cta-button.docs {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid white;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  backdrop-filter: blur(10px);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.home-footer {
  margin-top: 4rem;
  padding: 2rem;
  color: white;
  text-align: center;
  background: rgba(0, 0, 0, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .features {
    padding: 0 1rem;
  }

  .cta-button {
    width: 100%;
    justify-content: center;
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #3aa876;
}
</style> 