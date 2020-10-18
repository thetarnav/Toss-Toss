import { ref, onMounted } from 'vue'
import debounce from 'lodash.debounce'
import { clamp } from '@/js/utilities'

import animejs from 'animejs'

const calcDistance = (mouse, bounds) => {
	const margin = bounds.width / 2,
		{ clientX: mX, clientY: mY } = mouse,
		distanceXLeft = Math.min(1, (mX - (bounds.x - margin)) / (margin + bounds.width / 2)),
		distanceXRight = Math.min(
			1,
			-(mX - (bounds.x + bounds.width + margin)) / (margin + bounds.width / 2),
		),
		distanceYTop = Math.min(1, (mY - (bounds.y - margin)) / (margin + bounds.height / 2)),
		distanceYBottom = Math.min(
			1,
			-(mY - (bounds.y + bounds.height + margin)) / (margin + bounds.height / 2),
		)
	return Math.min(distanceXLeft, distanceXRight, distanceYTop, distanceYBottom)
}

export default function gooeyBackground() {
	const parent = ref(null),
		dot = ref(null),
		isQuick = ref(false),
		bounds = ref(null),
		slowDebFunc = ref(
			debounce(handleMove, 400, {
				maxWait: 400,
				leading: true,
				trailing: false,
			}),
		),
		quickDebFunc = ref(
			debounce(handleMove, 50, {
				maxWait: 50,
				leading: true,
				trailing: false,
			}),
		)

	onMounted(() => {
		// Measuring parent size:
		bounds.value = parent.value.getBoundingClientRect()

		reset()
	})

	function handleMove(e) {
		if (bounds.value === null || window.innerWidth < 500) return

		const { x, y } = e,
			{ left, top } = bounds.value

		let p = calcDistance(e, bounds.value)
		p = clamp(p, 0, 1)

		if (p > 0) {
			isQuick.value = true

			const moveX = x - left,
				moveY = y - top

			animejs({
				targets: dot.value,
				translateX: moveX,
				translateY: moveY,
				scale: p,
				duration: 600,
			})
		} else {
			if (isQuick.value) reset()
			isQuick.value = false
		}
	}

	function reset() {
		if (bounds.value === null) return

		const { width, height } = bounds.value
		animejs({
			targets: dot.value,
			translateX: width / 2,
			translateY: height / 2,
			scale: 0,
			duration: 1000,
		})
	}

	function debounceEvent(e) {
		return isQuick.value ? quickDebFunc.value(e) : slowDebFunc.value(e)
	}

	return {
		dot,
		parent,
		reset,
		debounceEvent,
		handleMove,
	}
}
