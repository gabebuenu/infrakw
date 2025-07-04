import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Equipment } from '../types'

export function useEquipments() {
  const equipments = ref<Equipment[]>([])
  const isLoading = ref(false)

  const loadEquipments = async (filters?: any) => {
    isLoading.value = true
    try {
      let q = query(collection(db, 'equipamentos'), orderBy('updatedAt', 'desc'))
      
      if (filters?.store) {
        q = query(q, where('store', '==', filters.store))
      }
      
      const querySnapshot = await getDocs(q)
      equipments.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Equipment[]
    } catch (error) {
      console.error('Error loading equipments:', error)
    } finally {
      isLoading.value = false
    }
  }

  const addEquipment = async (equipment: Omit<Equipment, 'id'>) => {
    try {
      await addDoc(collection(db, 'equipamentos'), {
        ...equipment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      await loadEquipments()
    } catch (error) {
      console.error('Error adding equipment:', error)
      throw error
    }
  }

  const updateEquipment = async (id: string, updates: Partial<Equipment>) => {
    try {
      await updateDoc(doc(db, 'equipamentos', id), {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      await loadEquipments()
    } catch (error) {
      console.error('Error updating equipment:', error)
      throw error
    }
  }

  const deleteEquipment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'equipamentos', id))
      await loadEquipments()
    } catch (error) {
      console.error('Error deleting equipment:', error)
      throw error
    }
  }

  return {
    equipments,
    isLoading,
    loadEquipments,
    addEquipment,
    updateEquipment,
    deleteEquipment
  }
}