import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Home from '@/views/Home.vue'
import Dashboard from '@/views/Dashboard.vue'
import CatwayList from '@/components/Catways/CatwayList.vue'
import ReservationList from '@/components/Reservations/ReservationList.vue'
import UserList from '@/components/Users/UserList.vue'
import Users from '@/views/Users.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    {
      path: '/catways',
      name: 'catways',
      component: CatwayList,
      meta: { requiresAuth: true }
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: ReservationList,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'Users',
      component: Users,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next('/login')
    } else if (to.matched.some(record => record.meta.requiresAdmin)) {
      if (authStore.userRole === 'admin') {
        next()
      } else {
        next('/dashboard')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 