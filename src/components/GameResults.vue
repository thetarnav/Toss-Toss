<template>
	<div class="game-results">
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
		<GooeyButton>
			Play Again
		</GooeyButton>
	</div>
</template>

<script>
import GooeyButton from './GooeyButton'

export default {
	name: 'GameResults',
	components: { GooeyButton },
	data() {
		return {
			winner: 0,
		}
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/colors' as color;
@use '../scss/library/variables' as *;
@use '../scss/library/mixins' as *;
@use '../scss/library/ms' as *;

.game-results {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
h6 {
	@include small-caption;
	color: color.$main;
	text-align: center;
}
h3 {
	position: relative;
	text-align: center;
	span {
		@include uppercase-subheading;
	}

	@include pill-background;
}
h2 {
	@include bold-heading;
	color: color.$main;
}
</style>
