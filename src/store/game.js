import { random } from '@/js/utilities'

const initialState = {
	dices: [],
	nDices: 6,
	activePlayer: 0,
	rollDisabled: false,
	lost: false,
	winner: null,
	totalScore: [0, 0],
	roundScore: [0, 0],
	currentScore: 0,
}

export default {
	namespaced: true,
	state: {
		...initialState,
	},
	mutations: {
		roll(state) {
			state.dices = state.dices.map(dice => ({
				id: dice.id,
				nr: dice.isSelected || dice.isGone ? dice.nr : rollDice(),
				isSelected: false,
				isGone: dice.isSelected || dice.isGone,
				isDisabled: false,
			}))
		},
		updateRoundScore(state, score) {
			state.roundScore[state.activePlayer] =
				score === undefined ? state.currentScore + state.roundScore[state.activePlayer] : score
			state.currentScore = 0
		},
		updateTotalScore(state) {
			state.totalScore[state.activePlayer] +=
				state.currentScore + state.roundScore[state.activePlayer]

			state.roundScore[state.activePlayer] = 0
			state.currentScore = 0
		},
		playerSwitch(state, player) {
			player = player || (state.activePlayer === 0 ? 1 : 0)
			state.activePlayer = player
		},
	},
	actions: {
		initGame({ state, dispatch }) {
			Object.keys(initialState).forEach(key => (state[key] = initialState[key]))
			state.totalScore = [0, 0]

			dispatch('initRound')
		},
		initRound({ state, dispatch }) {
			state.lost = false
			state.dices = []

			const max = state.nDices
			for (let i = 0; i < max; i++) {
				state.dices.push({
					id: i,
					nr: rollDice(),
					isSelected: false,
					isGone: false,
					isDisabled: false,
				})
			}

			dispatch('checkRoundOver')
		},
		roll({ commit, dispatch }) {
			commit('roll')

			commit('updateRoundScore')

			dispatch('checkRoundOver')
		},
		endRound({ state, commit, getters, dispatch }, lost = false) {
			if (lost === true) {
				state.lost = true
				state.dices = state.dices.map(die => ({ ...die, isDisabled: true }))
				setTimeout(() => {
					commit('updateRoundScore', 0)
					restart()
				}, 1500)
			} else {
				commit('updateTotalScore')

				if (state.totalScore[state.activePlayer] >= 2000) {
					state.dices = state.dices.map(die => ({
						...die,
						isSelected: false,
						isGone: false,
					}))
					state.winner = state.activePlayer
					return
				}

				restart()
			}

			function restart() {
				commit('playerSwitch')
				dispatch('initRound')
			}
		},
		checkRoundOver({ state, commit, getters, dispatch }) {
			const possiblePoints = countPoints(state.dices)

			if (possiblePoints === 0) dispatch('endRound', true)
		},
		select({ state, getters, dispatch, commit }, id) {
			const { selected } = getters,
				dice = state.dices[id],
				chain = unfinished(selected)

			if (dice.isDisabled || dice.isGone) return

			// No dice is selected:
			if (selected.length === 0) dice.isSelected = true
			// Clicked dice is not selected:
			else if (chain === undefined || parseInt(chain) === dice.nr)
				dice.isSelected = !dice.isSelected
			else return

			// Disabling dices:
			dispatch('disable')

			state.currentScore = countPoints(getters.selected)
		},
		disable({ state, getters }) {
			const { selected, gone } = getters,
				chain = unfinished(selected)

			state.dices = state.dices.map(dice => {
				let isDisabled
				if (chain === undefined || parseInt(chain) === dice.nr) isDisabled = false
				else isDisabled = true

				return {
					...dice,
					isDisabled,
				}
			})

			state.rollDisabled = selected.length + gone.length === state.nDices
		},
	},
	getters: {
		selected: state => state.dices.filter(dice => dice.isSelected === true),
		gone: state => state.dices.filter(dice => dice.isGone === true),
		roundScore: state =>
			state.roundScore.map((round, i) =>
				i === state.activePlayer ? round + state.currentScore : round,
			),
		buttonsDisabled: (state, getters) => {
			const { selected } = getters,
				chain = unfinished(selected)
			return chain !== undefined || selected.length === 0 || state.lost || state.winner !== null
		},
		winning: state => {
			const [one, two] = state.totalScore
			if (one > two) return 0
			if (two > one) return 1
			return null
		},
	},
}

function rollDice() {
	return random(1, 6, 'round')
}

function countDices(dices) {
	const count = {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
	}
	dices.forEach(dice => count[dice.nr]++)
	return count
}

function countPoints(dices) {
	dices = dices.filter(dice => !dice.isGone)

	const diceCount = countDices(dices)

	let total = 0

	for (let nr = 1; nr <= 6; nr++) {
		const n = diceCount[nr]
		let min = 3
		if (nr === 1 || nr === 5) min = 1

		const base = nr === 1 ? 100 : nr * 10,
			multiplier = n < 3 ? n : (n - 2) * 10

		total += n >= min ? base * multiplier : 0
	}

	return total
}

// finds uncompleted chain:
function unfinished(selected) {
	const count = countDices(selected)

	return Object.keys(count).find(nr => nr !== '1' && nr !== '5' && count[nr] > 0 && count[nr] < 3)
}
