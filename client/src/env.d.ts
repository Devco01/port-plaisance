/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Déclaration des modules
declare module '@/services/api' {
  import type { AxiosInstance, AxiosResponse } from 'axios'
  import type { 
    User, 
    Catway, 
    Reservation, 
    ReservationFormData,
    LoginCredentials, 
    ApiResponse 
  } from '@/types/api'

  // Catways
  export function getCatways(): Promise<AxiosResponse<ApiResponse<Catway[]>>>
  export function getCatway(id: number): Promise<AxiosResponse<ApiResponse<Catway>>>
  export function createCatway(data: Partial<Catway>): Promise<AxiosResponse<ApiResponse<Catway>>>
  export function updateCatway(id: number, data: Partial<Catway>): Promise<AxiosResponse<ApiResponse<Catway>>>
  export function deleteCatway(id: number): Promise<AxiosResponse<ApiResponse<void>>>

  // Réservations
  export function getReservations(): Promise<AxiosResponse<ApiResponse<Reservation[]>>>
  export function getCurrentReservations(): Promise<AxiosResponse<ApiResponse<Reservation[]>>>
  export function getReservation(catwayId: string, reservationId: string): Promise<AxiosResponse<ApiResponse<Reservation>>>
  export function createReservation(data: ReservationFormData): Promise<AxiosResponse<ApiResponse<Reservation>>>
  export function updateReservation(data: ReservationFormData & { _id: string }): Promise<AxiosResponse<ApiResponse<Reservation>>>
  export function deleteReservation(catwayId: string, reservationId: string): Promise<AxiosResponse<ApiResponse<void>>>

  // Utilisateurs
  export function getUsers(): Promise<AxiosResponse<ApiResponse<User[]>>>
  export function getUser(email: string): Promise<AxiosResponse<ApiResponse<User>>>
  export function createUser(data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>>
  export function updateUser(email: string, data: Partial<User>): Promise<AxiosResponse<ApiResponse<User>>>
  export function deleteUser(email: string): Promise<AxiosResponse<ApiResponse<void>>>

  // Authentification
  export function login(credentials: LoginCredentials): Promise<AxiosResponse<ApiResponse<User>>>
  export function logout(): Promise<AxiosResponse<ApiResponse<void>>>
  export function getCurrentUser(): Promise<AxiosResponse<ApiResponse<User>>>

  const api: AxiosInstance
  export default api
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly BASE_URL: string
  readonly NODE_ENV: 'development' | 'production'
  readonly MODE: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
      VUE_APP_API_URL: string
    }
  }
} 