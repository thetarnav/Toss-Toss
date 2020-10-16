import { firestore } from '@/firebase'
import { createStore } from 'vuex'
import router from '@/router'
import debounce from 'lodash.debounce'
import cloneDeep from 'lodash.clonedeep'
import copyToClipboard from 'copy-to-clipboard'

import game from './game'

const collRef = firestore.collection('sessions')

const changeNameFirestore = debounce((n, name, sessionID) => {
	const player = n === 0 ? 'playerOne' : 'playerTwo'
	collRef.doc(sessionID).update({
		[player]: name,
		timestamp: Date.now(),
	})
}, 2000)

const initialState = {
	playerNames: [null, null],
	online: false,
	/* false -> offlinePlay or session wasn't initiated
			true -> request for session creation has beed sent to firestore
		*/
	session: {
		opponentJoined: false,
		host: true,
		id: undefined,
		/* undefined when the session document on firestore:
			isn't created or wasn't sent to the app
			*/
		state: 'offline',
		/**
		 * offline -> loading -> joined -> online
		 */
		inviteLink: null,
	},
}

export default createStore({
	modules: {
		game,
	},
	state: {
		...cloneDeep(initialState),
		message: '',
	},
	mutations: {
		resetPlayerNames(state) {
			state.playerNames = [undefined, undefined]
		},
		changeName(state, payload) {
			const [n, name] = payload
			state.playerNames[n] = name
		},
		clearMessage(state) {
			state.message = ''
		},
	},
	actions: {
		changeName({ state, commit, getters }, name) {
			const n = getters.isHost ? 0 : 1
			commit('changeName', [n, name])
			state.session.id && changeNameFirestore(n, name, state.session.id)
		},
		startHotSeatSession({ state, commit, dispatch }) {
			state.online = false
			commit('resetPlayerNames')
			dispatch('game/initGame')
			router.push({ name: 'Game' })
		},
		startOnlineSession({ state, dispatch, getters }) {
			return new Promise((resolve, reject) => {
				if (state.session.state !== 'offline') {
					copyToClipboard(state.session.inviteLink)
					resolve(state.session.inviteLink)
				}
				state.online = true
				state.session.state = 'loading'
				dispatch('game/initGame')

				collRef
					.add({
						gameData: { ...state.game },
						playerOne: getters.playerName(0),
						playerTwo: null,
						opponentJoined: false,
						playing: false,
						timestamp: Date.now(),
					})
					.then(document => {
						const { id } = document,
							{ host } = location,
							inviteLink = `${host}/invite/${id}`

						state.session.id = id
						state.session.state = 'online'
						state.session.inviteLink = inviteLink

						copyToClipboard(inviteLink)

						dispatch('listenServerChanges')
						resolve(inviteLink)
					})
					.catch(error => {
						state.online = false
						state.session.state = 'offline'
						reject(error)
					})
			})
		},
		joinOnlineSession({ state, getters, commit, dispatch }, inviteID) {
			state.session.host = false
			state.online = true

			collRef
				.doc(inviteID)
				.update({
					playerTwo: getters.playerName(1),
					opponentJoined: true,
					timestamp: Date.now(),
				})
				.then(() => {
					// You (Oponent) successfully joined session
					state.session.id = inviteID
					state.session.state = 'joined'
					dispatch('listenServerChanges')
				})
				.catch(() => {
					// Failed to join session
					router.push({ name: 'Lobby' })
					state.session.host = true
					state.online = false
				})
		},
		listenServerChanges({ state, commit, getters, dispatch }) {
			collRef.doc(state.session.id).onSnapshot(doc => {
				if (!doc.exists) {
					if (state.online) dispatch('leaveOnlineSession', true)
					return
				}
				const data = doc.data()
				if (getters.isHost) {
					!getters.playerName(1) && commit('changeName', [1, data.playerTwo])

					if (getters.sessionState !== 'playing') {
						// change opponent name:
						commit('changeName', [1, data.playerTwo])

						// ENTER THE GAME
						if (data.playing === true) {
							state.session.state = 'playing'
							router.push({ name: 'Game' })
							return
						}

						// state = joined when opponent joins
						if (data.opponentJoined === true) state.session.state = 'joined'
					}
				} else !getters.playerName(0) && commit('changeName', [0, data.playerOne])

				if (!doc.metadata.hasPendingWrites) {
					commit('game/updateLocalData', data.gameData)
				}
			})
		},
		enterOnlineGame({ state, getters }) {
			collRef
				.doc(state.session.id)
				.update({
					playerTwo: getters.playerName(1),
					playing: true,
					timestamp: Date.now(),
				})
				.then(() => {
					state.session.state = 'playing'
					router.push({ name: 'Game' })
				})
		},
		updateServerData({ state }) {
			collRef.doc(state.session.id).update({
				gameData: { ...state.game },
				timestamp: Date.now(),
			})
		},
		leaveOnlineSession({ state, getters }, redirect = false) {
			return new Promise((resolve, reject) => {
				if (!state.online) resolve()

				const { id } = state.session,
					{ isHost } = getters

				// Reset the root state
				Object.keys(initialState).forEach(key => {
					state[key] = initialState[key]
				})

				// if firestore document is up, delete it
				if (id) {
					collRef
						.doc(id)
						.delete()
						.then(() => {
							end()
						})
				} else end()

				function end() {
					if (redirect) {
						state.message = `${isHost ? 'Opponent' : 'Host'} has disconnected.`
						router.push({ name: 'Lobby' })
						resolve()
					} else {
						resolve()
					}
				}
			})
		},
	},
	getters: {
		playerName: state => n => state.playerNames[n],
		sessionState: state => state.session.state,
		isHost: state => state.session.host,
		inviteLink: state => state.session.inviteLink,
	},
})
