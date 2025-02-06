import type { User } from './api';
import type { Store as VuexStore } from 'vuex'
import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<RootState>
  }
}

declare module 'vuex' {
  export type Store<S> = VuexStore<S>
  export function createStore<S>(options: any): VuexStore<S>
  export function useStore<S = any>(): VuexStore<S>
}

export interface RootState {
  auth: {
    user: User | null;
    isLoggedIn: boolean;
  }
}

export interface ActionContext {
  commit: (type: string, payload?: any) => void;
  state: RootState;
}

export interface LoginPayload {
  email: string;
  password: string;
} 