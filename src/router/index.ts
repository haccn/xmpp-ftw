import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { store } from '@/stores/main'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/LoginView.vue')
		}
	]
})

router.beforeEach((to, _from) => {
	if (to.meta?.requiresAuth && !store.connection.authenticated) {
		return {
			name: 'login',
			query: { redirect: to.fullPath }
		}
	}
})

export default router
