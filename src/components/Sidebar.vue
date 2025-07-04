<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <font-awesome-icon :icon="['fas', 'cogs']" class="logo-icon" />
        <span class="logo-text">InfraKW</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item">
        <font-awesome-icon :icon="['fas', 'chart-line']" />
        <span>Dashboard</span>
      </router-link>
      
      <router-link to="/equipamentos" class="nav-item">
        <font-awesome-icon :icon="['fas', 'desktop']" />
        <span>Equipamentos</span>
      </router-link>
      
      <router-link to="/manutencoes" class="nav-item">
        <font-awesome-icon :icon="['fas', 'wrench']" />
        <span>Manutenções</span>
      </router-link>
      
      <router-link to="/lojas" class="nav-item">
        <font-awesome-icon :icon="['fas', 'store']" />
        <span>Lojas</span>
      </router-link>
      
      <router-link to="/empresas" class="nav-item">
        <font-awesome-icon :icon="['fas', 'building']" />
        <span>Empresas</span>
      </router-link>
      
      <router-link 
        v-if="canViewReports" 
        to="/relatorios" 
        class="nav-item"
      >
        <font-awesome-icon :icon="['fas', 'chart-bar']" />
        <span>Relatórios</span>
      </router-link>
      
      <router-link 
        v-if="canManageUsers" 
        to="/usuarios" 
        class="nav-item"
      >
        <font-awesome-icon :icon="['fas', 'users']" />
        <span>Usuários</span>
      </router-link>
    </nav>
    
    <div class="sidebar-footer">
      <div class="user-info">
        <img 
          v-if="currentUser?.photoURL" 
          :src="currentUser.photoURL" 
          :alt="currentUser.name"
          class="user-avatar-img"
        />
        <font-awesome-icon 
          v-else
          :icon="['fas', 'user-circle']" 
          class="user-avatar" 
        />
        <div class="user-details">
          <div class="user-name">{{ currentUser?.name }}</div>
          <div class="user-role">{{ getRoleText(currentUser?.role) }}</div>
        </div>
      </div>
      
      <button @click="logout" class="btn btn-secondary btn-sm logout-btn">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
        Sair
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'

const { currentUser, logout, canViewReports, canManageUsers } = useAuth()

const getRoleText = (role?: string) => {
  const roles = {
    admin: 'Admin TI',
    tecnico: 'Técnico TI',
    diretor: 'Diretor',
    visualizador: 'Visualizador'
  }
  return roles[role as keyof typeof roles] || 'Usuário'
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background-color: white;
  border-right: 1px solid var(--neutral-200);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.logo-icon {
  font-size: var(--font-size-2xl);
  color: var(--primary-600);
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
}

.sidebar-nav {
  flex: 1;
  padding: var(--spacing-4) 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-6);
  color: var(--neutral-600);
  text-decoration: none;
  transition: all var(--transition-fast);
  border-right: 3px solid transparent;
}

.nav-item:hover {
  background-color: var(--neutral-50);
  color: var(--primary-600);
}

.nav-item.router-link-active {
  background-color: var(--primary-50);
  color: var(--primary-600);
  border-right-color: var(--primary-600);
}

.nav-item svg {
  width: 20px;
  height: 20px;
}

.sidebar-footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
  background-color: var(--neutral-50);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.user-avatar {
  font-size: var(--font-size-2xl);
  color: var(--neutral-400);
}

.user-avatar-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-900);
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

.logout-btn {
  width: 100%;
  justify-content: center;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--neutral-200);
  }
  
  .sidebar-nav {
    display: flex;
    overflow-x: auto;
    padding: var(--spacing-2);
  }
  
  .nav-item {
    flex-direction: column;
    min-width: 80px;
    padding: var(--spacing-2);
    border-right: none;
    border-bottom: 3px solid transparent;
  }
  
  .nav-item.router-link-active {
    border-right: none;
    border-bottom-color: var(--primary-600);
  }
}
</style>