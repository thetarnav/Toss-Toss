<template>
	<div
		class="gooey-single-checkbox"
		:class="{ disabled }"
		:ref="el => (parent = el)"
		@click="check"
	>
		<div class="checkbox" :class="{ checked }">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
				<g class="nc-icon-wrapper" fill="#000000">
					<path
						fill-rule="evenodd"
						d="M3.707 9.293a1 1 0 1 0-1.414 1.414l5 5a1 1 0 0 0 1.45-.038l9-10a1 1 0 1 0-1.486-1.338l-8.295 9.217-4.255-4.255z"
					/>
				</g>
			</svg>
		</div>

		<div class="slot single-checkbox-slot">
			<slot></slot>
		</div>

		<div class="gooey-background">
			<span class="mouse-dot" :ref="el => (dot = el)"></span>
			<div class="background"></div>
		</div>

		<GlobalEvents @mousemove="debounceEvent" @mouseenter="handleMove" @mouseleave="reset" />
	</div>
</template>

<script>
import { GlobalEvents } from 'vue-global-events'
import gooeyBackground from '@/compositions/gooeyBackground'

export default {
	name: 'gooey-single-checkbox',
	components: { GlobalEvents },
	props: ['modelValue', 'disabled'],
	data() {
		return {
			checked: false,
		}
	},
	methods: {
		check() {
			if (this.disabled) return
			const value = !this.checked
			this.checked = value
			this.$emit('update:modelValue', value)
			this.$emit('check', value)
		},
	},
	created() {
		this.checked = Boolean(this.modelValue)
	},
	watch: {
		modelValue(value) {
			this.checked = value
		},
	},
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

.gooey-single-checkbox {
	position: relative;
	display: flex;
	align-items: center;
	padding: 0 ms(-1);
	height: ms(1);
	background: none;
	border: none;
	outline: none;
	cursor: pointer;

	transition: transform 0.1s $bouncy-easing;

	&.disabled {
		cursor: default;
		opacity: 0.8;
		.mouse-dot {
			visibility: hidden;
		}
	}
}

.checkbox {
	position: relative;
	width: ms(0);
	height: ms(0);
	border: 4px solid color.$white;
	border-radius: ms(-3);
	margin-right: ms(-3);
	> svg {
		@include absolute-center(gs(1));
		path,
		polygon {
			fill: color.$pale;
			transition: fill 0.2s;
		}
		transition: opacity 0.2s, transform 0.2s;
	}
	transition: background 0.2s, transform 0.1s;

	&:not(.checked) {
		transform: scale(0.9);
		> svg {
			transform: scale(0);
			opacity: 0;
		}
	}
	&.checked {
		background: color.$white;
	}
}

.slot {
	display: flex;
	justify-content: center;
	align-items: center;
	@include button-text;
	color: color.$bg;
	user-select: none;

	transition: opacity 0.2s;

	&.hidden {
		opacity: 0;
	}
}

@include gooey-background;
.gooey-single-checkbox:not(.disabled):hover {
	.background,
	.mouse-dot {
		background: color.$main;
	}
	.checkbox path {
		fill: color.$main;
	}
}
.gooey-single-checkbox:not(.disabled):active {
	transform: scale(0.9);
}
</style>

<style lang="scss">
@use '../../scss/library/ms' as *;
@use '../../scss/library/colors' as color;
.single-checkbox-slot {
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
