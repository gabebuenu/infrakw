<template>
  <div class="equipment-view">
    <div class="equipment-header">
      <h1>Equipamentos</h1>
      <button 
        v-if="canManageEquipments"
        class="btn btn-primary" 
        @click="showAddModal = true"
      >
        <font-awesome-icon :icon="['fas', 'plus']" />
        Novo Equipamento
      </button>
    </div>
    
    <div class="equipment-filters">
      <div class="filter-group">
        <input 
          type="text" 
          placeholder="Buscar por nome ou código..." 
          class="form-input"
          v-model="searchQuery"
        />
        <select v-model="selectedStore" class="form-select">
          <option value="">Todas as lojas</option>
          <option value="Centro">Centro</option>
          <option value="Shopping Norte">Shopping Norte</option>
          <option value="Matriz">Matriz</option>
          <option value="Filial Sul">Filial Sul</option>
        </select>
        <select v-model="selectedType" class="form-select">
          <option value="">Todos os tipos</option>
          <option value="Computador">Computador</option>
          <option value="Impressora">Impressora</option>
          <option value="Roteador">Roteador</option>
          <option value="Nobreak">Nobreak</option>
        </select>
        <select v-model="selectedStatus" class="form-select">
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="manutencao">Manutenção</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>
    </div>
    
    <div class="equipment-grid">
      <div 
        v-for="equipment in filteredEquipments" 
        :key="equipment.id"
        class="equipment-card"
      >
        <div class="equipment-header">
          <div class="equipment-info">
            <h3>{{ equipment.name }}</h3>
            <p class="equipment-code">{{ equipment.internalCode }}</p>
          </div>
          <div class="equipment-status" :class="equipment.status">
            {{ getStatusText(equipment.status) }}
          </div>
        </div>
        
        <div class="equipment-details">
          <div class="detail-row">
            <span class="detail-label">Tipo:</span>
            <span>{{ equipment.type }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Marca/Modelo:</span>
            <span>{{ equipment.brand }} {{ equipment.model }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Localização:</span>
            <span>{{ equipment.store }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Garantia até:</span>
            <span :class="isWarrantyExpiring(equipment.warrantyUntil) ? 'text-warning' : ''">
              {{ formatDate(equipment.warrantyUntil) }}
            </span>
          </div>
        </div>
        
        <div class="equipment-actions">
          <button 
            class="btn btn-sm btn-secondary" 
            @click="viewEquipment(equipment)"
          >
            <font-awesome-icon :icon="['fas', 'eye']" />
            Ver
          </button>
          <button 
            v-if="canManageEquipments"
            class="btn btn-sm btn-primary" 
            @click="editEquipment(equipment)"
          >
            <font-awesome-icon :icon="['fas', 'edit']" />
            Editar
          </button>
          <button 
            class="btn btn-sm btn-warning" 
            @click="newMaintenance(equipment)"
          >
            <font-awesome-icon :icon="['fas', 'wrench']" />
            Manutenção
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="filteredEquipments.length === 0" class="empty-state">
      <font-awesome-icon :icon="['fas', 'inbox']" class="empty-icon" />
      <h3>Nenhum equipamento encontrado</h3>
      <p>Tente ajustar os filtros ou adicione um novo equipamento</p>
    </div>

    <!-- Add Equipment Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ editingEquipment ? 'Editar Equipamento' : 'Novo Equipamento' }}</h2>
          <button class="modal-close" @click="closeModal">
            <font-awesome-icon :icon="['fas', 'times']" />
          </button>
        </div>
        
        <form @submit.prevent="saveEquipment" class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nome do Equipamento *</label>
              <input 
                type="text" 
                class="form-input"
                v-model="equipmentForm.name"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Código Interno *</label>
              <input 
                type="text" 
                class="form-input"
                v-model="equipmentForm.internalCode"
                required
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Tipo *</label>
              <select class="form-select" v-model="equipmentForm.type" required>
                <option value="">Selecione</option>
                <option value="Computador">Computador</option>
                <option value="Impressora">Impressora</option>
                <option value="Roteador">Roteador</option>
                <option value="Nobreak">Nobreak</option>
                <option value="Monitor">Monitor</option>
                <option value="Servidor">Servidor</option>
                <option value="Switch">Switch</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Loja *</label>
              <select class="form-select" v-model="equipmentForm.store" required>
                <option value="">Selecione</option>
                <option value="Centro">Centro</option>
                <option value="Shopping Norte">Shopping Norte</option>
                <option value="Matriz">Matriz</option>
                <option value="Filial Sul">Filial Sul</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Marca *</label>
              <input 
                type="text" 
                class="form-input"
                v-model="equipmentForm.brand"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label">Modelo *</label>
              <input 
                type="text" 
                class="form-input"
                v-model="equipmentForm.model"
                required
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Número de Série</label>
              <input 
                type="text" 
                class="form-input"
                v-model="equipmentForm.serialNumber"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Patrimônio</label>
              <input 
                type="text" 
                class="form-input"
                v-model="equipmentForm.patrimonyNumber"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Data de Compra</label>
              <input 
                type="date" 
                class="form-input"
                v-model="equipmentForm.purchaseDate"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Garantia até</label>
              <input 
                type="date" 
                class="form-input"
                v-model="equipmentForm.warrantyUntil"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Valor de Compra</label>
              <input 
                type="number" 
                step="0.01"
                class="form-input"
                v-model="equipmentForm.purchaseValue"
                placeholder="0,00"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-select" v-model="equipmentForm.status">
                <option value="ativo">Ativo</option>
                <option value="manutencao">Manutenção</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Observações</label>
            <textarea 
              class="form-input"
              v-model="equipmentForm.notes"
              rows="3"
              placeholder="Informações adicionais sobre o equipamento..."
            ></textarea>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isSaving">
              <font-awesome-icon 
                v-if="isSaving"
                :icon="['fas', 'spinner']" 
                class="fa-spin"
              />
              {{ isSaving ? 'Salvando...' : (editingEquipment ? 'Atualizar' : 'Cadastrar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useAuth'
import { useEquipments } from '../composables/useEquipments'
import type { Equipment } from '../types'

const { canManageEquipments } = useAuth()
const { equipments, isLoading, loadEquipments, addEquipment, updateEquipment } = useEquipments()

const showAddModal = ref(false)
const editingEquipment = ref<Equipment | null>(null)
const isSaving = ref(false)
const searchQuery = ref('')
const selectedStore = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const equipmentForm = ref({
  name: '',
  internalCode: '',
  type: '',
  store: '',
  brand: '',
  model: '',
  serialNumber: '',
  patrimonyNumber: '',
  purchaseDate: '',
  warrantyUntil: '',
  purchaseValue: 0,
  status: 'ativo' as 'ativo' | 'manutencao' | 'inativo',
  notes: ''
})

const filteredEquipments = computed(() => {
  let filtered = equipments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(equipment => 
      equipment.name.toLowerCase().includes(query) ||
      equipment.internalCode.toLowerCase().includes(query) ||
      equipment.serialNumber?.toLowerCase().includes(query)
    )
  }

  if (selectedStore.value) {
    filtered = filtered.filter(equipment => equipment.store === selectedStore.value)
  }

  if (selectedType.value) {
    filtered = filtered.filter(equipment => equipment.type === selectedType.value)
  }

  if (selectedStatus.value) {
    filtered = filtered.filter(equipment => equipment.status === selectedStatus.value)
  }

  return filtered
})

const getStatusText = (status: string) => {
  const statusMap = {
    'ativo': 'Ativo',
    'manutencao': 'Manutenção',
    'inativo': 'Inativo'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const isWarrantyExpiring = (warrantyDate: string) => {
  const today = new Date()
  const warranty = new Date(warrantyDate)
  const diffTime = warranty.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 30 && diffDays >= 0
}

const resetForm = () => {
  equipmentForm.value = {
    name: '',
    internalCode: '',
    type: '',
    store: '',
    brand: '',
    model: '',
    serialNumber: '',
    patrimonyNumber: '',
    purchaseDate: '',
    warrantyUntil: '',
    purchaseValue: 0,
    status: 'ativo',
    notes: ''
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingEquipment.value = null
  resetForm()
}

const viewEquipment = (equipment: Equipment) => {
  console.log('View equipment:', equipment)
  // Implement view modal
}

const editEquipment = (equipment: Equipment) => {
  editingEquipment.value = equipment
  equipmentForm.value = {
    name: equipment.name,
    internalCode: equipment.internalCode,
    type: equipment.type,
    store: equipment.store,
    brand: equipment.brand,
    model: equipment.model,
    serialNumber: equipment.serialNumber || '',
    patrimonyNumber: equipment.patrimonyNumber || '',
    purchaseDate: equipment.purchaseDate || '',
    warrantyUntil: equipment.warrantyUntil || '',
    purchaseValue: equipment.purchaseValue || 0,
    status: equipment.status,
    notes: equipment.notes || ''
  }
  showAddModal.value = true
}

const newMaintenance = (equipment: Equipment) => {
  console.log('New maintenance for:', equipment)
  // Implement new maintenance modal
}

const saveEquipment = async () => {
  isSaving.value = true
  try {
    const equipmentData = {
      ...equipmentForm.value,
      purchaseValue: Number(equipmentForm.value.purchaseValue)
    }

    if (editingEquipment.value) {
      await updateEquipment(editingEquipment.value.id, equipmentData)
    } else {
      await addEquipment(equipmentData)
    }
    
    closeModal()
  } catch (error) {
    console.error('Error saving equipment:', error)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadEquipments()
})
</script>

<style scoped>
.equipment-view {
  padding: var(--spacing-6);
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-6);
}

.equipment-header h1 {
  margin: 0;
  color: var(--neutral-900);
}

.equipment-filters {
  margin-bottom: var(--spacing-6);
}

.filter-group {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--spacing-4);
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-6);
}

.equipment-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-base);
  overflow: hidden;
  transition: box-shadow var(--transition-fast);
}

.equipment-card:hover {
  box-shadow: var(--shadow-md);
}

.equipment-card .equipment-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0;
}

.equipment-info h3 {
  margin: 0 0 var(--spacing-1) 0;
  color: var(--neutral-900);
  font-size: var(--font-size-lg);
}

.equipment-code {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--neutral-500);
  font-family: monospace;
}

.equipment-status {
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
}

.equipment-status.ativo {
  background-color: var(--success-100);
  color: var(--success-700);
}

.equipment-status.manutencao {
  background-color: var(--warning-100);
  color: var(--warning-700);
}

.equipment-status.inativo {
  background-color: var(--error-100);
  color: var(--error-700);
}

.equipment-details {
  padding: var(--spacing-4);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-2);
}

.detail-label {
  font-weight: var(--font-weight-medium);
  color: var(--neutral-600);
}

.equipment-actions {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  border-top: 1px solid var(--neutral-200);
  background-color: var(--neutral-50);
}

.equipment-actions .btn {
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-12);
  color: var(--neutral-500);
}

.empty-icon {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--spacing-4);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.modal-header h2 {
  margin: 0;
  color: var(--neutral-900);
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  color: var(--neutral-500);
  cursor: pointer;
  padding: var(--spacing-2);
}

.modal-body {
  padding: var(--spacing-6);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-4);
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-700);
}

.form-input,
.form-select {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px var(--primary-100);
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
  margin-top: var(--spacing-6);
}

@media (max-width: 1024px) {
  .filter-group {
    grid-template-columns: 1fr 1fr;
  }
  
  .equipment-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .equipment-view {
    padding: var(--spacing-4);
  }
  
  .equipment-header {
    flex-direction: column;
    gap: var(--spacing-4);
    align-items: stretch;
  }
  
  .filter-group {
    grid-template-columns: 1fr;
  }
  
  .equipment-grid {
    grid-template-columns: 1fr;
  }
  
  .equipment-actions {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>