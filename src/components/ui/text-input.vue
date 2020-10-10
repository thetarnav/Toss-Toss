<template>
	<div class="text-input">
		<label :for="name">
			<slot></slot>
		</label>
		<div
			class="input-wrapper"
			:ref="
				el => {
					parent = el
				}
			"
		>
			<input
				v-bind="$attrs"
				type="text"
				:name="name"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.value)"
			/>
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
		</div>
	</div>
</template>

<script>
import { GlobalEvents } from 'vue-global-events'
import gooeyBackground from '@/compositions/gooeyBackground'

export default {
	name: 'text-input',
	// inheritAttrs: false,
	components: { GlobalEvents },
	props: {
		name: String,
		modelValue: String,
	},
	data() {
		return {}
	},
	setup() {
		return { ...gooeyBackground() }
	},
	methods: {},
}
</script>

<style lang="scss" scoped>
@use '../../scss/library/variables' as *;
@use '../../scss/library/ms' as *;
@use '../../scss/library/colors' as color;
@use '../../scss/library/mixins' as *;

.input-wrapper {
	position: relative;
}
label {
	@include h6;
	display: block;
	margin-bottom: ms(-3);
}
input {
	display: block;
	width: 100%;
	// border: 3px solid color.$pale;
	border: none;
	outline: none;
	background: transparent;
	height: ms(1);
	padding: 0 ms(-1);
	@include button-text;
	color: color.$dark;
	caret-color: color.$dark;

	&::placeholder {
		color: color.$dark;
		transition: opacity 0.2s;
	}
	&:focus::placeholder {
		opacity: 0;
	}
	&::selection {
		background: color.$white;
		color: color.$dark;
	}
}

@include gooey-background;
.input-wrapper:hover,
input:focus + .gooey-background {
	.background {
		background: color.$main;
	}
	.mouse-dot {
		background: color.$main;
	}
}
</style>
