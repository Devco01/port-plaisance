import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Importation des vues
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CatwaysView from '../views/CatwaysView.vue'
import ReservationsView from '../views/ReservationsView.vue'
import UsersView from '../views/UsersView.vue'

// Définition des routes selon le cahier des charges
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/catways',
    name: 'catways',
    component: CatwaysView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reservations',
    name: 'reservations',
    component: ReservationsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/catways/:id/reservations',
    name: 'catway-reservations',
    component: ReservationsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'users',
    component: UsersView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/api-docs',
    name: 'api-docs',
    component: {
      template: '<div></div>',
      beforeRouteEnter(_to, _from, next) {
        window.location.href = 'https://port-plaisance-api-production-73a9.up.railway.app/api-docs'
        next()
      }
    }
  }
]

// Création du router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Fonction utilitaire pour vérifier l'utilisateur
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Erreur lors de la lecture des données utilisateur:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

// Navigation guard pour l'authentification
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  const user = getUserFromStorage();
  
  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else if (to.meta.requiresAdmin && (!user || user.role !== 'admin')) {
    next('/dashboard');
  } else if (to.path === '/login' && token) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router
