import { ComponentCustomProperties } from 'vue'
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
    state?: S | (() => S)
    getters?: {
      [key: string]: (state: S, getters: any) => any
    }
    mutations?: {
      [key: string]: (state: S, payload?: any) => void
    }
    actions?: {
      [key: string]: (store: ActionContext<S, S>, payload?: any) => any
    }
  }

  export interface ActionContext<S, R> {
    state: S
    getters: any
    commit(type: string, payload?: any): void
    dispatch<T = any>(type: string, payload?: any): Promise<T>
  }

  export function createStore<S>(options: StoreOptions<S>): Store<S>
  export function useStore<S = any>(): Store<S>
} 