<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <font-awesome-icon :icon="['fas', 'cogs']" class="logo-icon" />
        <span class="logo-text">InfraKW</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/dashboard" class="nav-link">
            <font-awesome-icon :icon="['fas', 'chart-line']" />
            <span>Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/equipamentos" class="nav-link">
            <font-awesome-icon :icon="['fas', 'wrench']" />
            <span>Equipamentos</span>
          </router-link>
        </li>
         <li class="nav-item">
          <router-link to="/lojas" class="nav-link">
            <font-awesome-icon :icon="['fas', 'store']" />
            <span>Lojas</span>
          </router-link>
        </li>
         <li class="nav-item">
          <router-link to="/empresas" class="nav-link">
            <font-awesome-icon :icon="['fas', 'building']" />
            <span>Empresas</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/manutencoes" class="nav-link">
            <font-awesome-icon :icon="['fas', 'cogs']" />
            <span>Manutenções</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/relatorios" class="nav-link">
            <font-awesome-icon :icon="['fas', 'chart-bar']" />
            <span>Relatórios</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/usuarios" class="nav-link">
            <font-awesome-icon :icon="['fas', 'users']" />
            <span>Usuários</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: white;
  border-right: 1px solid var(--neutral-200);
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
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
  padding: var(--spacing-4);
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: var(--spacing-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--neutral-600);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: var(--transition-fast);
}

.nav-link:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
}

.nav-link.router-link-active {
  background-color: var(--primary-100);
  color: var(--primary-700);
}
</style>