<template>
	<canvas ref="fireworks" class="fireworks"></canvas>
</template>

<style lang="scss" scoped>
.fireworks {
	position: fixed;
	z-index: -9;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>

<script>
import anime from 'animejs'
export default {
	name: 'Fireworks',
	mounted() {
		// Fireworks script from: https://codepen.io/juliangarnier/pen/gmOwJX

		const canvasEl = this.$refs.fireworks
		const ctx = canvasEl.getContext('2d')
		const numberOfParticles = 20
		const colors = ['#ffbb91', '#ff8e6e', '#515070']

		function setCanvasSize() {
			canvasEl.width = window.innerWidth * 2
			canvasEl.height = window.innerHeight * 2
			canvasEl.getContext('2d').scale(2, 2)
		}

		function setParticuleDirection(p) {
			const angle = (anime.random(0, 360) * Math.PI) / 180
			const value = anime.random(50, 180)
			const radius = [-1, 1][anime.random(0, 1)] * value
			return {
				x: p.x + radius * Math.cos(angle),
				y: p.y + radius * Math.sin(angle),
			}
		}

		function createParticule(x, y) {
			const p = {}
			p.x = x
			p.y = y
			p.color = colors[anime.random(0, colors.length - 1)]
			p.radius = anime.random(16, 32)
			p.endPos = setParticuleDirection(p)
			p.draw = function() {
				ctx.beginPath()
				ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
				ctx.fillStyle = p.color
				ctx.fill()
			}
			return p
		}

		function createCircle(x, y) {
			const p = {}
			p.x = x
			p.y = y
			p.color = '#FFF'
			p.radius = 0.1
			p.alpha = 0.5
			p.lineWidth = 6
			p.draw = function() {
				ctx.globalAlpha = p.alpha
				ctx.beginPath()
				ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
				ctx.lineWidth = p.lineWidth
				ctx.strokeStyle = p.color
				ctx.stroke()
				ctx.globalAlpha = 1
			}
			return p
		}

		function renderParticule(anim) {
			for (let i = 0; i < anim.animatables.length; i++) {
				anim.animatables[i].target.draw()
			}
		}

		function animateParticules(x, y) {
			const circle = createCircle(x, y)
			const particules = []
			for (let i = 0; i < numberOfParticles; i++) {
				particules.push(createParticule(x, y))
			}
			anime
				.timeline()
				.add({
					targets: particules,
					x: function(p) {
						return p.endPos.x
					},
					y: function(p) {
						return p.endPos.y
					},
					radius: 0.1,
					duration: anime.random(1200, 1800),
					easing: 'easeOutExpo',
					update: renderParticule,
				})
				.add({
					targets: circle,
					radius: anime.random(80, 160),
					lineWidth: 0,
					alpha: {
						value: 0,
						easing: 'linear',
						duration: anime.random(600, 800),
					},
					duration: anime.random(1200, 1800),
					easing: 'easeOutExpo',
					update: renderParticule,
					offset: 0,
				})
		}

		anime({
			duration: Infinity,
			update: function() {
				ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
			},
		})

		const centerX = window.innerWidth / 2
		const centerY = window.innerHeight / 2

		let clicks = 0
		function autoClick() {
			if (clicks >= 3) return
			clicks++
			animateParticules(
				anime.random(centerX - 50, centerX + 50),
				anime.random(centerY - 50, centerY + 50),
			)
			anime({ duration: 200 }).finished.then(autoClick)
		}

		autoClick()
		setCanvasSize()
		window.addEventListener('resize', setCanvasSize, false)
	},
}
</script>
