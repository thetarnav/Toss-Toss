<template>
	<button ref="button" class="gooey-button">
		<slot> </slot>
		<div class="gooey-wrapper">
			<span class="mouseDot" ref="dot"></span>
			<div class="background"></div>
		</div>
	</button>
	<GlobalEvents @mousemove="debounceEvent" @mouseenter="handleMove" />
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
	name: 'GooeyButton',
	components: { GlobalEvents },
	data() {
		return { isQuick: false, reset: true }
	},
	methods: {
		handleMove(e) {
			const { x, y } = e,
				el = this.$refs.button,
				{ dot } = this.$refs,
				bounds = el.getBoundingClientRect(),
				{ left, top } = bounds

			let p = calcDistance(e, bounds)
			p = clamp(p, 0, 1)

			if (p > 0) {
				this.reset = false
				this.isQuick = true

				const moveX = x - left,
					moveY = y - top

				animejs({
					targets: dot,
					translateX: moveX,
					translateY: moveY,
					scale: p,
					duration: 1000,
				})
			} else {
				this.isQuick = false
				if (!this.reset) {
					const { width, height } = bounds
					animejs({
						targets: dot,
						translateX: width / 2,
						translateY: height / 2,
						scale: 0,
						duration: 2000,
					})
				}
			}
		},
		debounceEvent(e) {
			return this.isQuick ? this.quickDebFunc(e) : this.slowDebFunc(e)
		},
		mounted() {
			const buttons = document.querySelectorAll('button[data-gooey]')
			const mouseDot = document.createElement('SPAN')
			const margin = 50
			const size = 100

			const calcDistance = (mouse, bounds) => {
				const { clientX: mX, clientY: mY } = mouse
				const distanceXLeft = Math.min(
					1,
					(mX - (bounds.x - margin)) / (margin + bounds.width / 2),
				)
				const distanceXRight = Math.min(
					1,
					-(mX - (bounds.x + bounds.width + margin)) / (margin + bounds.width / 2),
				)
				const distanceYTop = Math.min(
					1,
					(mY - (bounds.y - margin)) / (margin + bounds.height / 2),
				)
				const distanceYBottom = Math.min(
					1,
					-(mY - (bounds.y + bounds.height + margin)) / (margin + bounds.height / 2),
				)
				return Math.min(distanceXLeft, distanceXRight, distanceYTop, distanceYBottom)
			}

			window.addEventListener('mousemove', e => {
				const x = e.clientX
				const y = e.clientY
				let inside = buttons.length

				buttons.forEach(button => {
					const bounds = button.getBoundingClientRect()

					if (
						x > bounds.x - margin &&
						x < bounds.x + bounds.width + margin &&
						y > bounds.y - margin &&
						y < bounds.y + bounds.height + margin
					) {
						inside++
						const distance = calcDistance(e, bounds)
						mouseDot.size = size * distance
						mouseDot.style.width = `${size * distance}px`
						mouseDot.style.height = `${size * distance}px`
						mouseDot.style.background = window.getComputedStyle(button).backgroundColor
					} else {
						inside--
					}
				})

				if (inside !== 0) {
					mouseDot.style.visibility = 'visible'
					mouseDot.style.left = `${x - mouseDot.size / 2}px`
					mouseDot.style.top = `${y - mouseDot.size / 2}px`
				} else {
					mouseDot.style.visibility = 'hidden'
				}
			})
		},
	},
	created() {
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
}
</script>

<style lang="scss" scoped>
@use '../scss/library/colors' as color;
@use '../scss/library/variables' as *;
@use '../scss/library/mixins' as *;
@use '../scss/library/ms' as *;

.gooey-button {
	position: relative;
	padding: ms(-2) ms(-1);
	background: none;
	border: none;
	outline: none;
	cursor: pointer;
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
	background: color.$main;
}
.mouseDot {
	$size: ms(2);
	display: block;
	position: absolute;
	top: -$size/2;
	left: -$size/2;
	width: $size;
	height: $size;
	border-radius: 50%;
	background: color.$main;
	opacity: 0.5;
	transform: scale(0) translate($size, $size);
}
</style>
