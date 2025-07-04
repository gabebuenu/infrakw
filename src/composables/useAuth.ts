import { ref, computed } from 'vue'
import { 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import type { User } from '../types'

const currentUser = ref<User | null>(null)
const isLoading = ref(true)

export function useAuth() {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const userDoc = await getDoc(doc(db, 'usuarios', result.user.uid))
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        currentUser.value = {
          uid: result.user.uid,
          email: result.user.email!,
          name: userData.name,
          role: userData.role,
          photoURL: userData.photoURL,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin
        } as User
        
        // Update last login
        await setDoc(doc(db, 'usuarios', result.user.uid), {
          ...userData,
          lastLogin: new Date().toISOString()
        }, { merge: true })
      }
      
      return true
    } catch (error) {
      console.error('Error logging in:', error)
      return false
    }
  }

  const loginWithGoogle = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('email')
      provider.addScope('profile')
      
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid))
      
      if (userDoc.exists()) {
        // User exists, load their data and update last login
        const userData = userDoc.data()
        const updatedUser = {
          uid: user.uid,
          email: user.email!,
          name: userData.name,
          role: userData.role,
          photoURL: user.photoURL || userData.photoURL,
          createdAt: userData.createdAt,
          lastLogin: new Date().toISOString()
        } as User
        
        await setDoc(doc(db, 'usuarios', user.uid), updatedUser, { merge: true })
        currentUser.value = updatedUser
      } else {
        // New user, create profile with default role
        const newUser: User = {
          uid: user.uid,
          email: user.email!,
          name: user.displayName || user.email!.split('@')[0],
          role: 'visualizador',
          photoURL: user.photoURL || undefined,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        }
        
        await setDoc(doc(db, 'usuarios', user.uid), newUser)
        currentUser.value = newUser
      }
      
      return { success: true, user: currentUser.value }
    } catch (error: any) {
      console.error('Error with Google login:', error)
      
      let errorMessage = 'Erro ao fazer login com Google'
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Login cancelado pelo usuário'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Pop-up bloqueado pelo navegador'
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Solicitação de pop-up cancelada'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth)
      currentUser.value = null
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!currentUser.value) return false
    return requiredRoles.includes(currentUser.value.role)
  }

  const canManageEquipments = computed(() => 
    hasPermission(['admin', 'tecnico'])
  )

  const canViewReports = computed(() => 
    hasPermission(['admin', 'diretor'])
  )

  const canManageUsers = computed(() => 
    hasPermission(['admin'])
  )

  // Initialize auth state
  onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'usuarios', firebaseUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        currentUser.value = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name,
          role: userData.role,
          photoURL: userData.photoURL,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin
        } as User
      }
    } else {
      currentUser.value = null
    }
    isLoading.value = false
  })

  return {
    currentUser,
    isLoading,
    login,
    loginWithGoogle,
    logout,
    hasPermission,
    canManageEquipments,
    canViewReports,
    canManageUsers
  }
}