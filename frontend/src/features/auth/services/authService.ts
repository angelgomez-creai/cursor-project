import { apiClient } from '@shared/services/apiClient'
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types'

/**
 * Servicio para operaciones de autenticación
 */
export const authService = {
  /**
   * Inicia sesión con email y password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/login', credentials)
  },

  /**
   * Registra un nuevo usuario
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/register', data)
  },

  /**
   * Cierra sesión
   */
  async logout(): Promise<void> {
    return apiClient.post('/api/auth/logout')
  },

  /**
   * Obtiene el usuario actual
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/api/auth/me')
  },

  /**
   * Refresca el token de autenticación
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/refresh', {
      refreshToken,
    })
  },
}

