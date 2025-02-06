import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '@/services/api'
import router from '@/router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false
  }),

  getters: {
    userRole: (state) => state.user?.role || 'user',
    username: (state) => state.user?.username || 'Utilisateur'
  },

  actions: {
    async login(email: string, password: string) {
      try {
        console.log("Tentative de connexion avec:", { email, password });
        const response = await apiLogin(email, password);
        
        if (response.data.success) {
          this.user = response.data.user;
          this.token = response.data.token;
          this.isAuthenticated = true;
          localStorage.setItem('token', response.data.token);
          
          console.log("✅ Connexion réussie");
          router.push('/dashboard');
        }
      } catch (error) {
        console.error("❌ Erreur de connexion:", error);
        throw error;
      }
    },

    async logout() {
      try {
        await apiLogout();
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        router.push('/');
      } catch (error) {
        console.error("❌ Erreur lors de la déconnexion:", error);
      }
    },

    async checkAuth() {
      try {
        const response = await getCurrentUser()
        if (response.data.success) {
          this.user = response.data.data
          this.isAuthenticated = true
          localStorage.setItem('user', JSON.stringify(this.user))
        }
      } catch (error) {
        this.logout()
      }
    }
  }
}) 