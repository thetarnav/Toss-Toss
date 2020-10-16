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

let _afkInterval

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
		/** offline -> loading -> online -> joined -> online
		 */
		inviteLink: null,
		lastActive: null,
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
		lastActive(state, timestamp) {
			state.session.lastActive = timestamp
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
				/**
				 * if session is already created
				 * simply copy existing inviteLink
				 */
				if (state.session.state !== 'offline') {
					copyToClipboard(state.session.inviteLink)
					resolve(state.session.inviteLink)
				}

				/**
				 * init Online Session:
				 * 1. set session state as 'loading'
				 * 2. create document in firestore
				 * 3. if success: set state as 'online' and copy inviteLink
				 * 3. if not: revert back to 'offline' state
				 * 4. dispatch listening to server changes
				 */
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
		joinOnlineSession({ state, getters, dispatch }, inviteID) {
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
			/**
			 * Watch firestore document updates:
			 */
			collRef.doc(state.session.id).onSnapshot(doc => {
				const data = doc.data(),
					{ isHost } = getters

				// Document deleted:
				if (!doc.exists) {
					if (state.online)
						dispatch('leaveOnlineSession', {
							redirect: true,
							message: `${isHost ? 'Opponent' : 'Host'} has disconnected`,
						})
					return
				}

				if (isHost) {
					!getters.playerName(1) && commit('changeName', [1, data.playerTwo])

					if (getters.sessionState !== 'playing') {
						// change opponent name:
						commit('changeName', [1, data.playerTwo])

						// ENTER THE GAME
						if (data.playing === true) {
							state.session.state = 'playing'
							router.push({ name: 'Game' })
							dispatch('setAfkInterval')
							return
						}

						// state = joined when opponent joins
						if (data.opponentJoined === true) state.session.state = 'joined'
					}
				} else !getters.playerName(0) && commit('changeName', [0, data.playerOne])

				// if the changes came from server (other player)
				// Update gameData and lastActive timestamp
				if (!doc.metadata.hasPendingWrites) {
					commit('game/updateLocalData', data.gameData)
					commit('lastActive', data.timestamp)
				}
			})
		},
		enterOnlineGame({ state, getters, dispatch }) {
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
					dispatch('setAfkInterval')
				})
		},
		updateServerData({ state, commit }) {
			const timestamp = Date.now()
			/**
			 * Update local 'lastActive' timestamp
			 */
			commit('lastActive', timestamp)

			/**
			 * Update firebase document:
			 */
			collRef.doc(state.session.id).update({
				gameData: { ...state.game },
				timestamp,
			})
		},
		setAfkInterval({ state, dispatch }) {
			/**
			 * Check players inactivity
			 * every 30 sec
			 * timeoutLimit: 2 min
			 */
			_afkInterval = setInterval(
				() =>
					Date.now() - state.session.lastActive > 120000 &&
					dispatch('leaveOnlineSession', {
						redirect: true,
						message: 'Session timeout.',
					}),
				30000,
			)
		},
		leaveOnlineSession({ state }, payload = {}) {
			return new Promise(resolve => {
				if (!state.online) resolve()

				const { id } = state.session

				// Unset afkInterval
				typeof _afkInterval === 'number' && clearInterval(_afkInterval)

				// Reset the root state
				Object.keys(initialState).forEach(key => {
					state[key] = initialState[key]
				})

				// if firestore document is up, delete it
				if (id) {
					collRef
						.doc(id)
						.delete()
						.then(() => end())
				} else end()

				function end() {
					if (payload.redirect) {
						state.message = payload.message || ''
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
