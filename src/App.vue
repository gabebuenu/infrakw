<template>
  <div id="app">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-spinner">
        <font-awesome-icon :icon="['fas', 'cogs']" class="fa-spin" />
      </div>
      <p>Carregando InfraKW...</p>
    </div>
    
    <div v-else-if="!currentUser" class="login-layout">
      <router-view />
    </div>
    
    <div v-else class="main-layout">
      <Sidebar />
      <div class="content-wrapper">
        <TopBar @search="handleSearch" @toggleMobileMenu="toggleMobileMenu" />
        <main class="main-content">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useAuth } from './composables/useAuth'
import Sidebar from './components/Sidebar.vue'
import TopBar from './components/TopBar.vue'

const { currentUser, isLoading } = useAuth()

const handleSearch = (query: string) => {
  console.log('Search query:', query)
  // Implement global search functionality
}

const toggleMobileMenu = () => {
  console.log('Toggle mobile menu')
  // Implement mobile menu toggle
}

// Provide auth context to all components
provide('auth', { currentUser, isLoading })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import './assets/styles/global.css';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
}

.loading-spinner {
  font-size: var(--font-size-4xl);
  color: var(--primary-600);
  margin-bottom: var(--spacing-4);
}

.login-layout {
  min-height: 100vh;
}

.main-layout {
  display: flex;
  min-height: 100vh;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 280px;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background-color: var(--neutral-50);
  min-height: calc(100vh - 70px);
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 0;
  }
  
  .main-content {
    min-height: calc(100vh - 140px);
  }
}

/* Font Awesome animations */
.fa-spin {
  animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>