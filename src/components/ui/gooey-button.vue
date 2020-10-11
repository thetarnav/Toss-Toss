<template>
	<button
		:ref="
			el => {
				parent = el
			}
		"
		class="gooey-button"
	>
		<div class="slot button-slot">
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
	display: block;
	position: relative;
	padding: ms(-2) ms(-1);
	background: none;
	border: none;
	outline: none;
	cursor: pointer;

	transition: transform 0.1s $bouncy-easing;

	&:disabled {
		cursor: default;
		opacity: 0.8;
		.mouse-dot {
			visibility: hidden;
		}
	}
}
.slot {
	display: flex;
	justify-content: center;
	@include button-text;
	color: color.$bg;
	user-select: none;
}

@include gooey-background;
.gooey-button:not(:disabled):hover {
	.background {
		background: color.$main;
	}
	.mouse-dot {
		background: color.$main;
	}
}
.gooey-button:not(:disabled):active {
	transform: scale(0.9);
}

.round {
	padding: 0;
	.background {
		border-radius: 50%;
	}

	& {
		--size: #{ms(1)};
	}
	&.size-1 {
		--size: #{gs(1)};
	}
	&.size-2 {
		--size: #{gs(2)};
	}
	width: var(--size);
	height: var(--size);
}
</style>

<style lang="scss">
@use '../../scss/library/ms' as *;
@use '../../scss/library/colors' as color;
.button-slot {
	svg {
		width: ms(0);
		height: ms(0);
		path,
		polygon {
			fill: color.$bg;
		}
	}
}
</style>
