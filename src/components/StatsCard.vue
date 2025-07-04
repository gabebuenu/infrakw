<template>
  <div class="stats-card" :class="[variant, { clickable: clickable }]" @click="handleClick">
    <div class="stats-header">
      <div class="stats-icon">
        <font-awesome-icon :icon="icon" />
      </div>
      <div class="stats-trend" v-if="trend">
        <font-awesome-icon 
          :icon="trend > 0 ? ['fas', 'arrow-up'] : ['fas', 'arrow-down']" 
          :class="trend > 0 ? 'trend-up' : 'trend-down'"
        />
        <span>{{ Math.abs(trend) }}%</span>
      </div>
    </div>
    
    <div class="stats-body">
      <div class="stats-value">{{ formattedValue }}</div>
      <div class="stats-label">{{ label }}</div>
      <div class="stats-description" v-if="description">{{ description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string[]
  label: string
  value: number | string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  trend?: number
  description?: string
  clickable?: boolean
  format?: 'number' | 'currency' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  format: 'number',
  clickable: false
})

const emit = defineEmits(['click'])

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value
  
  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(props.value)
    case 'percentage':
      return `${props.value}%`
    default:
      return props.value.toLocaleString('pt-BR')
  }
})

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.stats-card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-base);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.stats-card.clickable {
  cursor: pointer;
}

.stats-card.clickable:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stats-card.primary {
  border-left: 4px solid var(--primary-600);
}

.stats-card.secondary {
  border-left: 4px solid var(--secondary-600);
}

.stats-card.success {
  border-left: 4px solid var(--success-600);
}

.stats-card.warning {
  border-left: 4px solid var(--warning-600);
}

.stats-card.error {
  border-left: 4px solid var(--error-600);
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4);
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xl);
}

.stats-card.primary .stats-icon {
  background-color: var(--primary-100);
  color: var(--primary-600);
}

.stats-card.secondary .stats-icon {
  background-color: var(--secondary-100);
  color: var(--secondary-600);
}

.stats-card.success .stats-icon {
  background-color: var(--success-100);
  color: var(--success-600);
}

.stats-card.warning .stats-icon {
  background-color: var(--warning-100);
  color: var(--warning-600);
}

.stats-card.error .stats-icon {
  background-color: var(--error-100);
  color: var(--error-600);
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.trend-up {
  color: var(--success-600);
}

.trend-down {
  color: var(--error-600);
}

.stats-body {
  text-align: left;
}

.stats-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--neutral-900);
  margin-bottom: var(--spacing-1);
}

.stats-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-2);
}

.stats-description {
  font-size: var(--font-size-xs);
  color: var(--neutral-500);
}

@media (max-width: 768px) {
  .stats-card {
    padding: var(--spacing-4);
  }
  
  .stats-value {
    font-size: var(--font-size-2xl);
  }
  
  .stats-icon {
    width: 40px;
    height: 40px;
    font-size: var(--font-size-lg);
  }
}
</style>