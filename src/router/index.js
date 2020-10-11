import { createRouter, createWebHistory } from 'vue-router'
import Lobby from '../views/Lobby.vue'
// import Game from '../views/Game.vue'

const routes = [
	{
		path: '/:menuState?',
		name: 'Lobby',
		component: Lobby,
		props: true,
	},
	{
		path: '/game/:gameID?',
		name: 'Game',
		component: () => import('../views/Game.vue'),
	},
	{
		path: '/invite/:gameID',
		name: 'Invite',
		redirect: to => ({
			name: 'Lobby',
			params: {
				inviteID: to.params.gameID,
			},
		}),
	},
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
})

export default router
