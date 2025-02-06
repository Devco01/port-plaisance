import { Store } from 'vuex'
import { RootState } from './store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

declare module 'vuex' {
  export interface Store<S> {
    state: S
    getters: any
    commit(type: string, payload?: any): void
    dispatch<T = any>(type: string, payload?: any): Promise<T>
  }

  export interface StoreOptions<S> {
    state?: S
    getters?: Record<string, (state: S) => any>
    mutations?: Record<string, (state: S, payload?: any) => void>
    actions?: Record<string, (store: any, payload?: any) => any>
  }

  export function createStore<S>(options: StoreOptions<S>): Store<S>
  export function useStore<S = any>(): Store<S>
} 