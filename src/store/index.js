import { firestore } from '@/firebase'
import { createStore } from 'vuex'
import debounce from 'lodash.debounce'

import game from './game'

export default createStore({
	modules: {
		game,
	},
	state: {
		playerNames: ['PLAYER 1', 'PLAYER 2'],
		/* Opponent name informs of his state:
		null -> joined and choosing a name
		false -> yet to join
		string -> ready to display a game
		*/

		sessionID: undefined,
		/* undefined when the session document on firestore:
		isn't created or wasn't sent to the app
		*/
		isSessionOnline: false,
		/* false -> offlinePlay or session wasn't initiated
			true -> request for session creation has beed sent to firestore
		*/
	},
	mutations: {
		resetPlayerNames(state) {
			state.playerNames = ['PLAYER 1', 'PLAYER 2']
		},
		changeName(state, name) {
			state.playerNames[0] = name
		},
	},
	actions: {
		changeName({ state, commit, dispatch }, name) {
			commit('changeName', name)
			state.sessionID && dispatch('changeNameFirestore')
		},
		changeNameFirestore({ state }) {
			const [playerOne] = state.playerNames
			return debounce(
				() =>
					firestore
						.collection('sessions')
						.doc(state.sessionID)
						.update({
							playerOne,
						}),
				2000,
			)
		},
		startHotSeatSession({ state, commit }) {
			state.isSessionOnline = false
			commit('resetPlayerNames')
		},
		startOnlineSession({ state, dispatch, getters }) {
			state.isSessionOnline = true
			dispatch('game/initGame')

			firestore.collection('sessions').add({
				gameData: { ...state.game },
				playerOne: getters.playerName(0),
				playerTwo: false,
				lastActive: Date.now(),
			})
		},
	},
	getters: {
		playerName: state => n => state.playerNames[n],
	},
})
