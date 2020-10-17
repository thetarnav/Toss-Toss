<template>
	<div v-bind="$attrs" class="preloader-queue" v-if="type === 'queue'">
		<i></i>
		<i></i>
		<i></i>
		<i></i>
	</div>

	<div v-bind="$attrs" class="preloader-newton" v-if="type === 'newton'"></div>

	<div v-bind="$attrs" class="preloader-stretch" v-if="type === 'stretch'">
		<i></i>
		<i></i>
		<i></i>
	</div>

	<div v-bind="$attrs" class="preloader-swap" v-if="type === 'swap'">
		<i></i>
		<i></i>
		<i></i>
	</div>
</template>

<script>
export default {
	name: 'gooey-preloader',
	props: { type: { type: String, default: 'swap' } },
}
</script>

<style lang="scss" scoped>
@use '../../scss/library/variables' as *;
@use '../../scss/library/ms' as *;
@use '../../scss/library/colors' as color;
$duration: 0.5s;
$dot-size: gs(0.5);
$main: color.$white;

.preloader-queue {
	$duration: $duration + 0.05s;
	display: flex;
	width: $dot-size * 4;
	filter: url(#goo-m);
	i {
		width: $dot-size;
		height: $dot-size;
		border-radius: 50%;
		background: $main;
		&:first-child {
			opacity: 0;
			animation: dot-loading-ani2 $duration $bouncy-easing infinite;
			transform: translate(-$dot-size);
		}
		&:nth-child(2),
		&:nth-child(3) {
			animation: dot-loading-ani3 $duration $bouncy-easing infinite;
		}
		&:last-child {
			animation: dot-loading-ani1 $duration $bouncy-easing infinite;
		}
	}

	@keyframes dot-loading-ani1 {
		100% {
			transform: translate($dot-size * 1.618);
			opacity: 0;
		}
	}
	@keyframes dot-loading-ani2 {
		100% {
			transform: translate($dot-size);
			opacity: 1;
		}
	}
	@keyframes dot-loading-ani3 {
		100% {
			transform: translate($dot-size);
		}
	}
}

.preloader-newton {
	$duration: $duration - 0.05s;
	width: $dot-size;
	height: $dot-size;
	border-radius: 50%;
	background: $main;
	filter: url(#goo-m);
	animation: newton-shake $duration infinite;
	delay: $duration/5;

	@keyframes newton-shake {
		90%,
		to {
			transform: none;
		}
		95% {
			transform: translatex($dot-size/10);
		}
	}

	&,
	&:before,
	&:after {
		width: $dot-size;
		height: $dot-size;
		border-radius: 50%;
		background: $main;
	}
	&:before,
	&:after {
		content: '';
		position: absolute;
	}
	&::before {
		left: -$dot-size;
		animation: newton-left $duration * 2 infinite cubic-bezier(0.45, -0.13, 0.51, 1.4);
	}
	&::after {
		left: $dot-size;
		animation: newton-right $duration * 2 infinite cubic-bezier(0.45, -0.13, 0.51, 1.4);
		animation-delay: $duration;
	}
	@keyframes newton-left {
		40%,
		25%,
		100% {
			transform: translateX(0);
		}
		75% {
			transform: translateX(-$dot-size / 1.618) scale(0.7);
		}
	}

	@keyframes newton-right {
		40%,
		25%,
		100% {
			transform: translateX(0);
		}
		75% {
			transform: translateX($dot-size / 1.618) scale(0.7);
		}
	}
}

.preloader-stretch {
	position: relative;
	width: $dot-size;
	height: $dot-size;
	filter: url(#goo-m);

	i {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: $main;

		&:first-child {
			animation: dotStretching $duration infinite alternate;
		}
		&:nth-child(2) {
			animation: dotStretchingBefore $duration infinite alternate;
		}
		&:last-child {
			animation: dotStretchingAfter $duration infinite alternate;
		}
	}
	@keyframes dotStretching {
		60%,
		100% {
			transform: scale(0.618);
		}
		0%,
		20% {
			transform: scale(1);
		}
	}

	@keyframes dotStretchingBefore {
		0%,
		20% {
			transform: scale(0.618);
		}
		90%,
		100% {
			transform: translate(-$dot-size) scale(0.618);
		}
	}

	@keyframes dotStretchingAfter {
		0%,
		20% {
			transform: scale(0.618);
		}
		90%,
		100% {
			transform: translate($dot-size) scale(0.618);
		}
	}
}

.preloader-swap {
	$dot-size: $dot-size / 1.618;
	$gap: $dot-size / 1.618;
	display: flex;
	filter: url(#goo-m);
	i {
		width: $dot-size;
		height: $dot-size;
		border-radius: 50%;
		background: $main;
		margin-right: $gap;
		&:last-child {
			margin-right: 0;
			animation: to-left $duration infinite $bouncy-easing, scale $duration infinite;
		}
		&:first-child,
		&:nth-child(2) {
			animation: to-right $duration infinite $bouncy-easing;
		}
	}

	@keyframes to-left {
		to {
			transform: translatex(-2 * $gap - 2 * $dot-size);
		}
	}
	@keyframes to-right {
		to {
			transform: translatex($gap + $dot-size);
		}
	}
	@keyframes scale {
		50% {
			opacity: 0.618;
		}
	}
}
</style>
