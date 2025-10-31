/**
 * Tipos específicos del feature Auth
 */

import type { Address, Timestamps } from '@shared/types/common.types'
import type { Email } from '@shared/types/utils.types'

/**
 * Rol de usuario
 */
export type UserRole = 'user' | 'admin' | 'moderator'

/**
 * Preferencias de usuario
 */
export interface UserPreferences {
  language: string
  currency: string
  timezone?: string
  emailNotifications?: boolean
  smsNotifications?: boolean
  theme?: 'light' | 'dark' | 'auto'
}

/**
 * Usuario completo
 */
export interface User extends Timestamps {
  id: number
  email: Email
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  isActive: boolean
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  lastLoginAt?: string
  addresses?: Address[]
  preferences?: UserPreferences
  metadata?: Record<string, unknown>
}

/**
 * Solicitud de login
 */
export interface LoginRequest {
  email: Email
  password: string
  rememberMe?: boolean
}

/**
 * Solicitud de registro
 */
export interface RegisterRequest {
  email: Email
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  acceptTerms: boolean
  acceptPrivacy: boolean
}

/**
 * Respuesta de autenticación
 */
export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
  expiresAt: string
  tokenType?: 'Bearer'
}

/**
 * Información de sesión
 */
export interface Session {
  user: User
  token: string
  refreshToken: string
  expiresAt: string
  createdAt: string
}

/**
 * Solicitud de cambio de contraseña
 */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Solicitud de reset de contraseña
 */
export interface ResetPasswordRequest {
  email: Email
}

/**
 * Solicitud de verificación de email
 */
export interface VerifyEmailRequest {
  token: string
}

/**
 * Perfil público de usuario
 */
export type PublicUserProfile = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'avatar' | 'createdAt'
>
