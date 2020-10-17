<template>
	<transition appear name="appear">
		<div class="game-results">
			<span class="crown">
				<svg
					version="1.2"
					baseProfile="tiny"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 24 24"
					xml:space="preserve"
				>
					<polygon points="24,5.3 22.5,19.1 1.3,19.1 0,5.3 6.7,7.5 11.9,0.9 17.2,7.5 " />
				</svg>
			</span>
			<div class="you-won" v-if="winner === playerIndex">
				<h2>
					You Win!
				</h2>
			</div>
			<div class="opponent-won" v-else>
				<h3>
					<span>
						{{ opponentName }}
					</span>
				</h3>
				<h5>won the game!</h5>
			</div>

			<nav class="buttons">
				<gooey-button @click="quit">
					Quit
				</gooey-button>
				<gooey-button @click="rematch" v-if="!online">
					Play Again
				</gooey-button>
				<gooey-single-checkbox
					v-else
					v-model="playerReady"
					@check="playerChecksReady"
					:disabled="playerReady"
				>
					Rematch
				</gooey-single-checkbox>
			</nav>

			<div class="message">
				<transition name="message" mode="out-in">
					<span v-if="opponentReady">
						{{ opponentName }} {{ winner === 0 ? 'wants revenge!' : 'is ready.' }}
					</span>
				</transition>
			</div>

			<Fireworks v-if="winner === playerIndex" />
			<div class="cover"></div>
		</div>
	</transition>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
// import GooeyButton from './GooeyButton'
import Fireworks from './Fireworks'

export default {
	name: 'GameResults',
	components: { Fireworks },
	props: ['playerIndex'],
	data() {
		return {
			playerReady: false,
		}
	},
	computed: {
		...mapState('game', ['winner']),
		...mapState(['online']),
		...mapGetters(['opponentName', 'ready']),
		opponentReady() {
			return this.ready[this.$store.getters.opponentIndex]
		},
	},
	methods: {
		playerChecksReady(isReady) {
			if (!isReady) return
			this.$store.dispatch('playerReady')
		},
		rematch() {
			this.$store.dispatch('game/initGame')
		},
		quit() {
			this.$router.push({ name: 'Lobby' })
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/variables' as *;
@use '../scss/library/ms' as *;
@use '../scss/library/colors' as color;
@use '../scss/library/mixins' as *;

.game-results {
	z-index: 1000;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.crown {
	$size: gs(2);
	height: $size;
	width: $size;
	filter: url(#goo-m);
	path,
	polygon {
		fill: color.$main;
	}
}
h5 {
	color: color.$main;
	text-align: center;
}
h3 {
	text-align: center;
	span {
		@include subheading;
	}
	height: gs(1);
}
h2 {
	@include bold-heading;
	color: color.$main;
}

.buttons {
	margin-top: gs(0.5);
	display: flex;
	justify-content: center;
	> * {
		margin: 0 gs(0.5);
	}
}

.cover {
	position: fixed;
	z-index: -10;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: color.$bg;
	opacity: 0.5;
}

.message {
	margin-top: gs(0.5);
	span {
		display: block;
	}
	overflow: hidden;
}

.message-enter-active,
.message-leave-active {
	transition: transform 0.3s $bouncy-easing;
}

.message-enter-from,
.message-leave-to {
	transform: translateY(120%) rotate(-5deg);
}

.appear-enter-active,
.appear-leave-active {
	transition: opacity 0.5s ease;
}

.appear-enter-from,
.appear-leave-to {
	opacity: 0;
}
</style>
