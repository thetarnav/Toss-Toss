<template>
	<button ref="button" class="gooey-button">
		<div class="slot">
			<slot></slot>
		</div>
		<div class="gooey-wrapper">
			<span class="mouse-dot" ref="dot"></span>
			<div class="background"></div>
		</div>
		<GlobalEvents @mousemove="debounceEvent" @mouseenter="handleMove" @mouseleave="reset" />
	</button>
</template>

<script>
import { GlobalEvents } from 'vue-global-events'
import debounce from 'lodash.debounce'
import { clamp } from '@/js/utilities'

import animejs from 'animejs'

const calcDistance = (mouse, bounds) => {
	const margin = bounds.width / 2
	const { clientX: mX, clientY: mY } = mouse
	const distanceXLeft = Math.min(1, (mX - (bounds.x - margin)) / (margin + bounds.width / 2))
	const distanceXRight = Math.min(
		1,
		-(mX - (bounds.x + bounds.width + margin)) / (margin + bounds.width / 2),
	)
	const distanceYTop = Math.min(1, (mY - (bounds.y - margin)) / (margin + bounds.height / 2))
	const distanceYBottom = Math.min(
		1,
		-(mY - (bounds.y + bounds.height + margin)) / (margin + bounds.height / 2),
	)
	return Math.min(distanceXLeft, distanceXRight, distanceYTop, distanceYBottom)
}

export default {
	name: 'gooey-button',
	components: { GlobalEvents },
	data() {
		return { isQuick: false, bounds: null }
	},
	methods: {
		handleMove(e) {
			if (this.bounds === null) return

			const { x, y } = e,
				{ dot } = this.$refs,
				{ bounds } = this,
				{ left, top } = bounds

			let p = calcDistance(e, bounds)
			p = clamp(p, 0, 1)

			if (p > 0) {
				this.isQuick = true

				const moveX = x - left,
					moveY = y - top

				animejs({
					targets: dot,
					translateX: moveX,
					translateY: moveY,
					scale: p,
					duration: 600,
				})
			} else {
				if (this.isQuick) this.reset()
				this.isQuick = false
			}
		},
		reset() {
			if (this.bounds === null) return

			const { width, height } = this.bounds
			animejs({
				targets: this.$refs.dot,
				translateX: width / 2,
				translateY: height / 2,
				scale: 0,
				duration: 1000,
			})
		},
		debounceEvent(e) {
			return this.isQuick ? this.quickDebFunc(e) : this.slowDebFunc(e)
		},
	},
	created() {
		// Setting two different debounce functions:
		this.slowDebFunc = debounce(this.handleMove, 400, {
			maxWait: 400,
			leading: true,
			trailing: false,
		})
		this.quickDebFunc = debounce(this.handleMove, 50, {
			maxWait: 50,
			leading: true,
			trailing: false,
		})
		this.debounceFunc = this.slowDebFunc
	},
	mounted() {
		// Measuring Button size:
		this.bounds = this.$refs.button.getBoundingClientRect()

		this.reset()
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
	font-size: font-size(0);
	font-family: 'Nunito', sans-serif;
	font-weight: 800;
	color: color.$bg;
}

.gooey-wrapper {
	position: absolute;
	z-index: -1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	filter: url(#button-goo);
}
.background {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: color.$pale;

	transition: background 0.2s;
}
.mouse-dot {
	$size: ms(2);
	display: block;
	position: absolute;
	top: -$size/2;
	left: -$size/2;
	width: $size;
	height: $size;
	border-radius: 50%;
	background: color.$pale;
	opacity: 0.6;

	transition: background 0.2s;
}

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
