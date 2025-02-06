declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: any
    $router: any
    $route: any
  }

  interface ComponentOptions {
    store?: any
    router?: any
  }
}

export {} 