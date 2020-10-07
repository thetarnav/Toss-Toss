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
			<div class="opponent-won" v-if="winner === 1">
				<h3>
					<span>
						Player 2
					</span>
				</h3>
				<h6>won the game!</h6>
			</div>
			<div class="you-won" v-if="winner === 0">
				<h2>
					You Win!
				</h2>
			</div>
			<GooeyButton class="re-match" @click="rematch">
				Play Again
			</GooeyButton>
			<div class="cover"></div>
		</div>
	</transition>
</template>

<script>
import { mapState } from 'vuex'
import GooeyButton from './GooeyButton'

export default {
	name: 'GameResults',
	components: { GooeyButton },
	computed: {
		...mapState('game', ['winner']),
	},
	methods: {
		rematch() {
			this.$store.dispatch('game/initGame')
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/colors' as color;
@use '../scss/library/variables' as *;
@use '../scss/library/mixins' as *;
@use '../scss/library/ms' as *;

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
h6 {
	@include small-caption;
	color: color.$main;
	text-align: center;
}
h3 {
	text-align: center;
	span {
		@include uppercase-subheading;
	}
	height: gs(1);
}
h2 {
	@include bold-heading;
	color: color.$main;
}

.re-match {
	margin-top: gs(0.5);
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

.appear-enter-active,
.appear-leave-active {
	transition: opacity 0.5s ease;
}

.appear-enter-from,
.appear-leave-to {
	opacity: 0;
}
</style>
