<template>
	<Player :playerIndex="1" align="right" />

	<main class="board">
		<button class="btn roll" @click="roll" :disabled="buttonsDisabled || rollDisabled">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<title>ic24-rotate</title>
				<g fill="#000000">
					<path
						fill-rule="evenodd"
						d="M4.983 11a1 1 0 0 1 1.008.867l.009.116.003.224a6 6 0 0 0 6.554 5.768l-.264-.268a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414l.318-.316A8.1 8.1 0 0 1 12 20c-4.231 0-7.711-3.29-7.983-7.49l-.013-.252L4 12.017A1 1 0 0 1 4.983 11zm6.724-8.707a1 1 0 0 1 .083 1.32l-.083.094-.318.316A8 8 0 0 1 20 12a1 1 0 0 1-1.999 0 6 6 0 0 0-6.557-5.975l.264.268a1 1 0 0 1-1.32 1.497l-.094-.083-2-2a1 1 0 0 1-.083-1.32l.083-.094 2-2a1 1 0 0 1 1.414 0z"
					></path>
				</g>
			</svg>
		</button>
		<Dices class="dices-wrapper" />
		<button class="btn keep" @click="keep" :disabled="buttonsDisabled">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<g class="nc-icon-wrapper" fill="#000000">
					<path
						fill-rule="evenodd"
						d="M21 16a1 1 0 0 1 .993.883L22 17v2a3 3 0 0 1-2.824 2.995L19 22H5a3 3 0 0 1-2.995-2.824L2 19v-2a1 1 0 0 1 1.993-.117L4 17v2a1 1 0 0 0 .883.993L5 20h14a1 1 0 0 0 .993-.883L20 19v-2a1 1 0 0 1 1-1zM12 2a1 1 0 0 1 1 1v9.585l1.293-1.292a1 1 0 0 1 1.32-.083l.094.083a1 1 0 0 1 .083 1.32l-.083.094-3 3-.044.042-.068.055-.11.071-.114.054-.105.035-.149.03L12 16l-.075-.003-.126-.017-.111-.03-.111-.044-.098-.052-.096-.067a1.006 1.006 0 0 1-.09-.08l-3-3a1 1 0 0 1 1.32-1.497l.094.083L11 12.585V3a1 1 0 0 1 1-1z"
					/>
				</g>
			</svg>
		</button>
		<GameResults class="game-results" v-if="winner !== null" />
	</main>

	<Player :playerIndex="0" align="left" />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import Player from '@/components/Player'
import Dices from '@/components/Dices'
import GameResults from '@/components/GameResults'

export default {
	name: 'Game',
	components: {
		Dices,
		Player,
		GameResults,
	},
	data() {
		return {}
	},
	computed: {
		...mapState('game', ['activePlayer', 'totalScore', 'rollDisabled', 'winner']),
		...mapState(['isSessionOnline']),
		...mapGetters('game', ['buttonsDisabled']),
	},
	methods: {
		...mapActions('game', { roll: 'roll', keep: 'endRound' }),
	},
	mounted() {
		!this.isSessionOnline && this.$store.dispatch('startHotSeatSession')

		this.$store.dispatch('game/initGame')
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/variables' as *;
@use '../scss/library/ms' as *;
@use '../scss/library/colors' as color;
@use '../scss/library/mixins' as *;

.board {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: ms(1) auto;
}

.dices-wrapper {
	margin: 0 ms(0);
}

.game-results {
	position: absolute;
	width: $dice-size * 3 + $dice-margin * 3;
	min-height: $dice-size * 2 + $dice-margin * 2;
}

.btn {
	$size: $dice-size;
	position: relative;
	width: $size;
	height: $size;
	background: transparent;
	border-radius: 50%;
	border: none;
	outline: none;
	cursor: pointer;
	svg {
		width: ms(-1, $dice-size);
		path {
			fill: color.$main;
			transition: fill 0.2s;
		}
	}
	&:before {
		content: '';
		position: absolute;
		z-index: -1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: color.$pale;
		clip-path: circle(50% at 50% 50%);
		transform: scale(0);
		transition: transform 0.2s $bouncy-easing;
	}

	&:not(:disabled):hover {
		svg path {
			fill: color.$dark;
		}
		&::before {
			transform: scale(1);
		}
	}

	&:disabled {
		cursor: default;
		svg path {
			fill: color.$pale;
		}
	}
}
</style>
