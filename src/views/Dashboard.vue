<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="quick-actions">
        <button class="btn btn-primary" @click="$router.push('/equipamentos')">
          <font-awesome-icon :icon="['fas', 'plus']" />
          Novo Equipamento
        </button>
        <button class="btn btn-secondary" @click="$router.push('/manutencoes')">
          <font-awesome-icon :icon="['fas', 'wrench']" />
          Nova Manutenção
        </button>
        <button class="btn btn-success" @click="$router.push('/lojas')">
          <font-awesome-icon :icon="['fas', 'store']" />
          Gerenciar Lojas
        </button>
      </div>
    </div>
    
    <div v-if="isLoading" class="loading-state">
      <font-awesome-icon :icon="['fas', 'spinner']" class="fa-spin loading-icon" />
      <p>Carregando dados do dashboard...</p>
    </div>
    
    <div v-else class="dashboard-content">
      <div class="stats-grid">
        <StatsCard
          :icon="['fas', 'desktop']"
          label="Total de Equipamentos"
          :value="stats.totalEquipments"
          variant="primary"
          description="Ativos no sistema"
          clickable
          @click="$router.push('/equipamentos')"
        />
        
        <StatsCard
          :icon="['fas', 'wrench']"
          label="Em Manutenção"
          :value="stats.inMaintenanceCount"
          variant="warning"
          description="Equipamentos em reparo"
          clickable
          @click="$router.push('/manutencoes')"
        />
        
        <StatsCard
          :icon="['fas', 'exclamation-triangle']"
          label="Garantias Vencendo"
          :value="stats.warrantyExpiringSoon"
          variant="error"
          description="Próximos 30 dias"
          clickable
        />
        
        <StatsCard
          :icon="['fas', 'dollar-sign']"
          label="Custos do Mês"
          :value="stats.monthlyMaintenanceCost"
          variant="success"
          description="Manutenções realizadas"
          format="currency"
          clickable
          @click="$router.push('/relatorios')"
        />
      </div>
      
      <div class="secondary-stats">
        <StatsCard
          :icon="['fas', 'store']"
          label="Lojas Cadastradas"
          :value="stats.totalStores"
          variant="secondary"
          description="Unidades ativas"
          clickable
          @click="$router.push('/lojas')"
        />
        
        <StatsCard
          :icon="['fas', 'building']"
          label="Empresas Terceiras"
          :value="stats.totalCompanies"
          variant="secondary"
          description="Prestadores de serviço"
          clickable
          @click="$router.push('/empresas')"
        />
      </div>
      
      <div class="dashboard-main">
        <div class="content-left">
          <div class="card">
            <div class="card-header">
              <h3>Equipamentos por Loja</h3>
              <button class="btn btn-sm btn-secondary" @click="refreshData">
                <font-awesome-icon :icon="['fas', 'sync-alt']" />
                Atualizar
              </button>
            </div>
            <div class="card-body">
              <div v-if="Object.keys(stats.equipmentsByStore).length === 0" class="empty-state">
                <font-awesome-icon :icon="['fas', 'store']" class="empty-icon" />
                <p>Nenhuma loja com equipamentos cadastrados</p>
                <button class="btn btn-primary btn-sm" @click="$router.push('/lojas')">
                  Cadastrar Primeira Loja
                </button>
              </div>
              <div v-else class="store-stats">
                <div 
                  v-for="(count, store) in stats.equipmentsByStore" 
                  :key="store"
                  class="store-item"
                >
                  <div class="store-info">
                    <font-awesome-icon :icon="['fas', 'store']" />
                    <span>{{ store }}</span>
                  </div>
                  <div class="store-count">{{ count }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3>Manutenções Recentes</h3>
              <router-link to="/manutencoes" class="btn btn-sm btn-secondary">
                Ver Todas
              </router-link>
            </div>
            <div class="card-body">
              <div v-if="recentMaintenances.length === 0" class="empty-state">
                <font-awesome-icon :icon="['fas', 'wrench']" class="empty-icon" />
                <p>Nenhuma manutenção registrada</p>
                <button class="btn btn-primary btn-sm" @click="$router.push('/manutencoes')">
                  Registrar Primeira Manutenção
                </button>
              </div>
              <div v-else class="maintenance-list">
                <div 
                  v-for="maintenance in recentMaintenances" 
                  :key="maintenance.id"
                  class="maintenance-item"
                >
                  <div class="maintenance-info">
                    <div class="maintenance-equipment">{{ maintenance.equipmentName }}</div>
                    <div class="maintenance-date">{{ formatDate(maintenance.startDate) }}</div>
                  </div>
                  <div class="maintenance-status" :class="maintenance.status">
                    {{ getStatusText(maintenance.status) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="content-right">
          <div class="card">
            <div class="card-header">
              <h3>Alertas e Notificações</h3>
            </div>
            <div class="card-body">
              <div v-if="alerts.length === 0" class="empty-state">
                <font-awesome-icon :icon="['fas', 'check-circle']" class="empty-icon text-success" />
                <p>Nenhum alerta no momento</p>
                <small>Tudo funcionando perfeitamente!</small>
              </div>
              <div v-else class="alerts-list">
                <div 
                  v-for="(alert, index) in alerts" 
                  :key="index"
                  class="alert" 
                  :class="`alert-${alert.type}`"
                >
                  <font-awesome-icon :icon="alert.icon" />
                  <div>{{ alert.message }}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h3>Ações Rápidas</h3>
            </div>
            <div class="card-body">
              <div class="quick-actions-grid">
                <button class="action-btn" @click="$router.push('/equipamentos')">
                  <font-awesome-icon :icon="['fas', 'search']" />
                  <span>Buscar Equipamento</span>
                </button>
                
                <button class="action-btn" @click="$router.push('/relatorios')" v-if="canViewReports">
                  <font-awesome-icon :icon="['fas', 'file-pdf']" />
                  <span>Gerar Relatório</span>
                </button>
                
                <button class="action-btn" @click="$router.push('/lojas')">
                  <font-awesome-icon :icon="['fas', 'store']" />
                  <span>Gerenciar Lojas</span>
                </button>
                
                <button class="action-btn" @click="$router.push('/empresas')">
                  <font-awesome-icon :icon="['fas', 'building']" />
                  <span>Empresas Terceiras</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useDashboard } from '../composables/useDashboard'
import StatsCard from '../components/StatsCard.vue'

const { canViewReports } = useAuth()
const { stats, recentMaintenances, alerts, isLoading, loadDashboardData } = useDashboard()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const getStatusText = (status: string) => {
  const statusMap = {
    'pendente': 'Pendente',
    'em-andamento': 'Em Andamento',
    'concluida': 'Concluída'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const refreshData = async () => {
  await loadDashboardData()
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  padding: var(--spacing-6);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-8);
}

.dashboard-header h1 {
  margin: 0;
  color: var(--neutral-900);
}

.quick-actions {
  display: flex;
  gap: var(--spacing-3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-12);
  color: var(--neutral-500);
}

.loading-icon {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-4);
  color: var(--primary-600);
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
}

.secondary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
}

.dashboard-main {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-6);
}

.content-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.content-right {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-8);
  color: var(--neutral-500);
}

.empty-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-4);
}

.store-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.store-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-200);
  border-radius: var(--border-radius-base);
  transition: background-color var(--transition-fast);
}

.store-item:hover {
  background-color: var(--neutral-50);
}

.store-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--neutral-700);
}

.store-count {
  font-weight: var(--font-weight-semibold);
  color: var(--primary-600);
}

.maintenance-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.maintenance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-200);
  border-radius: var(--border-radius-base);
}

.maintenance-info {
  flex: 1;
}

.maintenance-equipment {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-900);
}

.maintenance-date {
  font-size: var(--font-size-sm);
  color: var(--neutral-500);
}

.maintenance-status {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.maintenance-status.pendente {
  background-color: var(--warning-100);
  color: var(--warning-700);
}

.maintenance-status.em-andamento {
  background-color: var(--primary-100);
  color: var(--primary-700);
}

.maintenance-status.concluida {
  background-color: var(--success-100);
  color: var(--success-700);
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-base);
  border-left: 4px solid;
}

.alert-warning {
  background-color: var(--warning-50);
  border-left-color: var(--warning-500);
  color: var(--warning-700);
}

.alert-error {
  background-color: var(--error-50);
  border-left-color: var(--error-500);
  color: var(--error-700);
}

.alert-info {
  background-color: var(--primary-50);
  border-left-color: var(--primary-500);
  color: var(--primary-700);
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-3);
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background-color: var(--neutral-50);
  border: 1px solid var(--neutral-200);
  border-radius: var(--border-radius-base);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  color: var(--neutral-700);
}

.action-btn:hover {
  background-color: var(--primary-50);
  border-color: var(--primary-200);
  color: var(--primary-700);
}

.action-btn svg {
  font-size: var(--font-size-xl);
}

@media (max-width: 1024px) {
  .dashboard-main {
    grid-template-columns: 1fr;
  }
  
  .secondary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: var(--spacing-4);
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: var(--spacing-4);
    align-items: stretch;
  }
  
  .quick-actions {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .secondary-stats {
    grid-template-columns: 1fr;
  }
  
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>