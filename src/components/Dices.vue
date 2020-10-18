<template>
	<transition appear name="wrapper" :duration="400">
		<div class="wrapper" :class="{ hidden: winner !== null }">
			<transition-group name="selection" tag="div" class="selection">
				<div
					v-for="dice in dices"
					:key="dice.id"
					:class="{ selected: dice.isSelected || dice.isGone }"
					class="selection-item"
				></div>
			</transition-group>
			<transition-group appear name="dices" tag="div" class="dices">
				<div
					v-for="dice in dices"
					:key="dice.id"
					class="dice"
					:data-nr="dice.nr"
					@click="click(dice.id)"
					:class="{
						selected: dice.isSelected,
						disabled: dice.isDisabled || notActive,
						gone: dice.isGone,
					}"
				>
					<ul class="dots">
						<li v-for="(dot, index) in 9" :key="index" class="dot active"></li>
					</ul>
					<ul class="dots">
						<li v-for="(dot, index) in 9" :key="index" class="dot inactive"></li>
					</ul>
				</div>
			</transition-group>
		</div>
	</transition>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
	name: 'Dices',
	props: {
		notActive: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {}
	},
	computed: {
		...mapState('game', ['dices', 'winner']),
	},
	methods: {
		...mapActions({ select: 'game/select' }),
		click(id) {
			if (!this.notActive) this.select(id)
		},
	},
}
</script>

<style lang="scss" scoped>
@use '../scss/library/variables' as *;
@use '../scss/library/ms' as *;
@use '../scss/library/colors' as color;
@use '../scss/library/mixins' as *;

$size: $dice-size;
$margin: $dice-margin;
$dot-size: ms(-3, $dice-size);
$padding: 0;

@mixin hidden-board {
	.dice {
		pointer-events: none;
		.dot {
			transform: scale(0) !important;
		}
	}
}

.wrapper {
	position: relative;
	&.hidden {
		@include hidden-board;
	}
}
.wrapper-enter-from,
.wrapper-leave-to {
	@include hidden-board;
}

.dices {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	align-content: center;
	width: $size * 3 + $margin * 3;
	min-height: $size * 2 + $margin * 2;

	@media screen and (max-width: $smallest-mq) {
		width: $size * 2 + $margin * 2;
	}
}
.dice {
	position: relative;
	height: $size;
	width: $size;
	margin: $margin / 2;
	cursor: pointer;

	.dots {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		filter: url(#goo-l);
	}

	$mid: calc(50% - #{$dot-size}/ 2);
	@mixin middle {
		left: $mid;
		top: $mid;
	}
	@mixin top-right {
		right: $padding;
		top: $padding;
	}
	@mixin bottom-left {
		left: $padding;
		bottom: $padding;
	}
	@mixin bottom-right {
		right: $padding;
		bottom: $padding;
	}
	@mixin top-left {
		left: $padding;
		top: $padding;
	}
	@mixin left-middle {
		left: $padding;
		top: $mid;
	}
	@mixin right-middle {
		right: $padding;
		top: $mid;
	}

	@mixin hidden-dot {
		transform: scale(0);
	}
	@mixin visible-dot {
		transform: scale(1);
	}
	@mixin active-dot {
		@include visible-dot;
		&.inactive {
			@include hidden-dot;
		}
	}

	.dot {
		position: absolute;
		display: block;
		width: $dot-size;
		height: $dot-size;
		background: color.$main;
		border-radius: 50%;

		transition: transform 0.4s $bouncy-easing, background 0.2s;
		&.active {
			background: color.$dark;
			@include hidden-dot;
		}

		&:nth-of-type(1) {
			@include top-left;
		}
		&:nth-of-type(2) {
			@include top-right;
		}
		&:nth-of-type(3) {
			@include bottom-right;
		}
		&:nth-of-type(4) {
			@include bottom-left;
		}
		&:nth-of-type(5) {
			@include left-middle;
		}
		&:nth-of-type(6) {
			@include right-middle;
		}
		&:nth-of-type(7) {
			top: $padding;
			left: $mid;
		}
		&:nth-of-type(8) {
			@include middle;
		}
		&:nth-of-type(9) {
			bottom: $padding;
			left: $mid;
		}
	}

	&[data-nr='1'] .dot {
		&:nth-of-type(8) {
			@include active-dot;
		}
	}
	&[data-nr='2'] .dot {
		&:nth-of-type(2),
		&:nth-of-type(4) {
			@include active-dot;
		}
	}
	&[data-nr='3'] .dot {
		&:nth-of-type(2),
		&:nth-of-type(4),
		&:nth-of-type(8) {
			@include active-dot;
		}
	}
	&[data-nr='4'] .dot {
		&:nth-of-type(1),
		&:nth-of-type(2),
		&:nth-of-type(3),
		&:nth-of-type(4) {
			@include active-dot;
		}
	}
	&[data-nr='5'] .dot {
		&:nth-of-type(1),
		&:nth-of-type(2),
		&:nth-of-type(3),
		&:nth-of-type(4),
		&:nth-of-type(8) {
			@include active-dot;
		}
	}
	&[data-nr='6'] .dot {
		&:nth-of-type(1),
		&:nth-of-type(2),
		&:nth-of-type(3),
		&:nth-of-type(4),
		&:nth-of-type(5),
		&:nth-of-type(6) {
			@include active-dot;
		}
	}

	// dices:
	transition: transform 0.5s $bouncy-easing;

	&.selected {
		.inactive {
			transform: scale(0);
		}
	}
	&.disabled {
		cursor: default;
		.dot.inactive {
			background: color.$pale;
		}
		.dot.active {
			background: color.$main;
		}
	}
	&.gone {
		cursor: default;
		.inactive {
			transform: scale(0);
		}
		.active {
			background: color.$main;
		}
	}
}

.dices-enter,
.dices-leave-to {
	.dot {
		transform: scale(0) !important;
	}
}
.dices-leave-active {
	position: absolute;
}

.selection {
	pointer-events: none;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	align-content: center;
	filter: url(#goo-xl);

	&-item {
		position: relative;
		height: $size;
		width: $size;
		margin: $margin / 2;

		&:after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background: color.$pale;
			border-radius: 50%;
			transform: scale(0);
			transition: transform 0.2s $bouncy-easing;
		}

		&.selected:after {
			transform: scale(1.618);
		}
	}
}
</style>
