declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Supprimons cette partie qui cause des problèmes
// declare module '@/*' {
//   const content: any
//   export default content
// } 