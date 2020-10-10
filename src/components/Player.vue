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
			<span key="total" ref="total" class="total">
				{{ total }}
			</span>
			<span key="round" ref="round" class="round animate" :class="{ lost }" v-if="round > 0">
				+{{ round }}
			</span>
		</transition-group>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import { animateCssClass } from '../js/utilities'

export default {
	name: 'Player',
	props: ['playerIndex', 'align'],
	computed: {
		...mapState('game', ['lost']),
		playerName() {
			if (typeof this.playerIndex !== 'number') return
			return this.$store.getters.playerData(this.playerIndex).name
		},
		total() {
			return this.$store.state.game.totalScore[this.playerIndex]
		},
		round() {
			return this.$store.getters['game/roundScore'][this.playerIndex]
		},
		isWinning() {
			return this.$store.getters['game/winning'] === this.playerIndex
		},
		isActive() {
			return this.$store.state.game.activePlayer === this.playerIndex
		},
	},
	watch: {
		total() {
			this.$refs.total && animateCssClass(this.$refs.total, 'animate')
		},
		round(after, before) {
			if (!this.$refs.round || after <= before) return
			animateCssClass(this.$refs.round, 'animate')
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/variables' as *;
@use '../scss/library/ms' as *;
@use '../scss/library/colors' as color;
@use '../scss/library/mixins' as *;

.player {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	filter: blur(0.4px);
}
.name {
	display: block;
	position: relative;

	.text {
		@include uppercase-subheading;
	}
	@include pill-background($hidden: true);
}

.crown {
	--from-right: #{- ms(-1)};
	position: absolute;
	right: 100%;
	$size: ms(-1, $dice-size);
	width: $size;
	height: $size;
	top: calc(50% - #{$size} / 2);
	filter: url(#goo-s);
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
	@include bold-heading;
	color: color.$main;
}
.round {
	position: relative;
	filter: url(#goo-s);
	font-size: font-size(1);
	margin-left: gs(0.5);
	letter-spacing: -0.04em;

	&:after {
		content: '';
		position: absolute;
		height: ms(-3);
		width: 100%;
		background: color.$pale;
		top: calc(50% - #{ms(-3)} / 2);
		left: 0.5ch;
		transition: transform 0.2s $bouncy-easing;
	}
	&:not(.lost):after {
		transform: translateX(-50%) scale(0, 1);
	}
	&.lost {
		color: color.$pale;
	}
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
