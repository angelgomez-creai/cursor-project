/**
 * Hook principal para estado de autenticación
 * TODO: Implementar cuando se agregue state management
 */

export const useAuth = () => {
  // TODO: Implementar lógica de autenticación
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {},
    logout: async () => {},
    register: async () => {},
  }
}

