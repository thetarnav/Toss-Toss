<template>
	<button :ref="el => (parent = el)" class="gooey-button">
		<div class="slot button-slot" :class="{ hidden: loading }">
			<slot></slot>
		</div>
		<transition name="fade">
			<div v-if="loading" class="loader-frame">
				<gooey-preloader type="swap" class="loader"></gooey-preloader>
			</div>
		</transition>

		<div class="gooey-background">
			<span class="mouse-dot" :ref="el => (dot = el)"></span>
			<div class="message-frame">
				<transition appear name="t-from-top">
					<div class="message" v-if="message">
						<span>
							{{ message }}
						</span>
					</div>
				</transition>
			</div>
			<div class="background"></div>
		</div>
		<GlobalEvents @mousemove="debounceEvent" @mouseenter="handleMove" @mouseleave="reset" />
	</button>
</template>

<script>
import { GlobalEvents } from 'vue-global-events'
import gooeyBackground from '@/compositions/gooeyBackground'
import gooeyPreloader from '@/components/ui/gooey-preloader.vue'

export default {
	name: 'gooey-button',
	props: ['loading', 'message'],
	data() {
		return {
			// loading: true,
		}
	},
	components: { GlobalEvents, gooeyPreloader },
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

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.loader-frame {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.gooey-button {
	display: block;
	position: relative;
	padding: 0 ms(-1);
	height: ms(1);
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

	transition: opacity 0.2s;

	&.hidden {
		opacity: 0;
	}
}

.message-frame {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	display: flex;
}
.message {
	margin: 0 auto;
	background: color.$pale;
	padding: ms(-3) ms(-2);
	user-select: none;
	font-size: font-size(-1);
	font-family: 'Nunito', sans-serif;
	color: color.$bg;

	transition: background 0.2s;
}

.t-from-top-enter-active,
.t-from-top-leave-active {
	transition: transform 0.2s $bouncy-easing, background 0.2s;
	> span {
		transition: opacity 0.2s;
	}
}

.t-from-top-enter-from,
.t-from-top-leave-to {
	transform: translateY(-100%);
	> span {
		opacity: 0;
	}
}

@include gooey-background;
.gooey-button:not(:disabled):hover {
	.background,
	.message,
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
