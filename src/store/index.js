import { createStore } from 'vuex'

import game from './game'

export default createStore({
	modules: {
		game,
	},
	state: {
		playerOne: {
			name: 'Player 1',
		},
		playerTwo: {
			name: 'Player 2',
		},
	},
	getters: {
		playerData: state => n => (n === 0 ? state.playerOne : state.playerTwo),
	},
})
