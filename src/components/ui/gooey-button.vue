<template>
	<button
		:ref="
			el => {
				parent = el
			}
		"
		class="gooey-button"
	>
		<div class="slot">
			<slot></slot>
		</div>

		<div class="gooey-background">
			<span
				class="mouse-dot"
				:ref="
					el => {
						dot = el
					}
				"
			></span>
			<div class="background"></div>
		</div>
		<GlobalEvents @mousemove="debounceEvent" @mouseenter="handleMove" @mouseleave="reset" />
	</button>
</template>

<script>
import { GlobalEvents } from 'vue-global-events'
import gooeyBackground from '@/compositions/gooeyBackground'

export default {
	name: 'gooey-button',
	components: { GlobalEvents },
	setup() {
		return { ...gooeyBackground() }
	},
}
</script>

<style lang="scss" scoped>
@use '../../scss/library/variables' as *;
@use '../../scss/library/ms' as *;
@use '../../scss/library/colors' as color;
@use '../../scss/library/mixins' as *;

.gooey-button {
	position: relative;
	padding: ms(-2) ms(-1);
	background: none;
	border: none;
	outline: none;
	cursor: pointer;

	transition: transform 0.1s $bouncy-easing;
}
.slot {
	display: flex;
	@include button-text;
	color: color.$bg;
}

@include gooey-background;
.gooey-button:hover {
	.background {
		background: color.$main;
	}
	.mouse-dot {
		background: color.$main;
	}
}
.gooey-button:active {
	transform: scale(0.9);
}
</style>
