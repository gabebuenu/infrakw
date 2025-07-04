<template>
  <header class="topbar">
    <div class="topbar-content">
      <div class="topbar-left">
        <button class="mobile-menu-btn" @click="$emit('toggleMobileMenu')">
          <font-awesome-icon :icon="['fas', 'bars']" />
        </button>
        <div class="search-box">
          <font-awesome-icon :icon="['fas', 'search']" class="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar equipamentos..."
            @input="handleSearch"
            class="search-input"
          />
        </div>
      </div>
      
      <div class="topbar-right">
        <div class="user-menu">
          <img 
            v-if="currentUser?.photoURL" 
            :src="currentUser.photoURL" 
            :alt="currentUser.name"
            class="user-avatar"
          />
          <div class="user-info">
            <span class="user-name">{{ currentUser?.name }}</span>
            <span class="user-role">{{ currentUser?.role }}</span>
          </div>
          <button @click="handleLogout" class="logout-btn">
            <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const { currentUser, logout } = useAuth()

const emit = defineEmits(['search', 'toggleMobileMenu'])

const handleSearch = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('search', target.value)
}

const handleLogout = async () => {
  await logout()
}
</script>

<style scoped>
.topbar {
  height: 70px;
  background-color: white;
  border-bottom: 1px solid var(--neutral-200);
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-6);
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
}

.search-box {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--neutral-400);
}

.search-input {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-8);
  border: 1px solid var(--neutral-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.topbar-right {
  display: flex;
  align-items: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-900);
  font-size: var(--font-size-sm);
}

.user-role {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  text-transform: capitalize;
}

.logout-btn {
  background: none;
  border: none;
  color: var(--neutral-600);
  cursor: pointer;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-base);
  transition: var(--transition-fast);
}

.logout-btn:hover {
  background-color: var(--neutral-100);
  color: var(--neutral-900);
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }
  
  .search-box {
    width: 200px;
  }
  
  .user-info {
    display: none;
  }
}
</style>