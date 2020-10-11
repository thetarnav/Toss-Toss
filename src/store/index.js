import { firestore } from '@/firebase'
import { createStore } from 'vuex'

import game from './game'

export default createStore({
	modules: {
		game,
	},
	state: {
		online: false,
		playerNames: ['Player 1', 'Player 2'],
	},
	mutations: {
		resetPlayerNames: state => (state.playerNames = ['Player 1', 'Player 2']),
		changeName: state => name => (state.playerNames[0] = name),
	},
	actions: {
		startHotSeatSession({ commit }) {
			commit('resetPlayerNames')
		},
		startOnlineSession() {
			console.log(firestore)
		},
	},
	getters: {
		playerName: state => n => state.playerNames[n],
	},
})
