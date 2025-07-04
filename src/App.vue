<template>
  <div id="app">
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-spinner">
        <font-awesome-icon :icon="['fas', 'cogs']" class="fa-spin" />
      </div>
      <p>Carregando InfraKW...</p>
    </div>
    
    <div v-else-if="!currentUser" class="login-layout">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <div class="logo">
              <font-awesome-icon :icon="['fas', 'cogs']" class="logo-icon" />
              <span class="logo-text">InfraKW</span>
            </div>
            <h1>Login</h1>
            <p>Faça login para acessar o sistema de gestão de equipamentos</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input 
                id="email"
                v-model="loginForm.email"
                type="email" 
                class="form-input"
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Senha</label>
              <input 
                id="password"
                v-model="loginForm.password"
                type="password" 
                class="form-input"
                placeholder="Sua senha"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="rememberMe" />
                <span>Lembrar de mim</span>
              </label>
            </div>
            
            <button 
              type="submit" 
              class="btn btn-primary btn-lg login-btn"
              :disabled="isLoginLoading"
            >
              <font-awesome-icon 
                v-if="isLoginLoading"
                :icon="['fas', 'spinner']" 
                class="fa-spin"
              />
              {{ isLoginLoading ? 'Entrando...' : 'Entrar' }}
            </button>
            
            <div class="divider">
              <span>ou</span>
            </div>
            
            <button 
              type="button"
              class="btn btn-google btn-lg"
              @click="handleGoogleLogin"
              :disabled="isGoogleLoading"
            >
              <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {{ isGoogleLoading ? 'Conectando...' : 'Continuar com Google' }}
            </button>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>
          </form>
          
          <div class="demo-credentials">
            <h3>Credenciais de Teste:</h3>
            <div class="credential-item">
              <strong>Admin:</strong> admin@teste.com / 123456
            </div>
            <div class="credential-item">
              <strong>Técnico:</strong> tecnico@teste.com / 123456
            </div>
            <div class="credential-item">
              <strong>Diretor:</strong> diretor@teste.com / 123456
            </div>
            <div class="credential-item">
              <strong>Visualizador:</strong> visualizador@teste.com / 123456
            </div>
          </div>
          
          <div class="login-footer">
            <p>© 2024 InfraKW. Sistema de Gestão de Equipamentos de TI</p>
          </div>
        </div>
      </div>
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
import { ref, provide, onMounted } from 'vue'
import { useAuth } from './composables/useAuth'
import Sidebar from './components/Sidebar.vue'
import TopBar from './components/TopBar.vue'

const { currentUser, isLoading, login, loginWithGoogle } = useAuth()

const loginForm = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const isLoginLoading = ref(false)
const isGoogleLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const handleLogin = async () => {
  error.value = ''
  successMessage.value = ''
  isLoginLoading.value = true
  
  try {
    const success = await login(loginForm.value.email, loginForm.value.password)
    
    if (success) {
      successMessage.value = 'Login realizado com sucesso!'
      // O currentUser será atualizado automaticamente
    } else {
      error.value = 'Email ou senha incorretos'
    }
  } catch (err) {
    error.value = 'Erro ao fazer login. Tente novamente.'
    console.error('Login error:', err)
  } finally {
    isLoginLoading.value = false
  }
}

const handleGoogleLogin = async () => {
  error.value = ''
  successMessage.value = ''
  isGoogleLoading.value = true
  
  try {
    const result = await loginWithGoogle()
    
    if (result.success) {
      successMessage.value = 'Login com Google realizado com sucesso!'
    } else {
      error.value = result.error || 'Erro ao fazer login com Google'
    }
  } catch (err) {
    error.value = 'Erro ao fazer login com Google. Tente novamente.'
    console.error('Google login error:', err)
  } finally {
    isGoogleLoading.value = false
  }
}

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

onMounted(() => {
  // Initialize loading state
  setTimeout(() => {
    // Simulate loading completion
  }, 1000)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;
  
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-200: #bbf7d0;
  --success-600: #16a34a;
  --success-700: #15803d;
  
  --warning-50: #fffbeb;
  --warning-100: #fef3c7;
  --warning-600: #d97706;
  --warning-700: #b45309;
  
  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-200: #fecaca;
  --error-600: #dc2626;
  --error-700: #b91c1c;
  
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-12: 3rem;
  
  --border-radius-sm: 0.125rem;
  --border-radius-base: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --transition-fast: 150ms ease-in-out;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.5;
  color: var(--neutral-900);
  background-color: var(--neutral-50);
}

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

/* Login Styles */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 100%);
  padding: var(--spacing-4);
}

.login-card {
  background-color: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  padding: var(--spacing-8);
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-4);
}

.logo-icon {
  font-size: var(--font-size-4xl);
  color: var(--primary-600);
}

.logo-text {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
}

.login-header h1 {
  margin: 0 0 var(--spacing-2) 0;
  color: var(--neutral-900);
}

.login-header p {
  color: var(--neutral-600);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.form-label {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.form-input {
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-600);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-700);
}

.btn-lg {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
}

.login-btn {
  width: 100%;
  margin-top: var(--spacing-2);
}

.divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-4) 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--neutral-300);
}

.divider span {
  background-color: white;
  padding: 0 var(--spacing-4);
  color: var(--neutral-500);
  font-size: var(--font-size-sm);
}

.btn-google {
  width: 100%;
  background-color: white;
  color: var(--neutral-700);
  border: 2px solid var(--neutral-300);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  transition: all var(--transition-fast);
}

.btn-google:hover:not(:disabled) {
  background-color: var(--neutral-50);
  border-color: var(--neutral-400);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-google:active {
  transform: translateY(0);
}

.google-icon {
  flex-shrink: 0;
}

.error-message {
  color: var(--error-600);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-3);
  background-color: var(--error-50);
  border: 1px solid var(--error-200);
  border-radius: var(--border-radius-base);
}

.success-message {
  color: var(--success-600);
  font-size: var(--font-size-sm);
  text-align: center;
  padding: var(--spacing-3);
  background-color: var(--success-50);
  border: 1px solid var(--success-200);
  border-radius: var(--border-radius-base);
}

.demo-credentials {
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
}

.demo-credentials h3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
  margin-bottom: var(--spacing-3);
}

.credential-item {
  font-size: var(--font-size-xs);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-1);
}

.login-footer {
  text-align: center;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--neutral-200);
}

.login-footer p {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
  margin: 0;
}

@media (max-width: 768px) {
  .content-wrapper {
    margin-left: 0;
  }
  
  .main-content {
    min-height: calc(100vh - 140px);
  }
  
  .login-card {
    padding: var(--spacing-6);
  }
  
  .logo-icon {
    font-size: var(--font-size-3xl);
  }
  
  .logo-text {
    font-size: var(--font-size-2xl);
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