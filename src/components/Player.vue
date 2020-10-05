<template>
	<div
		class="player"
		:class="{
			rightAlign: align === 'right',
			active: isActive,
			winning: isWinning,
		}"
	>
		<header class="name">
			<p class="text">
				{{ playerName }}
			</p>
			<span class="crown">
				<svg
					version="1.2"
					baseProfile="tiny"
					xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					viewBox="0 0 24 24"
					xml:space="preserve"
				>
					<polygon points="24,5.3 22.5,19.1 1.3,19.1 0,5.3 6.7,7.5 11.9,0.9 17.2,7.5 " />
				</svg>
			</span>
		</header>
		<transition-group tag="div" name="scores" class="scores" :duration="400">
			<span key="totalScore" ref="totalScore" class="total">
				{{ totalScore }}
			</span>
			<span key="roundScore" ref="roundScore" class="round animate" v-if="roundScore > 0">
				+{{ roundScore }}
			</span>
		</transition-group>
	</div>
</template>

<script>
import { animateCssClass } from '../js/utilities'

export default {
	name: 'Player',
	props: ['playerName', 'align', 'totalScore', 'roundScore', 'isWinning', 'isActive'],
	watch: {
		totalScore() {
			this.$refs.totalScore && animateCssClass(this.$refs.totalScore, 'animate')
		},
		roundScore(after, before) {
			if (!this.$refs.roundScore || after <= before) return
			animateCssClass(this.$refs.roundScore, 'animate')
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/colors' as color;
@use '../scss/library/variables' as *;
@use '../scss/library/ms' as *;

.player {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	filter: blur(0.45px);
}
.name {
	display: block;
	position: relative;

	.text {
		filter: url(#goo-s);
		font-size: ms(1);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	&:before {
		content: '';
		position: absolute;
		z-index: -1;
		$padding-v: ms(-4);
		$padding-h: ms(-1);
		top: -$padding-v;
		bottom: -$padding-v;
		left: -$padding-h;
		right: -$padding-h;

		background: color.$pale;
		border-radius: ms(0);

		transform: scale(0.5, 0);
		transition: transform 0.2s $bouncy-easing;
	}
}

.crown {
	--from-right: #{- ms(-1)};
	position: absolute;
	right: 100%;
	width: ms(1);
	height: ms(1);
	top: calc(50% - #{ms(1)} / 2);
	transform: scale(0);
	transition: transform 0.2s $bouncy-easing;
	path,
	polygon {
		fill: color.$pale;
	}
}
.scores {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 150px;
}
.total {
	filter: url(#goo-m);
	font-size: ms(2);
	font-weight: 800;
	color: color.$main;
	letter-spacing: -0.02em;
}
.round {
	filter: url(#goo-s);
	font-size: ms(1);
	margin-left: gs(0.5);
	letter-spacing: -0.04em;
}
.round,
.total {
	@keyframes animate-score {
		50% {
			transform: scale(1.618);
		}
	}
	&.animate {
		animation: animate-score 0.5s;
	}
}

.scores-enter-active,
.scores-leave-active,
.scores-move {
	transition: all 1s;
}
.scores-enter,
.scores-leave-to {
	opacity: 0;
}
.scores-leave-active {
	&.round {
		transition: opacity 0.4s, transform 10s;
	}
	position: absolute;
}

.rightAlign {
	margin-left: auto;
	text-align: right;
	align-items: flex-end;
}

.active {
	.crown {
		--from-right: #{- ms(1)};
	}
	.name {
		&:before {
			transform: scale(1);
		}
	}
}

.winning {
	.crown {
		transform: scale(1) translateX(var(--from-right));
	}
}
</style>
