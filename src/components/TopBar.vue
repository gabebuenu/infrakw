<template>
  <div class="topbar">
    <div class="topbar-left">
      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </button>
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    
    <div class="topbar-right">
      <div class="search-box">
        <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
        <input 
          type="text" 
          placeholder="Buscar equipamentos..." 
          class="search-input"
          v-model="searchQuery"
          @input="$emit('search', searchQuery)"
        />
      </div>
      
      <div class="notifications">
        <button class="notification-btn">
          <font-awesome-icon :icon="['fas', 'bell']" />
          <span class="notification-badge" v-if="notificationCount > 0">
            {{ notificationCount }}
          </span>
        </button>
      </div>
      
      <div class="user-menu">
        <button class="user-menu-btn" @click="toggleUserMenu">
          <font-awesome-icon :icon="['fas', 'user-circle']" />
        </button>
        
        <div class="user-dropdown" v-if="showUserMenu">
          <div class="user-info">
            <div class="user-name">{{ currentUser?.name }}</div>
            <div class="user-email">{{ currentUser?.email }}</div>
          </div>
          <hr>
          <button @click="logout" class="dropdown-item">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
            Sair
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const emit = defineEmits(['search', 'toggleMobileMenu'])

const route = useRoute()
const { currentUser, logout } = useAuth()

const searchQuery = ref('')
const showUserMenu = ref(false)
const notificationCount = ref(3) // Mock notification count

const pageTitle = computed(() => {
  const titles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/equipamentos': 'Equipamentos',
    '/manutencoes': 'Manutenções',
    '/relatorios': 'Relatórios',
    '/usuarios': 'Usuários'
  }
  return titles[route.path] || 'InfraKW'
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  emit('toggleMobileMenu')
}

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target?.closest('.user-menu')) {
    showUserMenu.value = false
  }
})
</script>

<style scoped>
.topbar {
  height: 70px;
  background-color: white;
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-6);
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--neutral-600);
  cursor: pointer;
  padding: var(--spacing-2);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  color: var(--neutral-900);
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: var(--spacing-3);
  color: var(--neutral-400);
  font-size: var(--font-size-sm);
}

.search-input {
  padding: var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-10);
  border: 1px solid var(--neutral-300);
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-sm);
  width: 300px;
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.notifications {
  position: relative;
}

.notification-btn {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--neutral-600);
  cursor: pointer;
  padding: var(--spacing-2);
  position: relative;
  transition: color var(--transition-fast);
}

.notification-btn:hover {
  color: var(--primary-600);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--error-500);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 18px;
  text-align: center;
}

.user-menu {
  position: relative;
}

.user-menu-btn {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--neutral-600);
  cursor: pointer;
  padding: var(--spacing-2);
  transition: color var(--transition-fast);
}

.user-menu-btn:hover {
  color: var(--primary-600);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid var(--neutral-200);
  border-radius: var(--border-radius-base);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  padding: var(--spacing-2);
  z-index: 1000;
}

.user-info {
  padding: var(--spacing-3);
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-900);
}

.user-email {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.dropdown-item {
  width: 100%;
  padding: var(--spacing-3);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--neutral-700);
}

.dropdown-item:hover {
  background-color: var(--neutral-50);
}

hr {
  border: none;
  height: 1px;
  background-color: var(--neutral-200);
  margin: var(--spacing-2) 0;
}

@media (max-width: 768px) {
  .topbar {
    padding: 0 var(--spacing-4);
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .search-box {
    display: none;
  }
  
  .page-title {
    font-size: var(--font-size-lg);
  }
  
  .topbar-right {
    gap: var(--spacing-2);
  }
}
</style>