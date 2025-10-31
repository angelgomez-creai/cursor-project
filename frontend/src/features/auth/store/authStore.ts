/**
 * Store para estado global de autenticación (Zustand)
 * TODO: Implementar cuando se agregue Zustand
 */

// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// import type { User, AuthResponse } from '../types'

// interface AuthState {
//   user: User | null
//   token: string | null
//   isAuthenticated: boolean
//   login: (authResponse: AuthResponse) => void
//   logout: () => void
//   updateUser: (user: Partial<User>) => void
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       // ... implementación
//     }),
//     {
//       name: 'auth-storage',
//     }
//   )
// )

